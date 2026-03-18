// app/page.tsx — SERVER COMPONENT
// Emotion cannot run in server components (uses createContext internally).
// Solution: this file is a pure server shell that:
//   1. Exports metadata (works because no "use client")
//   2. Injects JSON-LD schema tags server-side
//   3. Renders <HomePageClient> which handles all Emotion styling
//
// Googlebot sees: <title>, meta description, OG tags, JSON-LD schemas
// in the initial HTML response — which is all that matters for SEO.

import { courseSchema } from "@/lib/seo/seo";
import HomePageClient from "./HomePageClient";


export default function HomePage() {
  return (
    <>
      {/* Schema injected server-side — crawlers see this immediately */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: courseSchema() }}
      />
      <HomePageClient />
    </>
  );
}
