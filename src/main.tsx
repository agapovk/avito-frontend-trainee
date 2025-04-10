import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import NotFound from './components/NotFound.tsx';
import Boards from './components/Boards.tsx';
import Board from './components/Board.tsx';
import Issues from './components/Issues.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/issues" replace />,
      },
      {
        path: 'issues',
        element: <Issues />,
      },
      {
        path: 'boards',
        element: <Boards />,
      },
      {
        path: 'board/:id',
        element: <Board />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
