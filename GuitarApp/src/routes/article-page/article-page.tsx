import { useLoaderData } from "react-router-dom";
import { Article } from "../../types/types";
import { PortableText } from "@portabletext/react";
import "./article-page.scss";

export const ArticlePage = () => {
  const { article } = useLoaderData() as { article: Article };

  return (
    <div className={"article"}>
      <div className={"container"}>
        <h1>{article.title}</h1>
        <p className={"subtitle"}>{article.description}</p>
        <PortableText value={article.content} />
      </div>
    </div>
  );
};
