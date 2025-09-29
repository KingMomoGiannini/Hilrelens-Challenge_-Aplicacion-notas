import { createBrowserRouter } from "react-router-dom";
import ActiveNotes from "./pages/ActiveNotes";
import ArchivedNotes from "./pages/ArchivedNotes";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ActiveNotes /> },
      { path: "archived", element: <ArchivedNotes /> },
    ],
  },
]);
