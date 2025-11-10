import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pill, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { format, addHours, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

export default function Medications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<any[]>([]);
  const [upcomingDoses, setUpcomingDoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequencyHours: "8",
    startTime: "08:00",
    notes: "",
  });

  useEffect(() => {
    if (user) fetchMedications();
  }, [user]);

  const fetchMedications = async () => {
    if (!user) return;
    const { data } = await supabase.from("medications").select("*").eq("user_id", user.id).eq("active", true);
    setMedications(data || []);
    calculateUpcomingDoses(data || []);
    setLoading(false);
  };

  const calculateUpcomingDoses = (meds: any[]) => {
    const now = new Date();
    const doses: any[] = [];
    meds.forEach((med) => {
      const [hours, minutes] = med.start_time.split(":").map(Number);
      let currentTime = new Date(startOfDay(now));
      currentTime.setHours(hours, minutes, 0, 0);
      while (isBefore(currentTime, endOfDay(now))) {
        if (isAfter(currentTime, now)) {
          doses.push({ medicationId: med.id, medicationName: med.name, dosage: med.dosage, scheduledTime: currentTime });
        }
        currentTime = addHours(currentTime, med.frequency_hours);
      }
    });
    setUpcomingDoses(doses.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()).slice(0, 6));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.dosage || !user) return;
    const { error } = await supabase.from("medications").insert({
      user_id: user.id, name: formData.name, dosage: formData.dosage,
      frequency_hours: parseInt(formData.frequencyHours), start_time: formData.startTime,
      notes: formData.notes, active: true
    });
    if (error) toast.error("Erro ao adicionar"); else { toast.success("Medicamento adicionado!"); setIsModalOpen(false); fetchMedications(); }
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Medicamentos" showBack showNotifications />
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <Button onClick={() => setIsModalOpen(true)} size="lg" className="w-full"><Plus className="w-5 h-5 mr-2" />Adicionar Medicamento</Button>
        
        <Card className="shadow-soft border-border">
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Próximas Doses</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upcomingDoses.map((dose, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div><p className="font-medium text-sm">{dose.medicationName}</p><p className="text-xs text-primary">{format(dose.scheduledTime, "HH:mm")}</p></div>
                <Button size="sm" variant="ghost"><CheckCircle2 className="w-5 h-5 text-primary" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader><CardTitle className="flex items-center gap-2"><Pill className="w-5 h-5" />Medicamentos Ativos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="p-3 bg-muted rounded-lg"><h4 className="font-semibold text-sm">{med.name}</h4><p className="text-xs">{med.dosage} - A cada {med.frequency_hours}h</p></div>
            ))}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>Adicionar Medicamento</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div><Label>Nome</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><Label>Dosagem</Label><Input value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Frequência (horas)</Label><Input type="number" value={formData.frequencyHours} onChange={(e) => setFormData({ ...formData, frequencyHours: e.target.value })} /></div>
              <div><Label>Primeira Dose</Label><Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} /></div>
            </div>
            <Button onClick={handleSubmit} className="w-full">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
      <BottomNav />
    </div>
  );
}
