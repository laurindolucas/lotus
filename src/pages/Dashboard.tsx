import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { WeekCalendar } from "@/components/Dashboard/WeekCalendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, Pill, Users, FileText, ArrowRight, AlertCircle, FileBarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState("Usuária");
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState([
    { label: "Próximo Ciclo", value: "em 7 dias", icon: Calendar, color: "text-primary" },
    { label: "Sintomas (7d)", value: "0 registros", icon: Heart, color: "text-secondary-dark" },
    { label: "Medicamentos", value: "0 ativos", icon: Pill, color: "text-accent" },
  ]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchRecentActivities();
      fetchQuickStats();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data?.name) {
      setUserName(data.name);
    }
  };

  const fetchQuickStats = async () => {
    if (!user) return;

    // Buscar próximo ciclo
    const { data: cycles } = await (supabase as any)
      .from("menstruation_cycles")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(2);

    let nextCycleText = "Não registrado";
    if (cycles && cycles.length > 1) {
      const cycleDuration = differenceInDays(
        new Date(cycles[0].date),
        new Date(cycles[1].date)
      );
      const nextCycleDate = new Date(cycles[0].date);
      nextCycleDate.setDate(nextCycleDate.getDate() + cycleDuration);
      const daysUntil = differenceInDays(nextCycleDate, new Date());
      nextCycleText = daysUntil > 0 ? `em ${daysUntil} dias` : "hoje";
    }

    // Buscar sintomas dos últimos 7 dias
    const sevenDaysAgo = subDays(new Date(), 7).toISOString();
    const { data: symptoms } = await (supabase as any)
      .from("symptoms")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", sevenDaysAgo);

    // Buscar medicamentos ativos
    const { data: medications } = await (supabase as any)
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      .eq("active", true);

    setQuickStats([
      { label: "Próximo Ciclo", value: nextCycleText, icon: Calendar, color: "text-primary" },
      { label: "Sintomas (7d)", value: `${symptoms?.length || 0} registros`, icon: Heart, color: "text-secondary-dark" },
      { label: "Medicamentos", value: `${medications?.length || 0} ativos`, icon: Pill, color: "text-accent" },
    ]);
  };

  const fetchRecentActivities = async () => {
    if (!user) return;

    const activities: any[] = [];

    // Buscar sintomas recentes
    const { data: symptoms } = await (supabase as any)
      .from("symptoms")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (symptoms) {
      symptoms.forEach((symptom: any) => {
        activities.push({
          type: "symptom",
          date: symptom.created_at,
          description: `${symptom.symptom_name} • Intensidade ${symptom.intensity}/10`,
        });
      });
    }

    // Buscar medicamentos tomados recentemente
    const { data: medLogs } = await (supabase as any)
      .from("medication_logs")
      .select("*, medications(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (medLogs) {
      medLogs.forEach((log: any) => {
        activities.push({
          type: "medication",
          date: log.created_at,
          description: `Medicamento: ${log.medications?.name}`,
        });
      });
    }

    // Buscar menstruação recente
    const { data: cycles } = await (supabase as any)
      .from("menstruation_cycles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (cycles) {
      cycles.forEach((cycle: any) => {
        activities.push({
          type: "menstruation",
          date: cycle.created_at,
          description: `Menstruação registrada${cycle.flow_intensity ? ` • Fluxo: ${cycle.flow_intensity}` : ''}`,
        });
      });
    }

    // Buscar consultas recentes
    const { data: appointments } = await (supabase as any)
      .from("appointments")
      .select("*, professionals(name, specialty)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (appointments) {
      appointments.forEach((apt: any) => {
        activities.push({
          type: "appointment",
          date: apt.created_at,
          description: `Encontro com ${apt.professionals?.name} • ${apt.status}`,
        });
      });
    }

    // Ordenar por data e pegar as 5 mais recentes
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivities(activities.slice(0, 5));
  };

  const quickActions = [
    { label: "Registrar Sintomas", icon: Heart, path: "/symptoms", gradient:  "from-primary-light to-primary"},
    { label: "Ver Calendário", icon: Calendar, path: "/calendar", gradient:  "from-primary-light to-primary"},
    { label: "Profissionais", icon: Users, path: "/professionals", gradient: "from-secondary to-secondary-dark" },
    { label: "Medicamentos", icon: Pill, path: "/medications", gradient: "from-secondary to-secondary-dark" },
    { label: "Modo Crise", icon: AlertCircle, path: "/crisis", gradient: "from-crisis to-destructive" },
    { label: "Obter Relatório", icon: FileBarChart, path: "/reports", gradient: "from-crisis to-destructive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Lotus" showNotifications showSettings className="lotus-header" />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Olá, {userName}</h2>
        </div>

        {/* Week Calendar */}
        <Card className="shadow-soft border-border">
          <CardContent className="pt-6">
            <WeekCalendar onDateClick={(date) => navigate("/calendar")} />
          </CardContent>
        </Card>

        {/* Alerts */}
        {quickStats[0].value !== "Não registrado" && (
          <Alert className="border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Seu próximo ciclo está previsto para {quickStats[0].value}.
            </AlertDescription>
          </Alert>
        )}

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
                  <Icon className="w-6 h-6 mb-2" />
                  <p className="text-xs font-medium text-left">{action.label}</p>
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
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma atividade recente
              </p>
            ) : (
              recentActivities.map((activity, index) => {
                const activityDate = new Date(activity.date);
                const formattedDate = format(activityDate, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
                
                const iconColors = {
                  symptom: "bg-secondary-dark",
                  medication: "bg-accent",
                  menstruation: "bg-primary",
                  appointment: "bg-destructive",
                };
                
                const labels = {
                  symptom: "Sintoma registrado",
                  medication: "Medicamento tomado",
                  menstruation: "Menstruação",
                  appointment: "Consulta",
                };
                
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    <div className={`w-2 h-2 rounded-full ${iconColors[activity.type as keyof typeof iconColors]} mt-2`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{labels[activity.type as keyof typeof labels]}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description} • {formattedDate}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

      </main>

      <BottomNav />
    </div>
  );
}
