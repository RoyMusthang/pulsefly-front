import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Header from "@/components/header";
import Aside from "@/components/aside";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Settings() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!Cookies.get('access_token') && !user) {
      navigate('/login');
    }
  }, [navigate])
  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        navigate("/login")
        return;
      }
    };
    validateToken();
  }, [navigate]);

  return (

    <div className="flex h-screen">
      <Aside />
      <div className="flex flex-col bg-background flex-grow">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto p-4 space-y-4">
          <h1 className="text-3xl font-bold mb-6">Configurações do Usuário</h1>
          <Tabs defaultValue="pessoal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pessoal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            </TabsList>
            <TabsContent value="pessoal">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações pessoais aqui.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imagem">Imagem de perfil</Label>
                    <Input id="iamgem" placeholder="https://i.imgur.com/5eMAuXg.jpeg" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Salvar Alterações</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="seguranca">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Gerencie sua senha e configurações de segurança.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha-atual">Senha Atual</Label>
                    <Input id="senha-atual" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nova-senha">Nova Senha</Label>
                    <Input id="nova-senha" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                    <Input id="confirmar-senha" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Atualizar Senha</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>Escolha como deseja receber notificações.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notif">Notificações por E-mail</Label>
                    <Switch id="email-notif" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notif">Notificações Push</Label>
                    <Switch id="push-notif" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notif">Notificações por SMS</Label>
                    <Switch id="sms-notif" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Salvar Preferências</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          </main>
      </div>
    </div>
  );
}