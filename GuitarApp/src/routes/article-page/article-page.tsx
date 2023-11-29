import { useLoaderData } from "react-router-dom";
import { Article } from "../../types/types";
import { PortableText } from "@portabletext/react";

export const ArticlePage = () => {
  const { article } = useLoaderData() as { article: Article };

  console.log({ article });

  return (
    <div className={"container"}>
      <h1>{article.title}</h1>
      <p>{article.description}</p>
      <PortableText value={article.content} />
    </div>
  );
};
