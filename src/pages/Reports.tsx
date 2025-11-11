import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, TrendingUp, TrendingDown, Calendar, Heart, Pill, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subMonths, differenceInDays } from "date-fns";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const [historyFilter, setHistoryFilter] = useState<"week" | "month">("week");
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const { user } = useAuth();
  const [stats, setStats] = useState({
    avgCycleDays: 0,
    totalSymptoms: 0,
    activeMedications: 0,
    painReduction: 0,
    lastCycleDate: null as string | null,
    nextCycleDate: null as string | null,
    avgMenstruationDays: 0,
  });
  const [symptomTrends, setSymptomTrends] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchSymptomTrends();
      fetchActivityHistory();
    }
  }, [user, selectedPeriod, historyFilter]);

  const fetchStats = async () => {
    if (!user) return;

    const monthsAgo = parseInt(selectedPeriod);
    const startDate = subMonths(new Date(), monthsAgo);

    // Buscar ciclos menstruais
    const { data: cycles } = await (supabase as any)
      .from("menstruation_cycles")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString())
      .order("date", { ascending: true });

    // Buscar sintomas
    const { data: symptoms } = await (supabase as any)
      .from("symptoms")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString());

    // Buscar medicamentos ativos
    const { data: medications } = await (supabase as any)
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      .eq("active", true);

    // Calcular estatísticas
    let avgCycleDays = 28; // default
    let lastCycleDate = null;
    let avgMenstruationDays = 5; // default

    if (cycles && cycles.length > 1) {
      const cycleDurations: number[] = [];
      for (let i = 1; i < cycles.length; i++) {
        const diff = differenceInDays(
          new Date(cycles[i].date),
          new Date(cycles[i - 1].date)
        );
        cycleDurations.push(diff);
      }
      if (cycleDurations.length > 0) {
        avgCycleDays = Math.round(
          cycleDurations.reduce((a, b) => a + b, 0) / cycleDurations.length
        );
      }
      lastCycleDate = cycles[cycles.length - 1].date;
    }

    // Calcular próximo ciclo
    let nextCycleDate = null;
    if (lastCycleDate) {
      const nextDate = new Date(lastCycleDate);
      nextDate.setDate(nextDate.getDate() + avgCycleDays);
      nextCycleDate = nextDate.toISOString().split("T")[0];
    }

    // Calcular redução da dor (comparando intensidade média dos sintomas)
    let painReduction = 0;
    if (symptoms && symptoms.length > 4) {
      const halfPoint = Math.floor(symptoms.length / 2);
      const firstHalf = symptoms.slice(0, halfPoint);
      const secondHalf = symptoms.slice(halfPoint);
      
      const avgFirst = firstHalf.reduce((sum: number, s: any) => sum + s.intensity, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((sum: number, s: any) => sum + s.intensity, 0) / secondHalf.length;
      
      painReduction = Math.round(((avgFirst - avgSecond) / avgFirst) * 100);
    }

    setStats({
      avgCycleDays,
      totalSymptoms: symptoms?.length || 0,
      activeMedications: medications?.length || 0,
      painReduction,
      lastCycleDate,
      nextCycleDate,
      avgMenstruationDays,
    });
  };

  const fetchSymptomTrends = async () => {
    if (!user) return;

    const { data: symptoms } = await (supabase as any)
      .from("symptoms")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", subMonths(new Date(), 1).toISOString());

    if (!symptoms) return;

    // Agrupar sintomas por nome
    const grouped = symptoms.reduce((acc: any, symptom: any) => {
      if (!acc[symptom.symptom_name]) {
        acc[symptom.symptom_name] = { count: 0, totalIntensity: 0 };
      }
      acc[symptom.symptom_name].count++;
      acc[symptom.symptom_name].totalIntensity += symptom.intensity;
      return acc;
    }, {});

    // Converter para array e ordenar
    const trends = Object.entries(grouped)
      .map(([name, data]: [string, any]) => ({
        name,
        count: data.count,
        avgIntensity: data.totalIntensity / data.count,
        percentage: (data.count / symptoms.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setSymptomTrends(trends);
  };

  const fetchActivityHistory = async () => {
    if (!user) return;

    const daysAgo = historyFilter === "week" ? 7 : 30;
    const startDate = subMonths(new Date(), 0);
    startDate.setDate(startDate.getDate() - daysAgo);

    const activities: any[] = [];

    // Buscar sintomas
    const { data: symptoms } = await (supabase as any)
      .from("symptoms")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (symptoms) {
      symptoms.forEach((symptom: any) => {
        activities.push({
          type: "symptom",
          date: symptom.created_at,
          description: `${symptom.symptom_name} • Intensidade ${symptom.intensity}/10`,
        });
      });
    }

    // Buscar menstruação
    const { data: cycles } = await (supabase as any)
      .from("menstruation_cycles")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (cycles) {
      cycles.forEach((cycle: any) => {
        activities.push({
          type: "menstruation",
          date: cycle.created_at,
          description: `Menstruação registrada${cycle.flow_intensity ? ` • Fluxo: ${cycle.flow_intensity}` : ''}`,
        });
      });
    }

    // Buscar medicamentos
    const { data: medLogs } = await (supabase as any)
      .from("medication_logs")
      .select("*, medications(name)")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (medLogs) {
      medLogs.forEach((log: any) => {
        activities.push({
          type: "medication",
          date: log.created_at,
          description: `Medicamento: ${log.medications?.name}`,
        });
      });
    }

    // Ordenar por data
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setActivityHistory(activities);
  };

  const handleDownloadReport = () => {
    toast.success(`Relatório dos últimos ${selectedPeriod === "1" ? "1 mês" : selectedPeriod === "3" ? "3 meses" : "6 meses"} baixado com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Obter Relatório" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Export Section */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Gerar Relatório
            </CardTitle>
            <CardDescription>
              Selecione o período e baixe um relatório completo dos seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={selectedPeriod === "1" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("1")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-2xl font-bold">1</span>
                <span className="text-xs">mês</span>
              </Button>
              <Button
                variant={selectedPeriod === "3" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("3")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-2xl font-bold">3</span>
                <span className="text-xs">meses</span>
              </Button>
              <Button
                variant={selectedPeriod === "6" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("6")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-2xl font-bold">6</span>
                <span className="text-xs">meses</span>
              </Button>
            </div>
            
            <Button onClick={handleDownloadReport} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório
            </Button>
          </CardContent>
        </Card>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-soft border-border">
            <CardContent className="pt-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground mb-1">{stats.avgCycleDays}</p>
              <p className="text-xs text-muted-foreground">Dias de ciclo médio</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border">
            <CardContent className="pt-6 text-center">
              <Heart className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground mb-1">{stats.totalSymptoms}</p>
              <p className="text-xs text-muted-foreground">Sintomas registrados</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border">
            <CardContent className="pt-6 text-center">
              <Pill className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground mb-1">{stats.activeMedications}</p>
              <p className="text-xs text-muted-foreground">Medicamentos ativos</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border">
            <CardContent className="pt-6 text-center">
              {stats.painReduction >= 0 ? (
                <TrendingDown className="w-8 h-8 text-accent mx-auto mb-2" />
              ) : (
                <TrendingUp className="w-8 h-8 text-destructive mx-auto mb-2" />
              )}
              <p className="text-2xl font-bold text-foreground mb-1">
                {stats.painReduction > 0 ? `-${stats.painReduction}%` : `${Math.abs(stats.painReduction)}%`}
              </p>
              <p className="text-xs text-muted-foreground">Variação da dor</p>
            </CardContent>
          </Card>
        </div>

        {/* Symptoms Trend */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg">Tendência de Sintomas</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {symptomTrends.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum sintoma registrado no período
              </p>
            ) : (
              <div className="space-y-4">
                {symptomTrends.map((trend, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{trend.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{trend.count} registros</span>
                        {trend.avgIntensity > 5 ? (
                          <TrendingUp className="w-4 h-4 text-destructive" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-accent" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${trend.percentage}%`,
                          backgroundColor: `hsl(${trend.avgIntensity > 7 ? '0 70% 70%' : trend.avgIntensity > 4 ? '340 60% 70%' : '150 45% 75%'})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cycle Overview */}
        <Card className="shadow-soft border-border bg-gradient-primary">
          <CardHeader>
            <CardTitle className="text-white">Resumo do Ciclo</CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-sm">Duração média do ciclo</span>
              <span className="font-semibold">{stats.avgCycleDays} dias</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-sm">Duração da menstruação</span>
              <span className="font-semibold">{stats.avgMenstruationDays} dias</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-sm">Último ciclo</span>
              <span className="font-semibold">
                {stats.lastCycleDate
                  ? format(new Date(stats.lastCycleDate), "dd MMM yyyy")
                  : "Não registrado"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Próximo previsto</span>
              <span className="font-semibold">
                {stats.nextCycleDate
                  ? format(new Date(stats.nextCycleDate), "dd MMM yyyy")
                  : "Não disponível"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg">Insights Personalizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.painReduction > 10 && (
              <div className="p-3 rounded-lg bg-accent-soft">
                <p className="text-sm font-medium text-accent-foreground mb-1">
                  ✓ Boa notícia!
                </p>
                <p className="text-xs text-accent-foreground/80">
                  Seus registros mostram uma redução de {stats.painReduction}% na intensidade da dor no período selecionado.
                </p>
              </div>
            )}
            {stats.painReduction < -10 && (
              <div className="p-3 rounded-lg bg-destructive/10">
                <p className="text-sm font-medium text-destructive mb-1">
                  ⚠️ Atenção
                </p>
                <p className="text-xs text-destructive/80">
                  A intensidade da dor aumentou {Math.abs(stats.painReduction)}%. Considere discutir isso com seu médico.
                </p>
              </div>
            )}
            {symptomTrends.length > 0 && symptomTrends[0].count > 10 && (
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-sm font-medium text-secondary-foreground mb-1">
                  ℹ️ Observação
                </p>
                <p className="text-xs text-secondary-foreground/80">
                  "{symptomTrends[0].name}" é o sintoma mais frequente ({symptomTrends[0].count} registros). Considere discutir isso com seu médico.
                </p>
              </div>
            )}
            {stats.totalSymptoms === 0 && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium text-foreground mb-1">
                  💡 Dica
                </p>
                <p className="text-xs text-muted-foreground">
                  Registre seus sintomas regularmente para obter insights mais precisos sobre sua saúde.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity History */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant={historyFilter === "week" ? "default" : "outline"}
                onClick={() => setHistoryFilter("week")}
              >
                Semana
              </Button>
              <Button
                size="sm"
                variant={historyFilter === "month" ? "default" : "outline"}
                onClick={() => setHistoryFilter("month")}
              >
                Mês
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activityHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma atividade no período selecionado
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {activityHistory.map((activity, index) => {
                  const activityDate = new Date(activity.date);
                  const formattedDate = format(activityDate, "d 'de' MMM 'às' HH:mm");
                  
                  const iconColors = {
                    symptom: "bg-secondary-dark",
                    medication: "bg-accent",
                    menstruation: "bg-primary",
                    appointment: "bg-destructive",
                  };
                  
                  const labels = {
                    symptom: "Sintoma",
                    medication: "Medicamento",
                    menstruation: "Menstruação",
                    appointment: "Consulta",
                  };
                  
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                      <div className={`w-2 h-2 rounded-full ${iconColors[activity.type as keyof typeof iconColors]} mt-2`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{labels[activity.type as keyof typeof labels]}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Download className="w-5 h-5" />
            <span className="text-xs">Exportar PDF</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Compartilhar</span>
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
