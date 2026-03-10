"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getTopic, updateTopic, deleteTopic } from "@/lib/topics";
import { revalidateTopic } from "@/lib/adminRevalidate";
import TopicForm from "@/app/admin/components/TopicForm";
import type { Topic, TopicInput } from "@/types/topic";
import { C } from "@/styles/tokens";
import { ArrowLeft } from "lucide-react";

export default function EditTopicPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopic(params.id).then((t) => {
      setTopic(t);
      setLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(data: TopicInput) {
    await updateTopic(params.id, data);
    // Granular: only bust this topic's cache, not all 35
    await revalidateTopic(data.slug);
    router.push("/admin/topics");
  }

  async function handleDelete() {
    await deleteTopic(params.id);
    // Bust the specific topic cache + topics list
    if (topic) await revalidateTopic(topic.slug);
    router.push("/admin/topics");
  }

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "3rem" }}
      >
        Loading…
      </div>
    );
  if (!topic) return <div style={{ color: C.danger }}>Topic not found.</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.75rem",
        }}
      >
        <Link
          href="/admin/topics"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            color: C.muted,
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          <ArrowLeft size={15} /> All Topics
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>
          Edit: {topic.keyword}
        </h1>
      </div>
      <TopicForm
        mode="edit"
        initial={topic}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}