import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NotificationButtonProps {
  stationId: string;
  stationName: string;
  isSubscribed: boolean;
  onSubscribe: (stationId: string, stationName: string) => Promise<boolean>;
  onUnsubscribe: (stationId: string) => void;
  permission: NotificationPermission;
  isSupported: boolean;
}

export function NotificationButton({
  stationId,
  stationName,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  permission,
  isSupported,
}: NotificationButtonProps) {
  const { toast } = useToast();

  const handleClick = async () => {
    if (!isSupported) {
      toast({
        title: "Nie wspierane",
        description: "Twoja przeglądarka nie obsługuje powiadomień push",
        variant: "destructive",
      });
      return;
    }

    if (isSubscribed) {
      onUnsubscribe(stationId);
      toast({
        title: "Anulowano subskrypcję",
        description: `Nie będziesz już otrzymywać powiadomień o ${stationName}`,
      });
    } else {
      const success = await onSubscribe(stationId, stationName);
      if (success) {
        toast({
          title: "Subskrypcja aktywna",
          description: `Powiadomimy Cię gdy ${stationName} będzie dostępna`,
        });
      } else if (permission === 'denied') {
        toast({
          title: "Brak uprawnień",
          description: "Włącz powiadomienia w ustawieniach przeglądarki",
          variant: "destructive",
        });
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isSubscribed ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-10 w-10 touch-manipulation",
            isSubscribed && "bg-primary"
          )}
          onClick={handleClick}
        >
          {isSubscribed ? (
            <BellRing className="h-4 w-4" />
          ) : permission === 'denied' ? (
            <BellOff className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isSubscribed 
          ? "Anuluj powiadomienia" 
          : permission === 'denied'
          ? "Powiadomienia zablokowane"
          : "Powiadom gdy dostępna"}
      </TooltipContent>
    </Tooltip>
  );
}
