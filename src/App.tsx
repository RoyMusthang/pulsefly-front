import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "./components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, CreditCard, Send } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { ChartContainer, type ChartConfig } from "./components/ui/chart";
import Aside from "./components/aside";


type User = {
	id: string
	name: string
	email: string
	password: string
	created_at: string
	updated_at: string
	credit: number
}

export default function Page() {
	const userData = JSON.parse(localStorage.getItem("user") || "{}");
	const [user, setUser] = useState<User | null>(null);
	const [shootings, setShootings] = useState<any[]>([]);


	const chartConfig = {
		desktop: {
			label: "Desktop",
			color: "hsl(var(--chart-3))",
		},
		mobile: {
			label: "Mobile",
			color: "hsl(var(--chart-2))",
		},
	} satisfies ChartConfig;


	useEffect(() => {
		const getShootings = async () => {
			try {
				const storedUser = localStorage.getItem("user");
				if (storedUser) {
					const response = await axios.get(
						`${import.meta.env.VITE_BASE_URL}/user/shootings/${userData.id}`,
						{
							headers: {
								'Authorization': `Bearer ${Cookies.get('access_token')}`,
							},
						}
					);
					const aggregatedShootings = response.data.reduce((acc: any, shooting: any) => {
						const day = shooting.week.substring(0, 3);
						if (!acc[day]) {
							acc[day] = { name: day, shooting: 0, fill: "var(--color-desktop)" };
						}
						acc[day].shooting += shooting.quantity;
						return acc;
					}, {})
					const transformedShootings = Object.values(aggregatedShootings);
					setShootings(transformedShootings);
				}
			} catch (error) {
				console.error("Erro ao carregar shootings:", error);
			}
		}
		getShootings()
	}, [userData.id])

	const getCreditsByUser = async () => {
		try {
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				const user = JSON.parse(storedUser);
				const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/user/${user.id}`,
					{

						headers: {
							'Authorization': `Bearer ${Cookies.get('access_token')}`,
						},
					}
				);
				setUser(response.data.user);
			}
		} catch (error) {
			console.error("Failed to fetch user data", error);
		}
	};

	// Effect to fetch user data on component mount
	useEffect(() => {
		getCreditsByUser();
	}, []);
	return (
		<div className="flex h-screen">
			<Aside />
			<div className="flex flex-col bg-background flex-grow">
				<Header />
				<main className="flex-1 max-w-4xl mx-auto p-4 space-y-4">
					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm text-foreground font-medium">
									Pix Enviados
								</CardTitle>
								<Send className="h-4 w-4 text-primary" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-primary">{!shootings ? 0 : shootings.reduce((total, shooting) => total + shooting.shooting, 0)}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Pix Enviados
								</CardTitle>
								<Send className="h-4 w-4 text-primary" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-primary">{!shootings ? 0 : shootings.reduce((total, shooting) => total + shooting.shooting, 0)}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Disparos Disponivéis
								</CardTitle>
								<CreditCard className="h-4 w-4 text-primary" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{user ? user?.credit : 0}</div>
								<p className="text-xs text-muted-foreground">
									Você pode adquirir mais a qualquer momento
								</p>
							</CardContent>
						</Card>
					</div>
					<div>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Tendência de envio de Pix
								</CardTitle>
								<BarChartIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="h-[300px] w-full">
									<ResponsiveContainer width="100%" height="100%">
										<ChartContainer config={chartConfig}>
											<BarChart data={shootings}>
												<XAxis dataKey="name" />
												<YAxis tick={{ fontSize: 12 }} />
												<Tooltip />
												<Bar
													dataKey="shooting"
													fill="var(--color-desktop)"
													radius={4}
												/>
											</BarChart>
										</ChartContainer>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</div>
					</main>
			</div >
		</div >
	);
}
