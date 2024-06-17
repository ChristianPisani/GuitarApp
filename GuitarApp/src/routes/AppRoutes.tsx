import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { FretboardVisualization } from './fretboard-visualization/FretboardVisualization'
import { Header } from '../ui/header/header'
import { SequencerPage } from './sequencer-page/sequencer-page'

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Header></Header>
          <Outlet />
        </>
      ),
      children: [
        {
          path: 'visualization',
          element: <FretboardVisualization />,
        },
        { path: '', element: <SequencerPage /> },
        /*{
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
        },*/
      ],
    },
  ])

  return <RouterProvider router={router} />
}
