import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Pill, Heart, FileText, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "medication",
    icon: Pill,
    title: "Hora do seu medicamento",
    message: "Ibuprofeno 600mg - 16:00",
    time: "Há 5 minutos",
    read: false,
    color: "text-accent",
  },
  {
    id: 2,
    type: "cycle",
    icon: Calendar,
    title: "Previsão do ciclo",
    message: "Sua próxima menstruação está prevista para daqui 7 dias",
    time: "Há 2 horas",
    read: false,
    color: "text-primary",
  },
  {
    id: 3,
    type: "article",
    icon: FileText,
    title: "Novo artigo disponível",
    message: "Técnicas de Gerenciamento da Dor",
    time: "Há 5 horas",
    read: true,
    color: "text-secondary-dark",
  },
  {
    id: 4,
    type: "reminder",
    icon: Heart,
    title: "Lembrete de registro",
    message: "Não esqueça de registrar como você se sentiu hoje",
    time: "Ontem",
    read: true,
    color: "text-destructive",
  },
  {
    id: 5,
    type: "medication",
    icon: Pill,
    title: "Medicamento tomado",
    message: "Vitamina D registrada às 08:15",
    time: "Ontem",
    read: true,
    color: "text-accent",
  },
];

export default function Notifications() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Notificações" showBack />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Header Actions */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Você tem {unreadCount} {unreadCount === 1 ? "notificação não lida" : "notificações não lidas"}
            </p>
            <Button variant="ghost" size="sm" className="text-primary">
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card
                key={notification.id}
                className={cn(
                  "shadow-soft border-border transition-all hover:shadow-medium",
                  !notification.read && "bg-primary-light/10 border-primary/30"
                )}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      !notification.read ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Icon className={cn("w-5 h-5", notification.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={cn(
                          "text-sm font-semibold",
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <Card className="shadow-soft border-border">
            <CardContent className="py-16 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Você não tem notificações no momento
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
