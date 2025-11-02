import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { CrisisButton } from "@/components/Layout/CrisisButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Pill, MoreVertical, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const medications = [
  {
    id: 1,
    name: "Ibuprofeno",
    dosage: "600mg",
    frequency: "A cada 8 horas",
    times: ["08:00", "16:00", "00:00"],
    color: "bg-destructive",
    lastTaken: "Hoje às 14:30",
    active: true,
  },
  {
    id: 2,
    name: "Anticoncepcional",
    dosage: "1 comprimido",
    frequency: "Diariamente",
    times: ["22:00"],
    color: "bg-primary",
    lastTaken: "Ontem às 22:00",
    active: true,
  },
  {
    id: 3,
    name: "Vitamina D",
    dosage: "2000 UI",
    frequency: "Diariamente",
    times: ["08:00"],
    color: "bg-accent",
    lastTaken: "Hoje às 08:15",
    active: true,
  },
];

const upcomingDoses = [
  { medication: "Ibuprofeno", time: "16:00", inMinutes: 45 },
  { medication: "Anticoncepcional", time: "22:00", inMinutes: 390 },
];

export default function Medications() {
  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Medicamentos" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Upcoming Doses */}
        <Card className="shadow-medium border-border bg-gradient-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary-foreground">
              <Bell className="w-5 h-5" />
              Próximas Doses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDoses.map((dose, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50"
              >
                <div>
                  <p className="font-semibold text-secondary-foreground">{dose.medication}</p>
                  <p className="text-sm text-secondary-foreground/70">Horário: {dose.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Em {dose.inMinutes} min
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Medications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Medicamentos Ativos ({medications.filter(m => m.active).length})
            </h2>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {medications.filter(m => m.active).map((med) => (
              <Card key={med.id} className="shadow-soft border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", med.color)}>
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{med.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {med.dosage} • {med.frequency}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Última dose: {med.lastTaken}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Horários:</p>
                    <div className="flex gap-2 flex-wrap">
                      {med.times.map((time, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Marcar como Tomado
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Medication History */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg">Histórico Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <div className="w-2 h-2 rounded-full bg-accent mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Vitamina D tomada</p>
                <p className="text-xs text-muted-foreground">Hoje às 08:15 • Dosagem: 2000 UI</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Ibuprofeno tomado</p>
                <p className="text-xs text-muted-foreground">Hoje às 14:30 • Dosagem: 600mg</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Anticoncepcional tomado</p>
                <p className="text-xs text-muted-foreground">Ontem às 22:00 • Dosagem: 1 comprimido</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <CrisisButton />
      <BottomNav />
    </div>
  );
}
