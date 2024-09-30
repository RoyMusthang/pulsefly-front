import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { CircleUser, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {jwtDecode} from 'jwt-decode';
import { useEffect } from 'react';

const Header: React.FC = () => {
	const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem("user")
    window.location.href = '/login';
  };

  useEffect(() => {
    function validateToken(token: string | undefined) {
  try {
    if (!token) {
      navigate('/login');
      return;
    }
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Get current time in seconds
    if (!decodedToken) {
      navigate('/login');
    }

    // Check if the token has expired
    if (!decodedToken?.exp || decodedToken.exp < currentTime) {

      Cookies.remove('access_token');
      return false; // Token has expired
    }

    return true; // Token is valid
  } catch (error) {
    console.error('Error decoding token:', error);
    return false; // Token is invalid
  }
}
validateToken(Cookies.get('access_token'))
  }, [navigate])

	useEffect(() => {
    const parseJwt = (token: string) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/-/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`;

      }).join(''))
      return jsonPayload
    }

		const validateToken = async () => {
			const token = Cookies.get("access_token");
      // valide se o token e valido com a lib jwt
   //veja se o token e nao está expirado
			if (!token) {
				navigate("/login");
				return;
			}
      localStorage.setItem('user', parseJwt(token))
      
		};

		validateToken();
	}, [navigate]);

  return (
    <header className="sticky top-0 flex h-16 z-10 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="#"
          className="gap-2 text-nowrap text-lg font-semibold md:text-base"
        >
          Espanca Lead 
        </Link>
        <Separator orientation="vertical" />
        <Link
          to="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Separator orientation="vertical" />
        <Link
          to="/credits"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Créditos
        </Link>
        <Separator orientation="vertical" />
        <Link
          to="/shootings"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Disparos
        </Link>
        <Separator orientation="vertical" />
        <Link
          to="/leads"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Leads
        </Link>
        
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              Espanca Lead
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/shop"
              className="text-muted-foreground hover:text-foreground"
            >
              Loja
            </Link>
            <Link
              to="/leads"
              className="text-muted-foreground hover:text-foreground"
            >
              Leads
            </Link>
            <Link to="/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback>US</AvatarFallback>
              <AvatarImage>
                <CircleUser className="h-5 w-5" />

              </AvatarImage>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              Minha Conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/settings">
              Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link  to="https://api.whatsapp.com/send/?phone=%2B557799252615&text&type=phone_number&app_absent=0">
              Suporte
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
