import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import lotusLogo from "@/assets/lotus-logo.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    birthDate: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && (!formData.name || !formData.birthDate)) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (!formData.email || !formData.password) {
      toast.error("Por favor, preencha email e senha");
      return;
    }

    // Após login, ir para dashboard. Após cadastro, mostrar onboarding
    toast.success(isLogin ? "Bem-vinda de volta!" : "Conta criada com sucesso!");
    setTimeout(() => {
      if (isLogin) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
        <div className="w-32 h-32 mb-6 rounded-full bg-white shadow-glow p-4 flex items-center justify-center">
          <img src={lotusLogo} alt="LOTUS Logo" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
          {isLogin ? "Bem-vinda de volta" : "Crie sua conta"}
        </h1>

        <p className="text-center text-muted-foreground mb-8 max-w-sm">
          {isLogin 
            ? "Acesse sua conta para continuar seu acompanhamento" 
            : "Junte-se a nós para começar sua jornada de autocuidado"}
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Como gostaria de ser chamada?"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-foreground">Data de Nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {isLogin && (
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => toast.info("Funcionalidade em desenvolvimento")}
            >
              Esqueceu sua senha?
            </button>
          )}

          <Button type="submit" size="lg" className="w-full mt-6">
            {isLogin ? "Entrar" : "Criar Conta"}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? (
                <>
                  Não tem uma conta?{" "}
                  <span className="text-primary font-medium">Cadastre-se</span>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <span className="text-primary font-medium">Entrar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
