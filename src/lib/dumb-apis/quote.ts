import axios from "axios";
import { redis } from "../redis/client";

type DailyQuote = {
  quote: string;
  author: string;
  date: string;
};

const REDIS_KEY_PREFIX = "plotq:daily-quote";

function getUtcDate() {
  return new Date().toISOString().slice(0, 10);
}

function getSecondsUntilUtcMidnight() {
  const now = new Date();

  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  return Math.max(60, Math.floor((tomorrow.getTime() - now.getTime()) / 1000));
}

export async function getDailyQuote(): Promise<DailyQuote> {
  const today = getUtcDate();
  const redisKey = `${REDIS_KEY_PREFIX}:${today}`;

  const cachedQuote = await redis.get<DailyQuote>(redisKey);

  if (cachedQuote) {
    // console.log("Quote loaded from Redis.");
    return cachedQuote;
  }

  // console.log("Quote not in Redis - fetching from Dumb APIs");

  const response = await axios.get<DailyQuote>(
    "https://dumbapis.com/daily/quote",
  );

  const quote = response.data;

  if (!quote.quote || !quote.author || !quote.date) {
    throw new Error("Invalid quote response from Dumb APIs.");
  }

  await redis.set(redisKey, quote, {
    ex: getSecondsUntilUtcMidnight(),
  });

  // console.log("Quote saved to Redis.");

  return quote;
}
