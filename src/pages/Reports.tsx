
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import Aside from "@/components/aside"
import { useEffect, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function TooltipDemo(props: string) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TableCell className="border-b border-slate-200 px-6 py-3 text-sm group" title={props}>
                        {props.slice(0, 6)}{props.length > 6 && '...'}
                    </TableCell>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{props}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export function Reports() {
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!Cookies.get('access_token') && !user) {
            navigate('/login');
        }
    }, [navigate])

    const [data, setData] = useState<any[] | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            axios.get(`${import.meta.env.VITE_BASE_URL}/transaction/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            }).then(response => {
                setData(response.data);
            }).catch(error => {
                console.error("Erro ao carregar transações:", error);
            })
        }
    }, [])


    return (
        <div className="flex h-screen">
            <Aside />
            <div className="flex flex-col bg-background flex-grow">
                <Header />
                <div>
                    <div className="rounded-lg shadow overflow-hidden">
                        <h2 className="text-lg font-semibold p-4 border-b">Transações Recentes</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">ID</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Usuário</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Valor</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Data</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                {data?.length > 0 ? (
                                    data?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="px-6 py-4 whitespace-nowrap" title={item.transaction.transaction_id}>
                                                {item.transaction.transaction_id.slice(0, 6)}{item.transaction.transaction_id.length > 6}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Avatar>
                                                        <AvatarImage src={item.user.image} alt={item.user.name} />
                                                        <AvatarFallback>US</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="text-sm font-medium ">{item.user.name}</div>
                                                        <div className="text-sm ">{item.user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.transaction.amount)}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                   variant={item.transaction.status === 'PAID' ? 'success' : 'secondary'}
                                                >
                                                    {item.transaction.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap" title={new Date(item.transaction.created_at).toLocaleString('pt-BR')}>
                                                {new Date(item.transaction.created_at).toLocaleDateString('pt-BR')}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell className="border-b border-slate-200 px-6 py-3 text-sm">Nenhuma transacao encontrada</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>


            </div>
        </div>
    )
}
