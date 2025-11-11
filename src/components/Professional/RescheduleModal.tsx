import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface Appointment {
  id: string;
  professional_id: string;
  date: string;
  time: string;
  professionals: {
    id: string;
    name: string;
    specialty: string;
  };
}

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const availableTimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

export function RescheduleModal({ 
  appointment, 
  isOpen, 
  onClose, 
  onSuccess 
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Selecione uma nova data e horário");
      return;
    }

    if (!appointment) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          status: "agendada",
        })
        .eq("id", appointment.id);

      if (error) throw error;

      toast.success("Consulta reagendada com sucesso!");
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Erro ao reagendar consulta");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reagendar Consulta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="text-center pb-4 border-b border-border">
            <h3 className="font-semibold">{appointment.professionals.name}</h3>
            <p className="text-sm text-muted-foreground">{appointment.professionals.specialty}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Agendamento atual: {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
            </p>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-center block">Selecione a Nova Data</Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border border-border"
              />
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="space-y-2 animate-fade-in">
              <Label>Selecione o Novo Horário</Label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-xs"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation */}
          {selectedDate && selectedTime && (
            <div className="p-4 bg-primary-light/20 rounded-lg animate-scale-in">
              <h4 className="font-semibold text-sm mb-2">Confirmar Reagendamento</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Nova Data:</strong> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Novo Horário:</strong> {selectedTime}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Profissional:</strong> {appointment.professionals.name}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1" disabled={loading}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1" 
              disabled={!selectedDate || !selectedTime || loading}
            >
              {loading ? "Reagendando..." : "Confirmar Reagendamento"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
