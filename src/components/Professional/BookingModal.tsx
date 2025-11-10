import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  available_times?: any;
}

interface BookingModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const availableTimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

export function BookingModal({ 
  professional, 
  isOpen, 
  onClose, 
  onSuccess 
}: BookingModalProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Selecione uma data e horário");
      return;
    }

    if (!user || !professional) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          professional_id: professional.id,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          status: "agendada",
        });

      if (error) throw error;

      toast.success("Consulta agendada com sucesso!");
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Erro ao agendar consulta");
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

  if (!professional) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Consulta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="text-center pb-4 border-b border-border">
            <h3 className="font-semibold">{professional.name}</h3>
            <p className="text-sm text-muted-foreground">{professional.specialty}</p>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Selecione a Data</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="rounded-md border border-border mx-auto"
            />
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="space-y-2 animate-fade-in">
              <Label>Selecione o Horário</Label>
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
              <h4 className="font-semibold text-sm mb-2">Confirmar Agendamento</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Data:</strong> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Horário:</strong> {selectedTime}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Profissional:</strong> {professional.name}
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
              {loading ? "Agendando..." : "Confirmar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
