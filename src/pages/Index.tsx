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
        <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-white shadow-glow p-8 flex items-center justify-center">
          <img src={lotusLogo} alt="LOTUS Logo" className="w-full h-full object-contain rounded-full" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">LOTUS</h1>
        <p className="text-xl text-muted-foreground">Cuidado Integral para Você</p>
      </div>
    </div>
  );
};

export default Index;
