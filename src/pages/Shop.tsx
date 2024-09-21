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
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react"; // Importando a biblioteca de QR Code
import { LoadingSpinner } from "@/components/loading-spinner";

export default function Shop() {
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
		console.log(product);
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
						{products.map((product: any) => (
							<Card
								className="bg-card text-card-foreground shadow-lg"
								key={product.id}
							>
								<CardHeader>
									<CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
									<div className="text-4xl font-bold">
										R${product.amount}
										<span className="text-lg font-normal">
											/{product.shooting} disparos
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
									<Dialog open={popupIsOpen}>
										<DialogTrigger asChild>
											<Button onClick={() => handleBuy(product)} className="w-full">Comprar</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<DialogTitle>Compra</DialogTitle>
											<div className="flex flex-col items-center justify-center gap-4 py-8">
												{pixResponse ? (
													<div className="mt-4 flex-col flex items-center justify-center gap-4">
														{paymentStatus === 'PAID' ? (
															<div className="text-center">
																<h3 className="text-lg font-bold">Pagamento confirmado!</h3>
																<Button onClick={() => closeShop()}>
																	Fechar
																</Button>
															</div>
														) : (
															<>
																<div className="flex flex-col items-center">
																	<h3 className="text-lg font-bold mt-4">QR Code:</h3>
																	<QRCodeSVG value={pixResponse.pixCopiaECola} size={200} />
																</div>
																<div className="flex flex-col items-center">
																	<h3 className="text-lg font-bold">Pix Copia e Cola:</h3>
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
																	<Button
																		onClick={() => closeShop()}
																	>
																		Fechar
																	</Button>
																</div>
															</>
														)}
													</div>
												) : (
													<LoadingSpinner />
												)}
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
