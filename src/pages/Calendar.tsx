import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Circle, Heart, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock data - dias de menstruação e sintomas
  const menstruationDays = [3, 4, 5, 6, 7];
  const symptomDays = [8, 12, 15, 18, 20];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDayStatus = (day: number) => {
    if (menstruationDays.includes(day)) return "menstruation";
    if (symptomDays.includes(day)) return "symptom";
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Calendário Menstrual" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Calendar Card */}
        <Card className="shadow-medium border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={previousMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-lg">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const status = getDayStatus(day);
                const isToday = day === new Date().getDate() && 
                                currentDate.getMonth() === new Date().getMonth();

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all relative",
                      isToday && "ring-2 ring-primary ring-offset-2",
                      status === "menstruation" && "bg-destructive/20 text-destructive hover:bg-destructive/30",
                      status === "symptom" && "bg-secondary text-secondary-foreground hover:bg-secondary-dark",
                      !status && "hover:bg-muted text-foreground"
                    )}
                  >
                    {day}
                    {status === "menstruation" && (
                      <Droplet className="w-3 h-3 absolute bottom-1" />
                    )}
                    {status === "symptom" && (
                      <Circle className="w-2 h-2 fill-current absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="shadow-soft border-border">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dias de Menstruação</p>
                  <p className="text-xs text-muted-foreground">Período menstrual registrado</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Circle className="w-3 h-3 fill-current text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dias com Sintomas</p>
                  <p className="text-xs text-muted-foreground">Sintomas registrados neste dia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cycle Info */}
        <Card className="shadow-soft border-border bg-gradient-primary">
          <CardHeader>
            <CardTitle className="text-white text-lg">Previsão do Próximo Ciclo</CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p className="text-2xl font-bold mb-2">7 dias</p>
            <p className="text-sm text-white/80">Próxima menstruação prevista para 24 de Novembro</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Droplet className="w-5 h-5" />
            <span className="text-xs">Marcar Menstruação</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Heart className="w-5 h-5" />
            <span className="text-xs">Registrar Sintomas</span>
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
