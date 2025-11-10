import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const commonSymptoms = [
  "Dor Pélvica",
  "Cólicas",
  "Fadiga",
  "Náusea",
  "Dor nas costas",
  "Inchaço",
  "Dor de cabeça",
  "Alteração no intestino",
];

export default function Symptoms() {
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number>(5);
  const [notes, setNotes] = useState("");
  const [recentSymptoms, setRecentSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecentSymptoms();
    }
  }, [user]);

  const fetchRecentSymptoms = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("symptoms")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching symptoms:", error);
      return;
    }

    setRecentSymptoms(data || []);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const [customSymptom, setCustomSymptom] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [symptomIntensities, setSymptomIntensities] = useState<Record<string, number>>({});
  const [currentSymptom, setCurrentSymptom] = useState<string | null>(null);

  const handleSymptomClick = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      // Remove symptom
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
      const newIntensities = { ...symptomIntensities };
      delete newIntensities[symptom];
      setSymptomIntensities(newIntensities);
    } else {
      // Add symptom and set as current to define intensity
      setCurrentSymptom(symptom);
    }
  };

  const confirmSymptomIntensity = (symptom: string, intensity: number) => {
    setSelectedSymptoms(prev => [...prev, symptom]);
    setSymptomIntensities(prev => ({ ...prev, [symptom]: intensity }));
    setCurrentSymptom(null);
  };

  const handleSave = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Selecione pelo menos um sintoma");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para registrar sintomas");
      return;
    }

    setLoading(true);

    try {
      const symptomsToInsert = selectedSymptoms.map(symptom => ({
        user_id: user.id,
        symptom_name: symptom,
        intensity: symptomIntensities[symptom] || 5,
        notes,
        date: new Date().toISOString().split('T')[0],
      }));

      const { error } = await supabase
        .from("symptoms")
        .insert(symptomsToInsert);

      if (error) throw error;

      toast.success("Sintomas registrados com sucesso!");
      setSelectedSymptoms([]);
      setSymptomIntensities({});
      setIntensity(5);
      setNotes("");
      setCurrentSymptom(null);
      setCustomSymptom("");
      setShowCustomInput(false);
      fetchRecentSymptoms();
    } catch (error) {
      console.error("Error saving symptoms:", error);
      toast.error("Erro ao registrar sintomas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Registrar Sintomas" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Symptoms Selection */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle>Selecione seus sintomas</CardTitle>
            <CardDescription>Cada sintoma terá sua própria intensidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showCustomInput ? (
              <div className="grid grid-cols-2 gap-3">
                {commonSymptoms.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomClick(symptom)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-sm font-medium transition-all relative",
                        isSelected
                          ? "border-primary bg-primary-light/20 text-primary"
                          : "border-border hover:border-primary/50 text-foreground"
                      )}
                    >
                      {symptom}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {isSelected && (
                        <div className="text-xs text-primary mt-1">
                          Intensidade: {symptomIntensities[symptom]}
                        </div>
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 text-sm font-medium transition-all text-muted-foreground hover:text-foreground"
                >
                  + Outro sintoma
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="custom">Nome do sintoma</Label>
                <Input
                  id="custom"
                  placeholder="Digite o nome do sintoma"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomSymptom("");
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      if (customSymptom.trim()) {
                        setCurrentSymptom(customSymptom.trim());
                        setShowCustomInput(false);
                      }
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            )}

            {/* Intensity Modal */}
            {currentSymptom && (
              <Card className="border-primary bg-primary-light/10">
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Defina a intensidade:</h3>
                    <p className="text-sm text-muted-foreground">{currentSymptom}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Leve</span>
                      <span className="text-2xl font-bold text-primary">{intensity}</span>
                      <span className="text-muted-foreground">Intenso</span>
                    </div>
                    <Slider
                      value={[intensity]}
                      onValueChange={(value) => setIntensity(value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setCurrentSymptom(null);
                        setIntensity(5);
                        setCustomSymptom("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        confirmSymptomIntensity(currentSymptom, intensity);
                        setIntensity(5);
                        setCustomSymptom("");
                      }}
                    >
                      Confirmar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>


        {/* Additional Notes */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle>Observações Adicionais</CardTitle>
            <CardDescription>Adicione qualquer detalhe que possa ser útil (opcional)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: A dor começou após o almoço, melhorou com descanso..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>
        {/* Save Button */}
        <Button
          onClick={handleSave}
          size="lg"
          className="w-full"
          disabled={selectedSymptoms.length === 0 || loading}
        >
          {loading ? "Salvando..." : "Salvar Registro"}
        </Button>

        {/* Recent History */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg">Últimos Registros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSymptoms.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum sintoma registrado ainda
              </p>
            ) : (
              recentSymptoms.map((symptom) => {
                const symptomDate = new Date(symptom.created_at);
                const formattedDate = format(symptomDate, "d 'de' MMMM, HH:mm", { locale: ptBR });
                const intensityColor = symptom.intensity >= 7 
                  ? "bg-destructive/20 text-destructive" 
                  : symptom.intensity >= 4 
                  ? "bg-secondary text-secondary-foreground" 
                  : "bg-primary/20 text-primary";

                return (
                  <div key={symptom.id} className="p-3 rounded-lg bg-muted">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground capitalize">{formattedDate}</p>
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", intensityColor)}>
                        Intensidade {symptom.intensity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{symptom.symptom_name}</p>
                    {symptom.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{symptom.notes}</p>
                    )}
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
