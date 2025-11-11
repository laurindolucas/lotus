import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface WeekCalendarProps {
  selectedDate?: Date;
  onDateClick?: (date: Date) => void;
}

export const WeekCalendar = ({ selectedDate = new Date(), onDateClick }: WeekCalendarProps) => {
  const startDate = startOfWeek(selectedDate, { locale: ptBR });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const today = new Date();

  return (
    <div className="flex gap-1 sm:gap-2 justify-between w-full">
      {weekDays.map((day, index) => {
        const isToday = isSameDay(day, today);
        const isSelected = isSameDay(day, selectedDate);
        
        return (
          <button
            key={index}
            onClick={() => onDateClick?.(day)}
            className={cn(
              "flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg transition-all flex-1 min-w-0",
              isToday && !isSelected && "bg-primary/10 text-primary",
              isSelected && "bg-gradient-primary text-primary-foreground shadow-soft",
              !isToday && !isSelected && "hover:bg-muted"
            )}
          >
            <span className="text-[10px] sm:text-xs font-medium uppercase">
              {format(day, "EEE", { locale: ptBR }).slice(0, 3)}
            </span>
            <span className={cn(
              "text-sm sm:text-lg font-semibold",
              isToday && !isSelected && "text-primary",
              isSelected && "text-primary-foreground"
            )}>
              {format(day, "d")}
            </span>
          </button>
        );
      })}
    </div>
  );
};
