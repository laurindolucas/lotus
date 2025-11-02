import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { CrisisButton } from "@/components/Layout/CrisisButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, Pill, TrendingUp, Users, FileText, ArrowRight, Smile, Meh, Frown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const quickStats = [
    { label: "Próximo Ciclo", value: "em 7 dias", icon: Calendar, color: "text-primary" },
    { label: "Sintomas (7d)", value: "12 registros", icon: Heart, color: "text-secondary-dark" },
    { label: "Medicamentos", value: "3 ativos", icon: Pill, color: "text-accent" },
  ];

  const quickActions = [
    { label: "Registrar Sintomas", icon: Heart, path: "/symptoms", gradient: "from-secondary to-secondary-dark" },
    { label: "Ver Calendário", icon: Calendar, path: "/calendar", gradient: "from-primary to-primary-glow" },
    { label: "Medicamentos", icon: Pill, path: "/medications", gradient: "from-accent to-accent-soft" },
    { label: "Profissionais", icon: Users, path: "/professionals", gradient: "from-primary-light to-primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Olá, Maria! 👋" showNotifications showSettings />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Mood Check */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg">Como você está se sentindo hoje?</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 justify-around">
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent-soft transition-colors">
              <Smile className="w-8 h-8 text-accent" />
              <span className="text-xs text-muted-foreground">Bem</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary transition-colors">
              <Meh className="w-8 h-8 text-secondary-dark" />
              <span className="text-xs text-muted-foreground">Normal</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-destructive/10 transition-colors">
              <Frown className="w-8 h-8 text-destructive" />
              <span className="text-xs text-muted-foreground">Ruim</span>
            </button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-soft border-border">
                <CardContent className="pt-4 flex flex-col items-center text-center gap-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-soft hover:shadow-medium transition-all hover:scale-[1.02]`}
                >
                  <Icon className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium text-left">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Atividade Recente
              <Button variant="ghost" size="sm" onClick={() => navigate("/reports")}>
                Ver tudo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <div className="w-2 h-2 rounded-full bg-secondary-dark mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Sintoma registrado</p>
                <p className="text-xs text-muted-foreground">Dor pélvica • Intensidade 6/10 • Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <div className="w-2 h-2 rounded-full bg-accent mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Medicamento tomado</p>
                <p className="text-xs text-muted-foreground">Ibuprofeno 600mg • Hoje às 14:30</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Ciclo atualizado</p>
                <p className="text-xs text-muted-foreground">Menstruação • Dia 3 • Ontem</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="shadow-soft border-border bg-gradient-secondary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary-dark" />
              Dica do Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground mb-3">
              Manter um registro detalhado dos seus sintomas ajuda seu médico a criar um plano de tratamento mais eficaz para você.
            </p>
            <Button variant="ghost" size="sm" onClick={() => navigate("/articles")} className="text-secondary-foreground hover:text-secondary-foreground">
              Ler mais artigos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </main>

      <CrisisButton />
      <BottomNav />
    </div>
  );
}
