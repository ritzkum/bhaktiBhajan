import { NextResponse } from "next/server";
import { songsData, categories, artistLinks } from "@/lib/songs-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  
  const validCategories = categories.map(c => c.id);
  
  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { success: false, error: "Invalid category" },
      { status: 400 }
    );
  }

  const filteredSongs = category === "all" 
    ? songsData 
    : songsData.filter((song) => song.category === category);

  const links = artistLinks[category as keyof typeof artistLinks];

  return NextResponse.json({
    success: true,
    category,
    data: filteredSongs,
    total: filteredSongs.length,
    links,
  });
}
