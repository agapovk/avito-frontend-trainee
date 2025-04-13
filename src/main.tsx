import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import NotFound from './components/NotFound.tsx';
import Boards from './components/Boards.tsx';
import Board from './components/BoardPage.tsx';
import Issues from './components/Issues.tsx';
import './index.css';
import App from './App.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
