import Aside from "@/components/aside";
import Header from "@/components/header"
import { useTagsStore } from "@/components/state/tags/asfd";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
export function Shootings() {
  const [data, setData] = useState<any[]>([]);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const { tags, setTags } = useTagsStore();
  const [tagUsed, setTagUsed] = useState<any[]>([])
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
  }, [userData.id, setTags])
  useEffect(() => {
    const getData = async () => {

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/shootings/${userData.id}`,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
          }
        );
        console.log(response.data)
        setData(response.data);  // Certifique-se que o endpoint retorna um objeto com uma chave 'leads'
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
      }
    };

    getData();
  }, [userData.id]);
  return (
    <div className="flex h-screen">
      <Aside />
      <div className="flex flex-col bg-background flex-grow">
        <Header />
        <main className="p-4 space-y-4">
            <div className="">
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button >Novo Disparo</Button>
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
              <Table>
                <TableCaption>lista seus disparos</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Quantidade de leads</TableHead>
                    <TableHead>Disparos com sucesso</TableHead>
                    <TableHead>Disparos com falha</TableHead>
                    <TableHead>Disparado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>                      
                      <TableCell>{invoice.quantity}</TableCell>
                      <TableCell>{invoice.sucess_shooting || '0'}</TableCell>
                      <TableCell>{invoice.fail_shooting || '0'}</TableCell>
                      <TableCell>{invoice.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <Pagination
                      />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

        </main>
      </div>
    </div>
  )
}