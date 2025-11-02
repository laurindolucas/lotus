import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CrisisButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="crisis"
      size="icon"
      onClick={() => navigate("/crisis")}
      className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full shadow-glow"
      aria-label="Modo de Crise"
    >
      <AlertCircle className="w-8 h-8" />
    </Button>
  );
};
