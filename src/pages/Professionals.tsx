import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { CrisisButton } from "@/components/Layout/CrisisButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Mail, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const specialties = ["Todos", "Ginecologista", "Nutricionista", "Fisioterapeuta", "Psicólogo"];

const professionals = [
  {
    id: 1,
    name: "Dra. Ana Silva",
    specialty: "Ginecologista",
    location: "São Paulo, SP",
    rating: 4.9,
    phone: "(11) 98765-4321",
    email: "ana.silva@exemplo.com",
    experience: "15 anos de experiência em endometriose",
    isFavorite: true,
  },
  {
    id: 2,
    name: "Dra. Mariana Costa",
    specialty: "Nutricionista",
    location: "São Paulo, SP",
    rating: 4.8,
    phone: "(11) 98765-1234",
    email: "mariana.costa@exemplo.com",
    experience: "Especialista em dieta anti-inflamatória",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Dr. Pedro Santos",
    specialty: "Fisioterapeuta",
    location: "Rio de Janeiro, RJ",
    rating: 4.7,
    phone: "(21) 98765-5678",
    email: "pedro.santos@exemplo.com",
    experience: "Tratamento de dor pélvica crônica",
    isFavorite: true,
  },
  {
    id: 4,
    name: "Dra. Julia Mendes",
    specialty: "Psicólogo",
    location: "Belo Horizonte, MG",
    rating: 4.9,
    phone: "(31) 98765-9012",
    email: "julia.mendes@exemplo.com",
    experience: "Apoio psicológico em doenças crônicas",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Dra. Carolina Oliveira",
    specialty: "Ginecologista",
    location: "Curitiba, PR",
    rating: 4.8,
    phone: "(41) 98765-3456",
    email: "carolina.oliveira@exemplo.com",
    experience: "Cirurgia minimamente invasiva",
    isFavorite: false,
  },
];

export default function Professionals() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 3]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSpecialty = selectedSpecialty === "Todos" || prof.specialty === selectedSpecialty;
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Rede de Profissionais" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Search */}
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

        {/* Specialty Filters */}
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

        {/* Professionals List */}
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
                    <p className="text-sm text-muted-foreground mb-2">{prof.experience}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {prof.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-accent" />
                        {prof.rating}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(prof.id)}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-colors",
                        favorites.includes(prof.id)
                          ? "fill-destructive text-destructive"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <Card className="shadow-soft border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum profissional encontrado com esses critérios.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <CrisisButton />
      <BottomNav />
    </div>
  );
}
