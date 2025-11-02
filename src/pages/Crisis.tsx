import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, Wind, Headphones, Heart, Clock } from "lucide-react";

const emergencyContacts = [
  { name: "SAMU", number: "192", description: "Emergência médica" },
  { name: "Bombeiros", number: "193", description: "Emergências gerais" },
  { name: "Dr. Emergência", number: "(11) 98765-4321", description: "Seu médico de referência" },
];

const quickReliefTechniques = [
  {
    icon: Wind,
    title: "Respiração Profunda",
    description: "Inspire por 4 segundos, segure por 4, expire por 6. Repita 5 vezes.",
    action: "Começar Exercício",
  },
  {
    icon: Headphones,
    title: "Meditação Guiada",
    description: "Audio de 5 minutos para relaxamento e alívio da dor.",
    action: "Ouvir Áudio",
  },
  {
    icon: Heart,
    title: "Posições de Alívio",
    description: "Posições que podem ajudar a reduzir o desconforto pélvico.",
    action: "Ver Posições",
  },
];

export default function Crisis() {
  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Modo de Crise" showBack />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Alert Banner */}
        <Card className="shadow-medium border-crisis bg-crisis/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-crisis flex items-center justify-center shrink-0 animate-pulse-soft">
                <AlertCircle className="w-6 h-6 text-crisis-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-crisis mb-1">
                  Você não está sozinha
                </h2>
                <p className="text-sm text-crisis-foreground/80">
                  Estamos aqui para apoiar você. Se a dor for muito intensa ou você estiver em perigo, ligue para uma emergência.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-destructive" />
              Contatos de Emergência
            </CardTitle>
            <CardDescription>Ligue imediatamente se necessário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                className="w-full p-4 rounded-lg bg-muted hover:bg-destructive/10 transition-all text-left border-2 border-transparent hover:border-destructive group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-destructive transition-colors">
                      {contact.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-destructive">{contact.number}</span>
                    <Phone className="w-5 h-5 text-destructive" />
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Quick Relief Techniques */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Técnicas de Alívio Rápido
            </CardTitle>
            <CardDescription>Práticas que podem ajudar agora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickReliefTechniques.map((technique, index) => {
              const Icon = technique.icon;
              return (
                <div key={index} className="p-4 rounded-lg bg-gradient-wellness">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-accent-foreground mb-1">
                        {technique.title}
                      </h3>
                      <p className="text-sm text-accent-foreground/80">
                        {technique.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    {technique.action}
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Pain Log Quick Access */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Registrar Este Momento
            </CardTitle>
            <CardDescription>
              Registre seus sintomas para compartilhar com seu médico depois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/symptoms"}>
              Ir para Registro de Sintomas
            </Button>
          </CardContent>
        </Card>

        {/* Companion Access */}
        <Card className="shadow-soft border-border bg-secondary">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-secondary-foreground mb-2">
              Precisa de Apoio?
            </h3>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              Se você tem um acompanhante cadastrado, pode notificá-lo agora.
            </p>
            <Button variant="outline" className="w-full bg-white hover:bg-white/90">
              Notificar Acompanhante
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
