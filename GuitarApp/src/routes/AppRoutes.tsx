﻿import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { HomePage } from "./Home";
import { FretboardVisualization } from "./fretboard-visualization/FretboardVisualization";
import { ArticlesPage } from "./articles-page/articles-page";
import { articlesLoader } from "./articles-page/articles-loader";
import { ArticlePage } from "./article-page/article-page";
import { articleLoader } from "./article-page/article-loader";
import { Header } from "../ui/header/header";

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header></Header>
          <Outlet />
        </>
      ),
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "articles",
          element: <ArticlesPage />,
          loader: articlesLoader,
        },
        {
          path: "articles/:slug",
          element: <ArticlePage />,
          loader: ({ params }) => articleLoader(params.slug ?? ""),
        },
        {
          path: "visualizer",
          element: <FretboardVisualization />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
