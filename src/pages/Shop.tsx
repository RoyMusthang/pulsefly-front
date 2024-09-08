import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import axios from "axios";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react"; // Importando a biblioteca de QR Code
import { LoadingSpinner } from "@/components/loading-spinner";

export default function Shop() {
	const navigate = useNavigate();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [pixResponse, setPixResponse] = useState<any>(null); // Estado para armazenar a resposta do PIX

	const planos = [
		{ id: 1, name: "Basic", value: 30, quantity: 1000 },
		{ id: 2, name: "Hobby", value: 50, quantity: 2000 },
		{ id: 3, name: "Pro", value: 100, quantity: 5000 },
		{ id: 4, name: "Enterprise", value: 180, quantity: 10000 },
		{ id: 5, name: "Business", value: 320, quantity: 20000 },
	];

	const handleBuy = async (e: number) => {
		setPixResponse(null)
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/pix/cob`,
				{
					value: e.toFixed(2),
				},
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${Cookies.get("access_token")}`,
					},
				},
			);
			setPixResponse(response.data);
 		} catch (error) {
			console.error("Erro ao efetuar compra:", error);
		}
	};

	useEffect(() => {
		const validateToken = async () => {
			const token = Cookies.get("access_token");
			if (!token) {
				navigate("/login");
				return;
			}
		};
		validateToken();
	}, []);

	return (
		<>
			<Header />
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="w-full max-w-6xl mx-auto py-12 md:py-20">
					<div className="text-center space-y-4 mb-12">
						<h1 className="text-4xl md:text-5xl font-bold">
							Planos para seus pagamentos por PIX
						</h1>
						<p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
							Encontre o plano ideal para enviar seus pagamentos por PIX de
							forma rápida e segura. Comece agora mesmo!
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{planos.map((e) => (
							<Card
								className="bg-card text-card-foreground shadow-lg"
								key={e.id}
							>
								<CardHeader>
									<CardTitle className="text-2xl font-bold">{e.name}</CardTitle>
									<div className="text-4xl font-bold">
										R${e.value}
										<span className="text-lg font-normal">
											/{e.quantity} disparos
										</span>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<ul className="space-y-2 text-muted-foreground">
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5 text-primary" />
											capacidade de envio
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5 text-primary" />
											velociadade de envio
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5 text-primary" />1 usuário
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon className="w-5 h-5 text-primary" />
											Suporte básico
										</li>
									</ul>
								</CardContent>
								<CardFooter>
									<Dialog>
										<DialogTrigger asChild>
											<Button onClick={() => handleBuy(e.value)} className="w-full">Comprar</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<div className="flex flex-col items-center justify-center gap-4 py-8">
												{pixResponse ? (
													<div className="mt-4 flex-col flex items-center justify-center gap-4">
														<div className="flex flex-col items-center">
															<h3 className="text-lg font-bold mt-4">
																QR Code:
															</h3>
															<QRCodeSVG
																value={pixResponse.pixCopiaECola}
																size={200}
															/>
														</div>
														<div className="flex flex-col items-center">
															<h3 className="text-lg font-bold">
																Pix Copia e Cola:
															</h3>
															<div className="w-96 bg-gray-100 p-2 rounded">
																<p className="overflow-auto break-word">
																	{pixResponse.pixCopiaECola}
																</p>
															</div>
															<Button
																className="mt-2 p-2"
																onClick={() =>
																	navigator.clipboard.writeText(
																		pixResponse.pixCopiaECola,
																	)
																}
															>
																Copiar
															</Button>
														</div>
													</div>
												): <LoadingSpinner />}
											</div>
										</DialogContent>
									</Dialog>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
