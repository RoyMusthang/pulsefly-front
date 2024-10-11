
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import Aside from "@/components/aside"
import { useEffect } from "react"
import { CircleUser, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Reports() {
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!Cookies.get('access_token') && !user) {
            navigate('/login');
        }
    }, [navigate])


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
                                {[...Array(5)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">#{1000 + index}</TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Avatar>
                                                    <AvatarFallback>US</AvatarFallback>
                                                    <AvatarImage>
                                                        <CircleUser />

                                                    </AvatarImage>
                                                </Avatar><Avatar>

                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium ">Usuário {index + 1}</div>
                                                    <div className="text-sm ">usuario{index + 1}@example.com</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">R$ {(Math.random() * 1000).toFixed(2)}</TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Completo
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">
                                            {new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>


            </div>
        </div>
    )
}
