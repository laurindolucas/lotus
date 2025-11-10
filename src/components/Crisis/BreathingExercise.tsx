import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";

const phases = [
  { name: "Inspire", duration: 4, instruction: "Inspire profundamente pelo nariz" },
  { name: "Segure", duration: 4, instruction: "Segure o ar" },
  { name: "Expire", duration: 6, instruction: "Expire lentamente pela boca" },
  { name: "Pausa", duration: 2, instruction: "Descanse" },
];

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [countdown, setCountdown] = useState(phases[0].duration);
  const [cycle, setCycle] = useState(0);
  const totalCycles = 5;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const nextPhase = (currentPhase + 1) % phases.length;
          
          if (nextPhase === 0) {
            const nextCycle = cycle + 1;
            if (nextCycle >= totalCycles) {
              setIsActive(false);
              setCycle(0);
              return phases[0].duration;
            }
            setCycle(nextCycle);
          }
          
          setCurrentPhase(nextPhase);
          return phases[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, cycle]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase(0);
    setCountdown(phases[0].duration);
    setCycle(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setCountdown(phases[0].duration);
    setCycle(0);
  };

  return (
    <Card className="shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-accent" />
          Exercício de Respiração
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div className="w-48 h-48 mx-auto relative">
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-1000",
                isActive ? "bg-gradient-wellness shadow-glow" : "bg-muted"
              )}
              style={{
                transform: isActive
                  ? `scale(${currentPhase === 0 ? 1.2 : currentPhase === 2 ? 0.8 : 1})`
                  : "scale(1)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-foreground">{countdown}</p>
              <p className="text-sm text-muted-foreground">segundos</p>
            </div>
          </div>
        </div>

        {isActive && (
          <div className="text-center space-y-2 animate-fade-in">
            <p className="text-xl font-semibold text-foreground">
              {phases[currentPhase].name}
            </p>
            <p className="text-sm text-muted-foreground">
              {phases[currentPhase].instruction}
            </p>
            <p className="text-xs text-muted-foreground">
              Ciclo {cycle + 1} de {totalCycles}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {!isActive ? (
            <Button onClick={handleStart} className="w-full">
              Começar Exercício
            </Button>
          ) : (
            <Button onClick={handleStop} variant="outline" className="w-full">
              Parar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
