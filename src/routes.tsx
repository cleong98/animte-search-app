import type { LoaderFunctionArgs } from "react-router";
import SearchPage from "./pages/SearchPage";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

export const paths = {
  home: "/",
  animeDetails: (id: string | number) => `/${id}`,
} as const;

export const routes = [
  {
    path: "/",
    element: <SearchPage />,
  },
  {
    path: "/:id",
    element: <AnimeDetailsPage />,
    errorElement: <NotFoundPage />,
    loader: ({ params }: LoaderFunctionArgs) => {
      const id = params.id;
      if (!id || !/^\d+$/.test(id)) {
        throw new Response("Not Found", { status: 404 });
      }
      return { id: Number(id) };
    },
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
