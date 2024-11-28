import { useState, useMemo, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import Header from "@/components/header"
import Cookies from "js-cookie"
import axios from "axios"
import MultipleSelector, { type Option } from "@/components/ui/multiple-selector"
import { CheckCircleIcon, DownloadIcon, FileIcon, Filter, UploadIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Aside from "@/components/aside"

const CHUNK_SIZE = 1024 * 1024 * 0.001; // 0.5MB chunks
export function Leads() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [tag, setTag] = useState("")
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortColumn, setSortColumn] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [data, setData] = useState<any[]>([])
  const [tags, setTags] = useState<Option[]>([])
  const [tagUsed, setTagUsed] = useState<any[]>([])
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const chunkText = (text: string, chunkSize: number): string[] => {
    const lines = text.split('\n');
    const chunks: string[] = [];
    let currentChunk = '';
    let currentChunkSize = 0;

    for (const line of lines) {
      const lineSize = new Blob([line]).size;
      if (currentChunkSize + lineSize > chunkSize) {
        chunks.push(currentChunk);
        currentChunk = '';
        currentChunkSize = 0;
      }
      currentChunk += `${line}\n`;
      currentChunkSize += lineSize;
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  };

  const uploadChunk = useCallback(async (chunk: string, chunkIndex: number, totalChunks: number) => {
    const formData = new FormData();
    formData.append('file', new Blob([chunk], { type: 'text/csv' }), `chunk-${chunkIndex}`);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/lead/${tag}`, formData, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('access_token')}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  }, [tag]);
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!Cookies.get('access_token') && !user) {
      navigate('/login');
    }
  }, [navigate])

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
    const user = localStorage.getItem("user");
    if (!Cookies.get('access_token') && !user) {
      navigate('/login');
    }
  }, [navigate])


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


  const handleSubmit = useCallback(async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileText = await readFileAsText(file);
      const chunks = chunkText(fileText, CHUNK_SIZE);
      const totalChunks = chunks.length;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        try {
          await uploadChunk(chunks[chunkIndex], chunkIndex, totalChunks);
          setUploadProgress(_prevProgress => ((chunkIndex + 1) / totalChunks) * 100);
        } catch (error) {
          console.error('Error uploading chunk:', error);
          setIsUploading(false);
          return;
        }
      }

      setUploadComplete(true);
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      setIsUploading(false);
    }
  }, [file, uploadChunk]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadComplete(false);
    }
  }, []);
  return (
    <div className="flex h-screen">
      <Aside />
      <div className="flex flex-col bg-background flex-grow">
          <Header />
        <div className="flex m-4 items-center justify-between">
          <div className="flex gap-3">

            <h1 className="text-2xl font-bold">Registros</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  Adicionar novos leads
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-4">
                  <div className="space-x-4">
                    <Label htmlFor="tag" className="text-sm font-medium">
                      TAG<span className="text-red-500">*</span>
                      <Input
                        id="tag"
                        type="text"
                        placeholder="Tag do seus leads"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                      />

                    </Label>
                  </div>
                  <div className="flex flex-col items-center space-x-4">



                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="csv-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="csv-upload"
                      className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                    >
                      {file ? (
                        <div className="flex items-center space-x-2">
                          <FileIcon className="w-6 h-6 text-blue-500" />
                          <span className="font-medium text-gray-600">{file.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <UploadIcon className="w-8 h-8 text-gray-400" />
                          <span className="font-medium text-gray-600">Click to select CSV file</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-col items-center space-x-4">

                    <Button className="items-center justify-center flex">
                      <a
                        href="/example.csv"
                        download="example.csv"
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium  rounded-md shadow-sm  focus:outline-none"
                      >
                        <DownloadIcon className="w-5 h-5" />
                        <span>Download example CSV</span>
                      </a>
                    </Button>


                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!file || isUploading || !tag}
                    className="w-full"
                  >
                    {tag === ""}
                    {isUploading ? 'Uploading...' : 'Submit'}
                  </Button>

                  {isUploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-gray-500">Uploading: {uploadProgress.toFixed(2)}%</p>
                    </div>
                  )}

                  {uploadComplete && (
                    <Alert>
                      <CheckCircleIcon className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>Your CSV file has been successfully uploaded.</AlertDescription>
                    </Alert>
                  )}
                </div>
              </DialogContent>
            </Dialog>

          </div>
          <div className="flex items-center gap-2">
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
                sortedData === undefined || sortedData === null ?
                  (Array.from({ length: 6 }).map((_, index) => (
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
                  )))

                  : tags.length > 0 ? (

                    sortedData.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.key}</TableCell>
                        <TableCell>{item.tag}</TableCell>
                        <TableCell>{item.created_at}</TableCell>
                      </TableRow>
                    )))
                    : (

                      <TableRow key="1">
                        <TableCell>Sem leads</TableCell>
                        <TableCell>Sem leads</TableCell>
                        <TableCell>Sem leads</TableCell>
                        <TableCell>Sem leads</TableCell>
                        <TableCell>Sem leads</TableCell>
                      </TableRow>
                    )
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
                  key={"ads"}
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
      </div>
    </div>
  )
}
