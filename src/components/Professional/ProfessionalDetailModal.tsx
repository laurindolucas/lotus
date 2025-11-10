import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Calendar, MapPin, DollarSign, ExternalLink } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  photo_url?: string;
  phone?: string;
  email?: string;
  price?: number;
  available_times?: any;
}

interface ProfessionalDetailModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: () => void;
}

export function ProfessionalDetailModal({ 
  professional, 
  isOpen, 
  onClose, 
  onSchedule 
}: ProfessionalDetailModalProps) {
  if (!professional) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Profissional</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Header with Avatar */}
          <div className="flex flex-col items-center gap-4 pb-4 border-b border-border">
            <Avatar className="w-24 h-24">
              <AvatarImage src={professional.photo_url} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {professional.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{professional.name}</h3>
              <p className="text-sm text-muted-foreground">{professional.specialty}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Informações de Contato</h4>
            
            {professional.phone && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm font-medium">{professional.phone}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => window.open(`tel:${professional.phone}`)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )}

            {professional.email && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm font-medium">{professional.email}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => window.open(`mailto:${professional.email}`)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )}

            {professional.price && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <DollarSign className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Valor da Consulta</p>
                  <p className="text-sm font-medium">
                    R$ {professional.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground">Sobre</h4>
            <p className="text-sm text-muted-foreground">
              {professional.specialty === "Ginecologista" && 
                "Especialista em saúde da mulher, com foco em diagnóstico e tratamento de endometriose."}
              {professional.specialty === "Fisioterapeuta" && 
                "Especialista em fisioterapia pélvica e tratamento de dores relacionadas à endometriose."}
              {professional.specialty === "Nutricionista" && 
                "Especialista em nutrição funcional e dietas anti-inflamatórias para manejo da endometriose."}
              {professional.specialty === "Psicóloga" && 
                "Especialista em saúde mental e apoio psicológico para pacientes com endometriose."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
            <Button onClick={() => { onSchedule(); onClose(); }} className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Consulta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
