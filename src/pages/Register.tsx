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
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export function Register() {
	const navigate = useNavigate()
	const { toast } = useToast()

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (name.length < 3) {
			toast({
				title: "Erro no cadastro",
				description: "As nome muito curto"
			})
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast({
				title: "Erro no cadastro",
				description: "Email inválido"
			})
			return;
		}
		if (password.length <= 4) {
			toast({
				title: "Erro no cadastro",
				description: "senha muito curta"
			})
			return;
		}

		if (password !== confirmPassword) {
			toast({
				title: "Erro no cadastro",
				description: "As senhas não coincidem."
			})
			return;
		}

		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
				name,
				email,
				password,
			});

				toast({
					title: "Usuario criado com sucesso",
					description: response.data.name,
				})
				navigate("/login")
				
		} catch (err) {
			toast({
				title: "Erro ao cadastrar usuário.",
				description: `erro: ${err}`
			})
		}
	};
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<form onSubmit={handleSubmit}>
				<Card className="w-[400px]">
					<CardHeader>
						<CardTitle>Registro</CardTitle>
						<CardDescription>
							Crie sua conta para começar a usar nossos serviços.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Nome</Label>
								<Input id="name" onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="password">Senha</Label>
								<Input id="password" onChange={(e) => setPassword(e.target.value)} type="password" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="confirm-password">Confirme a senha</Label>
								<Input id="confirm-password" onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full">Registrar</Button>
						<div className="text-sm text-center">
							Já tem uma conta?{" "}
							<Button variant="link" className="p-0">
								<Link to="/login">Faça login</Link>
							</Button>
						</div>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}
