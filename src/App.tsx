import { Button } from "./components/ui/button";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "./components/header";
import { toast } from "./components/ui/use-toast";
import { Input } from "./components/ui/input";
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
import MultipleSelector, { type Option } from "./components/ui/multiple-selector";
import { Skeleton } from "./components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";



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


  const [tags, setTags] = useState<Option[]>([])
  const [tagUsed, setTagUsed] = useState<any[]>([])
	const [user, setUser] = useState<User|null>(null);
	const [pixMessage, setPixMessage] = useState("");
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
				description: "Enviado com sucesso!",
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
		const storedUser = localStorage.getItem("user");
			if (storedUser) {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/lead/tags/${userData.id}`,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
          }
        );
        setTags(response.data);  // Certifique-se que o endpoint retorna um objeto com uma chave 'leads'
	}
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
      }
			
    }
    getTags()
  }, [userData.id])

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
				acc[day] = {name: day, shooting: 0, fill: "var(--color-desktop)"};
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
		<>
			<Header />
			<div className="w-full max-w-4xl mx-auto p-4 space-y-4">
				{/* quero no css o h1 no meio e o botão no final */}

				<div className="flex justify-between">
					<div className="w-20"/>
					<h1 className="text-3xl font-bold">Painel</h1>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">Novo Pix</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>

							<DialogTitle>Novo Pix</DialogTitle>
							<DialogDescription>
								Coloque a mensagem para seus contatos e escolha as suas tags
							</DialogDescription>
							</DialogHeader>
						<form className="space-y-4 w-full max-w-md mx-auto p-4" onSubmit={handleSubmit}>
							<Input
								type="text"
								placeholder="Mensagem do PIX"
								value={pixMessage}
								onChange={(e) => setPixMessage(e.target.value)}
								required
								className="text-lg"
							/>
							{
            tags === undefined || tags === null ? ( // Verifica se `tags` está indefinido ou nulo
              <div className="gap-4">
                <Skeleton className="h-8 w-[200px]" />
              </div>
            ) : tags.length > 0 ? ( // Se `tags` estiver carregado e contiver itens
              <MultipleSelector
                defaultOptions={tags}
                options={tags}
                value={tags}
                className="w-80"
                onChange={(selectedOptions) => setTagUsed(selectedOptions.map(option => option.value))}
                placeholder="Selecione suas tags"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    Nenhuma tag encontrada
                  </p>
                }
              />
            ) : ( // Se `tags` estiver carregado, mas estiver vazio
              <div className="gap-4 w-60 border border-solid border-gray-300 rounded">
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  Nenhuma tag disponível
                </p>
              </div>
            )
          }
							<Button type="submit" disabled={!pixMessage.trim()}>
								<Send className="h-4 w-4 mr-2" />
								Enviar Pix
							</Button>
						</form>
						</DialogContent>
					</Dialog>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Pix Enviados
							</CardTitle>
							<Send className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{!shootings ? 0 : shootings.reduce((total, shooting) => total + shooting.shooting, 0)}</div>
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
									<BarChart data={shootings}>
										<XAxis dataKey="name" />
										<YAxis />
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
		</>
	);
}
