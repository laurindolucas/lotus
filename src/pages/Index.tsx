// Página inicial que redireciona para o onboarding

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lotusLogo from "@/assets/lotus-logo-vertical.png";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente para o login após 1 segundo
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-calm">
      <div className="text-center animate-fade-in">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white shadow-glow p-6 flex items-center justify-center">
          <img src={lotusLogo} alt="LOTUS Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">LOTUS</h1>
        <p className="text-xl text-muted-foreground">Cuidado Integral para Você</p>
      </div>
    </div>
  );
};

export default Index;
