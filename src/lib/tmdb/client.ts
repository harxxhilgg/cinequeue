import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
    Accept: "application/json",
  },
});

export default tmdb;
