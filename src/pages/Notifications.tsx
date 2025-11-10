import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Pill, Heart, FileText, CheckCheck, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const iconMap: Record<string, any> = {
  medication: Pill,
  cycle: Calendar,
  article: FileText,
  reminder: Heart,
};

const colorMap: Record<string, string> = {
  medication: "text-accent",
  cycle: "text-primary",
  article: "text-secondary-dark",
  reminder: "text-destructive",
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Erro ao carregar notificações");
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      toast.error("Erro ao marcar notificações como lidas");
    } else {
      toast.success("Todas as notificações marcadas como lidas");
      fetchNotifications();
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir notificação");
    } else {
      toast.success("Notificação excluída");
      fetchNotifications();
    }
  };

  const deleteAllNotifications = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      toast.error("Erro ao limpar notificações");
    } else {
      toast.success("Todas as notificações foram excluídas");
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Notificações" showBack />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-2">
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} {unreadCount === 1 ? "não lida" : "não lidas"}
            </p>
          )}
          <div className="flex gap-2 ml-auto">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-primary" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar como lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="text-destructive" onClick={deleteAllNotifications}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar tudo
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-soft border-border animate-pulse">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type] || Bell;
              const color = colorMap[notification.type] || "text-muted-foreground";
              const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: ptBR,
              });

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "shadow-soft border-border transition-all hover:shadow-medium relative",
                    !notification.read && "bg-primary-light/10 border-primary/30"
                  )}
                >
                  <CardContent className="pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/20"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>

                    <div className="flex items-start gap-4 pr-8">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        !notification.read ? "bg-primary/20" : "bg-muted"
                      )}>
                        <Icon className={cn("w-5 h-5", color)} />
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
                          {timeAgo}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
