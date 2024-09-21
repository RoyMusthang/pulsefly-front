import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Header from "@/components/header";

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
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        
      </div>
    </>
  );
}