import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Input } from './ui/input';
import { CircleUser, Menu, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useEffect } from 'react';

const Header: React.FC = () => {
	const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

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
			if (!token) {
				navigate("/login");
				return;
			}
      localStorage.setItem('user', parseJwt(token))
      
		};

		validateToken();
	}, [navigate]);

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
          to="/shop"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Loja
        </Link>
        <Separator orientation="vertical" />
        <Link
          to="/leads"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Leads
        </Link>
        <Separator orientation="vertical" />
        <Link
          to="/settings"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Settings
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
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
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
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
