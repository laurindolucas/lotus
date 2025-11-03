import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const upcomingAppointments = [
  {
    id: 1,
    professional: "Dra. Ana Silva",
    specialty: "Ginecologista",
    date: "2024-02-15",
    time: "14:00",
    location: "Clínica Saúde - São Paulo, SP",
    status: "confirmed",
  },
  {
    id: 2,
    professional: "Dra. Mariana Costa",
    specialty: "Nutricionista",
    date: "2024-02-20",
    time: "10:30",
    location: "Consultório - São Paulo, SP",
    status: "confirmed",
  },
];

const pastAppointments = [
  {
    id: 3,
    professional: "Dr. Pedro Santos",
    specialty: "Fisioterapeuta",
    date: "2024-01-10",
    time: "16:00",
    location: "Clínica Vida - São Paulo, SP",
    status: "completed",
  },
];

export default function Appointments() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Minhas Consultas" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <Button 
          onClick={() => navigate("/professionals")}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agendar Nova Consulta
        </Button>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Agendadas</TabsTrigger>
            <TabsTrigger value="past">Realizadas</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="shadow-soft border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {appointment.professional}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        {appointment.specialty}
                      </Badge>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      Confirmada
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(appointment.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {appointment.location}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reagendar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="shadow-soft border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {appointment.professional}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        {appointment.specialty}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      Realizada
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(appointment.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Agendar Novamente
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
