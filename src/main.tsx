import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Toaster } from "@/components/ui/toaster"
import Leads from "./pages/Leads.tsx";
import Shop from "./pages/Shop.tsx";
import Settings from "./pages/Setting.tsx";

const route = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
  {
		path: "/login",
		element: <Login />,
	},
  {
		path: "/register",
		element: <Register />,
	},
	{
		path: "/leads",
		element: <Leads />,
	},
	{
		path: "/shop",
		element: <Shop />,
	},
	{
		path: "/settings",
		element: <Settings />,
	},

]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={route} />
		<Toaster />
	</StrictMode>,
);
