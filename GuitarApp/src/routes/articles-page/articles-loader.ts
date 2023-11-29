import { getArticles } from "../../sanity/sanity-client";

export const articlesLoader = async () => {
  const articles = await getArticles();

  return { articles };
};
