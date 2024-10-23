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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useUserSession } from "@/components/state/tags/asfd";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const form = useForm();
  const { toast } = useToast()
  const { user } = useUserSession();

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

  const handleChangePassword = async (data: any) => {
    try {
      if (data.password !== data.passwordConfirmation) {
        toast({
          title: "Erro no cadastro",
          description: "As senhas não coincidem."
        })
        return;
      }
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/${user.id}`, {
        password: data.password
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.status === 200) {
        console.log(response.data)
        Cookies.set('access_token', response.data.token); // Expires in 7 days
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/${user.id}`, {
        name: data.name,
        image: data.image
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.status === 200) {
        console.log(response.data)
        Cookies.set('access_token', response.data.token); // Expires in 7 days
        toast({
          title: "Sucesso no cadastro",
          description: "Informações atualizadas com sucesso."
        })
        window.location.reload();
        
      }
    } catch (error) {
      toast({
      title: "Erro no cadastro",
        description: "Ocorreu um erro ao atualizar as informações."
      })
      console.error("Failed to update user data:", error);
    }
  }
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <CardContent className="space-y-4">

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder={user?.name} {...field} />
                            </FormControl>
                            <FormDescription>Seu nome completo.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Input placeholder={user?.email} disabled />
                          
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Imagem</FormLabel>
                            <FormControl>
                              <Input placeholder={user?.image ? user?.image : ""} {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Salvar Alterações</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            <TabsContent value="seguranca">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Em construção...</CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleChangePassword)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="passwordAcc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl>
                              <Input placeholder="********" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input placeholder="********" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="passwordConfirmation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <Input placeholder="********" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button disabled>Atualizar Senha</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>Em construção...</CardDescription>
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
                  <Button disabled>Salvar Preferências</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div >
  );
}
