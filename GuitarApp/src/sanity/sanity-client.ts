import { createClient } from "@sanity/client";
import { Article } from "../types/types";

export const client = createClient({
  projectId: "zodrkwww",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-03",
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

export async function getArticles() {
  return await client.fetch<Article[]>('*[_type == "article"]');
}

export async function getArticle(slug: string) {
  return await client.fetch<Article>(
    `*[_type == "article" && slug.current == "${slug}"][0]`
  );
}
