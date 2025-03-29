import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.tsx";

const router = createBrowserRouter([{ path: "/", element: <App /> }], {
  basename: "/",
});

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);
