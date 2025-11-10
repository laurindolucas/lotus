import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Bell, Shield, Heart, Users, LogOut, ChevronRight, Lock, FileText, Scale } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export default function Settings() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [notifications, setNotifications] = useState({
    medications: true,
    cycle: true,
    symptoms: false,
    articles: true,
  });
  const [companionMode, setCompanionMode] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profile) {
      setUserData({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair da conta");
    } else {
      toast.success("Você saiu da conta");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Configurações" showBack />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Profile Section */}
        <Card className="shadow-soft border-border">
          <CardContent className="pt-6">
            <div 
              onClick={() => navigate("/profile")}
              className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-muted rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">
                  {userData.name || "Usuário"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userData.email || "email@exemplo.com"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notificações
            </CardTitle>
            <CardDescription>Gerencie suas preferências de notificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="med-notif" className="flex-1 cursor-pointer">
                <p className="font-medium text-foreground">Lembretes de Medicamentos</p>
                <p className="text-xs text-muted-foreground">Receba alertas nos horários</p>
              </Label>
              <Switch
                id="med-notif"
                checked={notifications.medications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, medications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="cycle-notif" className="flex-1 cursor-pointer">
                <p className="font-medium text-foreground">Previsão do Ciclo</p>
                <p className="text-xs text-muted-foreground">Avisos sobre próxima menstruação</p>
              </Label>
              <Switch
                id="cycle-notif"
                checked={notifications.cycle}
                onCheckedChange={(checked) => setNotifications({ ...notifications, cycle: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symptom-notif" className="flex-1 cursor-pointer">
                <p className="font-medium text-foreground">Lembretes de Registro</p>
                <p className="text-xs text-muted-foreground">Lembrete para registrar sintomas</p>
              </Label>
              <Switch
                id="symptom-notif"
                checked={notifications.symptoms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, symptoms: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="article-notif" className="flex-1 cursor-pointer">
                <p className="font-medium text-foreground">Novos Artigos</p>
                <p className="text-xs text-muted-foreground">Notificações de conteúdo novo</p>
              </Label>
              <Switch
                id="article-notif"
                checked={notifications.articles}
                onCheckedChange={(checked) => setNotifications({ ...notifications, articles: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Companion Mode */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary-dark" />
              Modo Acompanhante
            </CardTitle>
            <CardDescription>Permita que alguém de confiança acompanhe seu progresso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="companion-mode" className="flex-1 cursor-pointer">
                <p className="font-medium text-foreground">Ativar Modo Acompanhante</p>
                <p className="text-xs text-muted-foreground">
                  {companionMode ? "1 acompanhante conectado" : "Nenhum acompanhante"}
                </p>
              </Label>
              <Switch
                id="companion-mode"
                checked={companionMode}
                onCheckedChange={setCompanionMode}
              />
            </div>

            {companionMode && (
              <Button variant="outline" className="w-full">
                Gerenciar Acompanhantes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Privacidade & Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto py-3"
              onClick={() => navigate("/change-password")}
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Alterar Senha
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto py-3"
              onClick={() => navigate("/privacy-policy")}
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Política de Privacidade
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              Sobre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto py-3"
              onClick={() => navigate("/terms-of-service")}
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Termos de Uso
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="pt-2">
              <p className="text-xs text-center text-muted-foreground">Versão 1.0.0</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:bg-destructive/10 border-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
