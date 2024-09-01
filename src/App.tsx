
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "./components/header";
import { toast } from "./components/ui/use-toast";
import { Input } from "./components/ui/input";

export default function Page() {
  const navigate = useNavigate();
  const [pixValue, setPixValue] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    const value = parseFloat(pixValue)
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido para o PIX.",
        variant: "destructive",
      })
      return
    }

    // Simulação de envio do PIX
    toast({
      title: "PIX Enviado",
      description: `Valor de R$ ${value.toFixed(2)} enviado com sucesso!`,
    })

    // Limpar o input após o envio
    setPixValue("")
  }

  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        navigate("/login")
        return;
      }
    };
    validateToken();
  }, []);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-sm">
      <Input
        type="number"
        placeholder="Valor do PIX"
        value={pixValue}
        onChange={(e) => setPixValue(e.target.value)}
        step="0.01"
        min="0"
        required
        className="text-lg"
      />
      <Button type="submit" className="w-full">
        Enviar PIX
      </Button>
    </form>
      </div>
    </>
  );
}