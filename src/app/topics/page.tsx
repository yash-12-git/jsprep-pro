import { getServerTrack } from "@/lib/getServerTrack";
import { redirect } from "next/navigation";

export default async function TopicsRootPage() {
  const track = await getServerTrack();
  redirect(`/topics/${track}`);
}
