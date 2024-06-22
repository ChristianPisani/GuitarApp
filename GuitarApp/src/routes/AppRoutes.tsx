import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { FretboardVisualization } from './fretboard-visualization/FretboardVisualization'
import { Header } from '../ui/header/header'
import { SequencerPage } from './sequencer-page/sequencer-page'
import { ChordsEditor } from '../ui/sequencer/chords-editor'

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
        {
          path: '',
          element: <SequencerPage />,
          children: [
            {
              path: '',
              element: <ChordsEditor />,
            },
            { path: 'chords', element: <ChordsEditor /> },
            { path: 'effects', element: <></> },
          ],
        },
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
