import { getServerTrack } from "@/lib/getServerTrack";
import { permanentRedirect } from "next/navigation";

// `permanentRedirect` (308), not `redirect` (307): a temporary redirect tells
// Google to keep /blog in its crawl queue indefinitely and never consolidate
// signals onto the destination, which is why it kept resurfacing in Search
// Console. Crawlers send no cookie, so they deterministically land on
// /blog/javascript while logged-in users still get their active track.
export default async function BlogRootPage() {
  const track = await getServerTrack();
  permanentRedirect(`/blog/${track}`);
}
