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
import { CheckCircle2, Copy, X } from "lucide-react";
import axios from "axios";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react"; // Importando a biblioteca de QR Code
import { LoadingSpinner } from "@/components/loading-spinner";
import Aside from "@/components/aside";
import { Textarea } from "@/components/ui/textarea";

export default function Credits() {
	const navigate = useNavigate();


	useEffect(() => {
		const user = localStorage.getItem("user");
		if (!Cookies.get('access_token') && !user) {
			navigate('/login');
		}
	}, [navigate])
	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const [pixResponse, setPixResponse] = useState<any>(null); // Estado para armazenar a resposta do PIX
	const [products, setProducts] = useState([]);
	const [paymentStatus, setPaymentStatus] = useState(null);
	const [popupIsOpen, setPopupIsOpen] = useState(false);

	useEffect(() => {
		// Função para verificar o status do pagamento
		const checkPaymentStatus = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/pix/${pixResponse.transaction_id}`, {
					headers: {
						'Authorization': `Bearer ${Cookies.get('access_token')}`,
					},
				});
				setPaymentStatus(response.data.status); // Supondo que a API retorne o status
			} catch (error) {
				console.error("Erro ao verificar status de pagamento:", error);
			}
		};

		// Verifica o status do pagamento a cada 5 segundos
		const intervalId = setInterval(() => {
			if (pixResponse) {
				checkPaymentStatus();
			}
		}, 5000); // Checa a cada 5 segundos

		// Limpa o intervalo quando o componente for desmontado
		return () => clearInterval(intervalId);
	}, [pixResponse]);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/product/`,
					{
						headers: {
							'Authorization': `Bearer ${Cookies.get('access_token')}`,
						},
					}
				);
				setProducts(response.data);
			} catch (error) {
				console.error("Erro ao carregar produtos:", error);
			}
		};

		getProducts();
	}, []);

	const handleBuy = async (product: any) => {
		setPopupIsOpen(true);
		setPixResponse(null);
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/pix/cob`,
				{
					product_id: product.id,
					user_id: user.id,
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

	const closeShop = () => {
		setPaymentStatus(null);
		setPixResponse(null);
		setPopupIsOpen(false);
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
		<div className="flex h-screen">
			<Aside />
			<div className="flex flex-col bg-background flex-grow">
				<Header />
				<main className="flex-1 max-w-4xl mx-auto p-4 ">
					<div className="w-full max-w-6xl mx-auto">
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
							{products.map((product: any) => (
								<Card
									className="bg-card text-card-foreground shadow-lg"
									key={product.id}
								>
									<CardHeader>
										<CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
										<div className="text-4xl font-bold">
											{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.amount)}
										
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<ul className="space-y-2 text-muted-foreground">
											<li className="flex items-center gap-2">
											  {product.shooting} disparos
											</li>
											
										</ul>
									</CardContent>
									<CardFooter>
										<Dialog open={popupIsOpen} onOpenChange={setPopupIsOpen}>
											<DialogTrigger asChild>
												<Button onClick={() => handleBuy(product)} className="w-full">Comprar</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>Comprar via pix</DialogTitle>
												</DialogHeader>
												{
													pixResponse ? (
														<div className="grid gap-4 py-4">
															{paymentStatus === 'PAID' ? (
																<div className="text-center">
																	<div className="flex flex-col items-center justify-center gap-4 py-8">
																		<CheckCircle2 className="h-16 w-16 text-green-500" />
																		<p className="text-lg font-medium text-center">
																			Disparos adicionados com sucesso!
																		</p>
																	</div>
																	<Button onClick={() => closeShop()}>
																		Fechar
																	</Button>
																</div>
															) : (
																<>
																	<div className="flex justify-center">
																		<QRCodeSVG value={pixResponse.pixCopiaECola} size={200} />
																	</div>
																	<Textarea className="resize-none h-20"
																		value={pixResponse.pixCopiaECola}
																		readOnly
																	/>

																	<div className="flex align-baseline gap-6 justify-between">

																		<Button
																			className="mt-2 p-2"
																			onClick={() =>
																				navigator.clipboard.writeText(
																					pixResponse.pixCopiaECola,
																				)
																			}
																		>
																			<Copy className="mr-2 h-4 w-4" />
																			Copiar
																		</Button>
																		<Button
																			className="mt-2 p-2"
																			onClick={() => closeShop()}
																		>
																			<X className="mr-2 h-4 w-4" />
																			Fechar
																		</Button>
																	</div>
																</>
															)}
														</div>
													) : (
														<LoadingSpinner />
													)}
											</DialogContent>
										</Dialog>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</main>
			</div >
		</div >
	);
}
