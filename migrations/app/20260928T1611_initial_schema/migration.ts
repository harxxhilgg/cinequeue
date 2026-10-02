#!/usr/bin/env -S node
import type { Contract as End } from "../../snapshots/38159bf31d25b8bccb08cce8d6249683185edf1cb74ba4d0c9ffd8bec53b4ef9/contract";
import endContract from "../../snapshots/38159bf31d25b8bccb08cce8d6249683185edf1cb74ba4d0c9ffd8bec53b4ef9/contract.json" with { type: "json" };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from "@prisma/orm-postgres/migration";

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: "public" }),
      this.createTable({
        schema: "public",
        table: "Media",
        columns: [
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("externalId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("id", "SERIAL", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("mediaType", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("posterUrl", "text", { codecRef: { codecId: "pg/text@1" } }),
          col("source", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("title", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("updatedAt", "timestamptz", {
            notNull: true,
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "Media_mediaType_check_281b15cc",
            "\"mediaType\" IN ('MOVIE', 'TV')",
          ),
          checkExpression(
            "Media_source_check_1eb2cc39",
            "\"source\" IN ('TMDB')",
          ),
        ],
      }),
      this.createTable({
        schema: "public",
        table: "UserMedia",
        columns: [
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("id", "SERIAL", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("mediaId", "int4", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("position", "int4", {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("status", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("updatedAt", "timestamptz", {
            notNull: true,
            codecRef: { codecId: "pg/timestamptz-string@1" },
          }),
          col("userId", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "UserMedia_status_check_3044635d",
            "\"status\" IN ('WATCHLIST', 'WATCHING', 'UPCOMING', 'WATCHED')",
          ),
        ],
      }),
      this.addUnique({
        schema: "public",
        table: "Media",
        constraint: "Media_source_externalId_key",
        columns: ["source", "externalId"],
      }),
      this.addUnique({
        schema: "public",
        table: "UserMedia",
        constraint: "UserMedia_userId_mediaId_key",
        columns: ["userId", "mediaId"],
      }),
      this.createIndex({
        schema: "public",
        table: "UserMedia",
        index: "UserMedia_mediaId_idx_6b06655c",
        columns: ["mediaId"],
      }),
      this.createIndex({
        schema: "public",
        table: "UserMedia",
        index: "UserMedia_userId_status_idx_e4a128ba",
        columns: ["userId", "status"],
      }),
      this.addForeignKey({
        schema: "public",
        table: "UserMedia",
        foreignKey: {
          name: "UserMedia_mediaId_fkey",
          columns: ["mediaId"],
          references: { schema: "public", table: "Media", columns: ["id"] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
