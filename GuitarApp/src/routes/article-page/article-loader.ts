import { getArticle } from "../../sanity/sanity-client";

export const articleLoader = async (slug: string) => {
  const article = await getArticle(slug.toLowerCase().trim());

  return { article };
};
