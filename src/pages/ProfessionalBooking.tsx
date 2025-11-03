import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CreditCard, MapPin, User } from "lucide-react";
import { toast } from "sonner";

export default function ProfessionalBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const professional = location.state?.professional;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const availableDates = [
    "2024-02-15",
    "2024-02-16",
    "2024-02-19",
    "2024-02-20",
    "2024-02-22",
  ];

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handlePayment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Por favor, selecione data e horário");
      return;
    }
    
    // Simular pagamento
    toast.success("Pagamento confirmado! Consulta agendada com sucesso.");
    setTimeout(() => {
      navigate("/appointments");
    }, 1500);
  };

  if (!professional) {
    navigate("/professionals");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Agendar Consulta" showBack />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Professional Info */}
        <Card className="shadow-soft border-border">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {professional.name}
                </h3>
                <Badge variant="secondary" className="mt-1">
                  {professional.specialty}
                </Badge>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {professional.location}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{professional.experience}</p>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Selecione a Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {availableDates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  onClick={() => setSelectedDate(date)}
                  className="h-auto py-3 flex flex-col"
                >
                  <span className="text-xs">
                    {new Date(date).toLocaleDateString("pt-BR", { weekday: "short" })}
                  </span>
                  <span className="text-sm font-semibold">
                    {new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card className="shadow-soft border-border animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Selecione o Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    size="sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment */}
        {selectedDate && selectedTime && (
          <Card className="shadow-soft border-border animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Valor da consulta</span>
                <span className="text-lg font-semibold text-foreground">R$ 250,00</span>
              </div>
              
              <Button onClick={handlePayment} className="w-full" size="lg">
                Confirmar Pagamento
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
