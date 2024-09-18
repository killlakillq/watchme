/*
  Warnings:

  - You are about to drop the column `movie_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "watchlists" DROP CONSTRAINT "watchlists_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "watchlists" DROP CONSTRAINT "watchlists_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "movie_id",
ADD COLUMN     "watchlist_id" TEXT;

-- CreateTable
CREATE TABLE "MoviesOnWatchlists" (
    "movie_id" TEXT NOT NULL,
    "watchlist_id" TEXT NOT NULL,

    CONSTRAINT "MoviesOnWatchlists_pkey" PRIMARY KEY ("movie_id","watchlist_id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "watchlists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesOnWatchlists" ADD CONSTRAINT "MoviesOnWatchlists_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesOnWatchlists" ADD CONSTRAINT "MoviesOnWatchlists_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "watchlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
