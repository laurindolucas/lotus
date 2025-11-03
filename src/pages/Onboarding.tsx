import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users, FileHeart, Shield } from "lucide-react";

const slides = [
  {
    icon: Heart,
    title: "Bem-vinda ao LOTUS",
    description: "Uma plataforma dedicada ao seu bem-estar e cuidado integral. Estamos aqui para apoiar você em cada etapa da sua jornada com endometriose.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Calendar,
    title: "Acompanhe Seu Ciclo",
    description: "Registre seu ciclo menstrual e sintomas para entender melhor seu corpo e compartilhar informações precisas com profissionais.",
    gradient: "from-secondary to-secondary-dark",
  },
  {
    icon: Users,
    title: "Encontre Especialistas",
    description: "Acesse uma rede de profissionais especializados em endometriose prontos para ajudar você com cuidado e compreensão.",
    gradient: "from-accent to-accent-soft",
  },
  {
    icon: FileHeart,
    title: "Informação de Qualidade",
    description: "Artigos confiáveis e atualizados sobre sintomas, tratamentos e bem-estar para você se sentir mais informada e empoderada.",
    gradient: "from-primary-light to-primary",
  },
  {
    icon: Shield,
    title: "Você Não Está Sozinha",
    description: "Em momentos difíceis, temos um modo de crise com orientações rápidas e acesso a suporte. Sua saúde e bem-estar são nossa prioridade.",
    gradient: "from-crisis to-accent",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      navigate("/dashboard");
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
        <div className={`w-32 h-32 mb-8 rounded-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-glow animate-scale-in`}>
          <Icon className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-4 text-foreground">
          {slide.title}
        </h1>

        <p className="text-center text-muted-foreground max-w-md mb-12 text-lg leading-relaxed">
          {slide.description}
        </p>

        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-3">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full"
        >
          {isLastSlide ? "Começar" : "Próximo"}
        </Button>
        
        {!isLastSlide && (
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Pular Introdução
          </Button>
        )}
      </div>
    </div>
  );
}
