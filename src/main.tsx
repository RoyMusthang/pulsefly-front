import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Toaster } from "@/components/ui/toaster"
import { Leads } from "./pages/Leads.tsx";
import Settings from "./pages/Setting.tsx";
import Credits from "./pages/Credits.tsx";
import { Shootings } from "./pages/Shootings.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Reports } from "./pages/Reports.tsx";

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
		path: "/credits",
		element: <Credits />,
	},
	{
		path: "/dispatch",
		element: <Shootings />,
	},
	{
		path: "/settings",
		element: <Settings />,
	},
	{
		path: "/reports",
		element: <Reports />,
	}
]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">

		<RouterProvider router={route} />
		<Toaster />
		</ThemeProvider>
	</StrictMode>,
);
