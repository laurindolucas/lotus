import { ArrowLeft, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
  className?: string;
  logo?: string;
}

export const Header = ({ 
  title, 
  showBack = false, 
  showSettings = false,
  showNotifications = false,
  className,
  logo
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={cn("bg-card border-b border-border shadow-soft sticky top-0 z-40", className)}>
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          {logo ? (
            <img src={logo} alt={title} className="h-12 object-contain" />
          ) : (
            <h1 className="text-xl font-semibold text-foreground truncate">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/notifications")}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-crisis rounded-full" />
            </Button>
          )}
          {showSettings && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
