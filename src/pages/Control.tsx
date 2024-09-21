import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import Header from "@/components/header"
import Cookies from "js-cookie"
import axios from "axios"
import MultipleSelector, { type Option } from "@/components/ui/multiple-selector"
import { Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function Control() {
  const user = JSON.parse(localStorage.getItem("user") || "");
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortColumn, setSortColumn] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [data, setData] = useState<any[]>([])
  const [tags, setTags] = useState<Option[]>([])
  const [tagUsed, setTagUsed] = useState<any[]>([])

  useEffect(() => {
    const getData = async () => {
      const tagsQueryParam = tagUsed.length > 0 ? tagUsed.join(',') : ""; // Safeguard if tags are empty

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/lead/${user.id}?page=${page}&pageSize=${pageSize}&tag=${tagsQueryParam}`,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
          }
        );
        setData(response.data);  // Certifique-se que o endpoint retorna um objeto com uma chave 'leads'
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
      }
    };

    getData();
  }, [page, pageSize, tagUsed, user.id]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/lead/tags/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
          }
        );
        setTags(response.data);  // Certifique-se que o endpoint retorna um objeto com uma chave 'leads'
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
      }
    }
    getTags()
  }, [user.id])

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item: any) => item.tag.toLowerCase())
  }, [data]);

  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.ceil(15000 / pageSize);

  const getPageRange = () => {
    const range = 5; // Número de páginas a serem exibidas ao redor da página atual
    const start = Math.max(1, page - Math.floor(range / 2));
    const end = Math.min(totalPages, start + range - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    setPage(1);  // Reinicie a página ao alterar o tamanho ou filtros
  }, []);


  return (
    <>
      <Header />
      <div className="flex m-4 items-center justify-between">
        <h1 className="text-2xl font-bold">Registros</h1>
        <div className="flex items-center gap-2">
          {
            !tags ?

              <div className="gap-4">
                <Skeleton className="h-8 w-[200px]" />
              </div>
              :
              tags.length > 0 ?

                <MultipleSelector
                  defaultOptions={tags}
                  options={tags}
                  value={tags}
                  onChange={(selectedOptions) => setTagUsed(selectedOptions.map(option => option.value))}
                  placeholder="Selecione suas tags"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      Nenhuma tag encontrada
                    </p>
                  }
                />
                :
               <div className="gap-4">
                <Skeleton className="h-8 w-[200px]" />
              </div>
          }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortColumn} onValueChange={setSortColumn}>
                <DropdownMenuRadioItem value="id">ID</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Nome</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="key">Chave</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tag">Tag</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="userId">ID do Usuário</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="createdAt">Data de Criação</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="updatedAt">Data de Atualização</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Ordem</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortDirection} onValueChange={setSortDirection}>
                <DropdownMenuRadioItem value="asc">Crescente</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">Decrescente</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-auto p-1 m-3 border rounded-lg">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Chave</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Data de Criação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              sortedData.length > 0 ?
                sortedData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.key}</TableCell>
                    <TableCell>{item.tag}</TableCell>
                    <TableCell>{item.created_at}</TableCell>
                  </TableRow>
                ))
                :
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))

            }
          </TableBody>
        </Table>
      </div>
      <div className="flex m-4 items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Exibindo {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredData.length)} de{" "}
          {filteredData.length} registros
          <Input value={pageSize} type="number" onChange={(e) => setPageSize(parseInt(e.target.value))} />
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                isActive={page <= pageSize}
                onClick={() => page > 1 && setPage(page - 1)}

              />
            </PaginationItem>
            {getPageRange().map((p) => (
              <PaginationItem key={p}>
                <PaginationLink href="#" onClick={() => setPage(p)} isActive={p === page}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
                isActive={page < totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
