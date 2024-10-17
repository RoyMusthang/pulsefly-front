import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { ModeToggle } from './mode-toggle';
import { useUserSession } from './state/tags/asfd';

const Header: React.FC = () => {
  const { user, setUser } = useUserSession();
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
      const parsedToken = parseJwt(token)
      setUser(JSON.parse(parsedToken))
      localStorage.setItem('user', parseJwt(token))

    };

    validateToken();
  }, [navigate]);

  return (
    <header className="sticky shadow-sm p-4 flex justify-between items-center">



      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 flex  gap-5 sm:flex-initial">
          <ModeToggle />
          <Button variant="outline" size="icon">
            <Bell />
            <pre>{ }</pre>
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback>US</AvatarFallback>
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
              <Link to="https://api.whatsapp.com/send/?phone=559192142938&text&type=phone_number&app_absent=0">
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
