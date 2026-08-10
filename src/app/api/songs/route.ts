import { NextResponse } from "next/server";
import { songsData, categories, artistLinks } from "@/lib/songs-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const mood = searchParams.get("mood");

  let filteredSongs = [...songsData];

  // Filter by category
  if (category && category !== "all") {
    filteredSongs = filteredSongs.filter((song) => song.category === category);
  }

  // Filter by mood
  if (mood && mood !== "all") {
    filteredSongs = filteredSongs.filter((song) => song.mood === mood);
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSongs = filteredSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchLower) ||
        song.artist.toLowerCase().includes(searchLower)
    );
  }

  return NextResponse.json({
    success: true,
    data: filteredSongs,
    total: filteredSongs.length,
    categories,
    artistLinks,
  });
}
