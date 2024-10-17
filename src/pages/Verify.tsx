import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useQuery } from "@/lib/utils"
import axios from "axios"
import { CircleCheckBig } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Verify() {
    const query = useQuery();
    const [isLoading, setIsLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    

    useEffect(() => {
        const token = query.get('token');
        async function verify() {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify?token=${token}`)
                if (data.message === "Email verified successfully") {
                    setIsLoading(false);
                    setIsVerified(true);
                } else {
                    setIsVerified(false);
                    setIsLoading(false);
                }

            } catch (error) {
                setIsLoading(false);
                setIsVerified(false);
            }
        }
        verify();

    }, [query]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            {isLoading ? (
                <p>Carregando...</p>
            ) : isVerified ? (
                <Card className="mx-auto max-w-md space-y-6 rounded-lg p-8 shadow-lg">
                    <CardHeader className="space-y-2 text-center">
                        <CircleCheckBig className="mx-auto h-16 w-16 text-primary" />
                        <h1 className="text-3xl font-bold">Email Verificado</h1>
                    </CardHeader>
                    <CardContent className="text-center space-y-4 gap-3">
                        <p>
                            Seu email foi verificado com sucesso. Agora você pode usar todos os recursos da aplicação.
                        </p>
                        <Button className="w-full">
                            <Link to="/login" replace>
                                Ir para a aplicação
                            </Link>
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-center text-sm">
                            Se tiver dúvidas ou precisar de ajuda, entre em contato com o suporte.
                        </p>
                    </CardFooter>
                </Card>
            ) : (
                <p>Verificação falhou. Por favor, tente novamente.</p>
            )}
        </div>
    )
}