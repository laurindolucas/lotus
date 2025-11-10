import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfessionalDetailModal } from "@/components/Professional/ProfessionalDetailModal";
import { BookingModal } from "@/components/Professional/BookingModal";

const specialties = ["Todos", "Ginecologista", "Nutricionista", "Fisioterapeuta", "Psicóloga"];

export default function Professionals() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    const { data, error } = await (supabase as any)
      .from("professionals")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Erro ao carregar profissionais");
    } else {
      setProfessionals(data || []);
    }
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSpecialty = selectedSpecialty === "Todos" || prof.specialty === selectedSpecialty;
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleContactClick = (prof: any) => {
    setSelectedProfessional(prof);
    setIsDetailModalOpen(true);
  };

  const handleScheduleClick = (prof: any) => {
    setSelectedProfessional(prof);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Rede de Profissionais" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar profissionais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedSpecialty === specialty
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              )}
            >
              {specialty}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredProfessionals.map((prof) => (
            <Card key={prof.id} className="shadow-soft border-border hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {prof.name}
                    </h3>
                    <Badge variant="secondary" className="mb-2">
                      {prof.specialty}
                    </Badge>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {prof.phone && `Tel: ${prof.phone}`}
                      {prof.email && ` • ${prof.email}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleScheduleClick(prof)}
                  >
                    Agendar Encontro
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContactClick(prof)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <ProfessionalDetailModal
        professional={selectedProfessional}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSchedule={() => {
          setIsDetailModalOpen(false);
          setIsBookingModalOpen(true);
        }}
      />

      <BookingModal
        professional={selectedProfessional}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={fetchProfessionals}
      />

      <BottomNav />
    </div>
  );
}
