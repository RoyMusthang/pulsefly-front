import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Cookies from 'js-cookie';


export function Login() {
	const navigate = useNavigate()
	const { toast } = useToast()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
				email,
				password,
			});
			if (response.status === 200) {
				console.log(response.data.access_token)
        Cookies.set('access_token', response.data.access_token, { expires: 7 }); // Expires in 7 days

				toast({
					title: "Usuario logado com sucesso",
					description: response.data.name,
				})
				navigate("/")
			}
		} catch (err) {
			toast({
				title: "Erro ao Logar",
				description: "Por favor, tente novamente."
			})
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen ">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Entre com seu email e senha para acessar sua conta.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="seu@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="password">Senha</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<CardFooter className="flex flex-col space-y-4 px-0 py-4">
							<Button type="submit" className="w-full">
								Entrar
							</Button>
							<div className="text-sm text-center">
								Não tem uma conta?{" "}
								<Button variant="link" className="p-0">
									<Link to="/register">Registre-se</Link>
								</Button>
							</div>
						</CardFooter>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
