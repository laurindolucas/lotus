import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, TrendingUp, TrendingDown, Calendar, Heart, Pill, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("1");

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
              <p className="text-2xl font-bold text-foreground mb-1">28</p>
              <p className="text-xs text-muted-foreground">Dias de ciclo médio</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border">
            <CardContent className="pt-6 text-center">
              <Heart className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground mb-1">47</p>
              <p className="text-xs text-muted-foreground">Sintomas registrados</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border">
            <CardContent className="pt-6 text-center">
              <Pill className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground mb-1">3</p>
              <p className="text-xs text-muted-foreground">Medicamentos ativos</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border">
            <CardContent className="pt-6 text-center">
              <TrendingDown className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground mb-1">-15%</p>
              <p className="text-xs text-muted-foreground">Redução da dor</p>
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
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Dor Pélvica</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">18 registros</span>
                    <TrendingDown className="w-4 h-4 text-accent" />
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Fadiga</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">12 registros</span>
                    <TrendingUp className="w-4 h-4 text-destructive" />
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-dark rounded-full" style={{ width: "50%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Cólicas</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">9 registros</span>
                    <TrendingDown className="w-4 h-4 text-accent" />
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "38%" }} />
                </div>
              </div>
            </div>
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
              <span className="font-semibold">28 dias</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-sm">Duração da menstruação</span>
              <span className="font-semibold">5 dias</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-sm">Último ciclo</span>
              <span className="font-semibold">10 Nov 2024</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Próximo previsto</span>
              <span className="font-semibold">24 Nov 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg">Insights Personalizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-accent-soft">
              <p className="text-sm font-medium text-accent-foreground mb-1">
                ✓ Boa notícia!
              </p>
              <p className="text-xs text-accent-foreground/80">
                Seus registros mostram uma redução de 15% na intensidade da dor nas últimas duas semanas.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-sm font-medium text-secondary-foreground mb-1">
                ℹ️ Observação
              </p>
              <p className="text-xs text-secondary-foreground/80">
                A fadiga tem sido mais frequente. Considere discutir isso com seu médico.
              </p>
            </div>
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
