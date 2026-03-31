import { getServerTrack } from "@/lib/getServerTrack";
import { redirect } from "next/navigation";

export default async function BlogRootPage() {
  const track = await getServerTrack();
  redirect(`/blog/${track}`);
}
