import { Button } from "./components/ui/button";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "./components/header";
import { toast } from "./components/ui/use-toast";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart as BarChartIcon, CreditCard, Send } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import axios, { AxiosError } from "axios";
import { ChartContainer, type ChartConfig } from "./components/ui/chart";
import MultipleSelector, { Option } from "./components/ui/multiple-selector";
import { Skeleton } from "./components/ui/skeleton";

const chartData = [
	{ name: "Mon", emails: 120, fill: "var(--color-desktop)" },
	{ name: "Tue", emails: 200, fill: "var(--color-desktop)" },
	{ name: "Wed", emails: 150, fill: "var(--color-desktop)" },
	{ name: "Thu", emails: 80, fill: "var(--color-desktop)" },
	{ name: "Fri", emails: 170, fill: "var(--color-desktop)" },
	{ name: "Sat", emails: 50, fill: "var(--color-desktop)" },
	{ name: "Sun", emails: 30, fill: "var(--color-desktop)" },
];

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
  const userData = JSON.parse(localStorage.getItem("user") || "");

	const emailsSent = Math.floor(Math.random() * (50000 - 123 + 1) + 123);
	const totalEmailCredits = 50000;
  const [tags, setTags] = useState<Option[]>([])
  const [tagUsed, setTagUsed] = useState<any[]>([])
	const [user, setUser] = useState<User|null>(null);
	const [pixMessage, setPixMessage] = useState("");
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Simulação de envio do PIX
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/pix/`,
				{
					message: pixMessage,
					tags: tagUsed

				},
				{
					headers: {
						Authorization: `Bearer ${Cookies.get("access_token")}`,
					},
				},
			);

			toast({
				title: "PIX Enviado",
				description: "Valor de R$ 00.1 enviado com sucesso!",
			});
			console.log(response.data);
		} catch (error) {
    console.log("Error received:", error);

    let errorMessage = "Erro desconhecido";

    // Verifique se é um erro do Axios e se a resposta contém uma mensagem de erro
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
            // Supondo que o backend envia a mensagem de erro em error.response.data.Mensagem
            errorMessage = error.response.data.error || "Erro na requisição";
        } else {
            errorMessage = error.message; // Exibe a mensagem padrão do Axios
        }
    } else {
        errorMessage = error.message; // Caso não seja um erro do Axios
    }

    toast({
        title: "PIX erro",
        description: errorMessage,
        duration: 5000,
    });

    console.log(error);
}

		// Limpar o input após o envio
		setPixMessage("");
	};
useEffect(() => {
    const getTags = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/lead/tags/${userData.id}`,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
          }
        );
        setTags(response.data);  // Certifique-se que o endpoint retorna um objeto com uma chave 'leads'
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
      }
    }
    getTags()
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
				console.log(response.data.user)
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
		<>
			<Header />
			<div className="w-full max-w-4xl mx-auto p-4 space-y-4">
				<h1 className="text-2xl font-bold text-center mb-6">Pix Dashboard</h1>
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Pix Enviados
							</CardTitle>
							<Send className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{emailsSent}</div>
							<Progress
								value={(emailsSent / totalEmailCredits) * 100}
								className="mt-2"
							/>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Disparos Disponivéis
							</CardTitle>
							<CreditCard className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{user ? user?.credit : 0}</div>
							<p className="text-xs text-muted-foreground">
								Você pode adquirir mais a qualquer momento
							</p>
						</CardContent>
					</Card>
				</div>
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
									<BarChart data={chartData}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Bar
											dataKey="emails"
											fill="var(--color-desktop)"
											radius={4}
										/>
									</BarChart>
								</ChartContainer>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Pix Rápido</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="flex space-x-2" onSubmit={handleSubmit}>
							<Input
								type="text"
								placeholder="Mensagem do PIX"
								value={pixMessage}
								onChange={(e) => setPixMessage(e.target.value)}
								required
								className="text-lg"
							/>
 {
            tags?.length > 0 ? (

              <MultipleSelector
                defaultOptions={tags}
                options={tags}
                value={tags}
                onChange={(selectedOptions) => setTagUsed(selectedOptions.map(option => option.value))}
                placeholder="Selecione suas tags"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    Sem tags encontradas
                  </p>
                }
              />
			 ) : (
              <div className="gap-4">
                <Skeleton className="h-8 w-[180px]" />
              </div>
			 )
          }
							<Button type="submit" disabled={!pixMessage.trim()}>
								<Send className="h-4 w-4 mr-2" />
								Enviar Pix
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
