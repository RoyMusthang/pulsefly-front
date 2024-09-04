
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "./components/header";
import { toast } from "./components/ui/use-toast";
import { Input } from "./components/ui/input";
import axios from "axios";

export default function Page() {
  const navigate = useNavigate();
  const [pixMessage, setPixMessage] = useState("")
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
      // Simulação de envio do PIX
    try {
      
      const response = await axios.post('http://localhost:8080/pix/', {
        message: pixMessage,
      },
      {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`,
        },
      })
  
      toast({
        title: "PIX Enviado",
        description: "Valor de R$ 00.1 enviado com sucesso!",
      })
      console.log(response.data)
    } catch (error) {
      toast({
        title: "PIX erro",
        description: "falhou!",
      })
      console.log(error)
    }

    // Limpar o input após o envio
    setPixMessage("")
  }

 

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-sm">
      <Input
        type="text"
        placeholder="Mensagem do PIX"
        value={pixMessage}
        onChange={(e) => setPixMessage(e.target.value)}
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