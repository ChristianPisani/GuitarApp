import { useLoaderData } from "react-router-dom";
import { Article } from "../../types/types";
import { getCurrentRelativeUrl } from "../../hooks/url-hooks";
export const ArticlesPage = () => {
  const { articles } = useLoaderData() as { articles: Article[] };
  const pathName = getCurrentRelativeUrl();

  return (
    <div className={"content"}>
      <ol>
        {articles.map((article) => {
          return (
            <li>
              <a href={`${pathName}/${article.slug.current}`}>
                <strong>{article.title}</strong>
                <p>{article.description}</p>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
