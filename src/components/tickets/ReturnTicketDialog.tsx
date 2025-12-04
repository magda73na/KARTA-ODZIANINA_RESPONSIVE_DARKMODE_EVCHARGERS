import { useState } from "react";
import { RotateCcw, AlertTriangle, Check, Loader2, Ticket, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TicketType {
  id: string;
  name: string;
  date: string;
  price: number;
  type: string;
}

// Mock data - in production this would come from API
const mockTickets: TicketType[] = [
  { id: "t1", name: "Bilet jednorazowy MPK", date: "2025-12-05", price: 4.60, type: "komunikacja" },
  { id: "t2", name: "Bilet 24h MPK", date: "2025-12-04", price: 15.00, type: "komunikacja" },
  { id: "t3", name: "Wstęp do Muzeum Sztuki", date: "2025-12-10", price: 25.00, type: "kultura" },
  { id: "t4", name: "Basen Fala - wejście 2h", date: "2025-12-08", price: 32.00, type: "sport" },
];

interface ReturnTicketDialogProps {
  onReturn?: (ticketId: string) => Promise<void>;
}

export function ReturnTicketDialog({ onReturn }: ReturnTicketDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [returnStatus, setReturnStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const selectedTicketData = mockTickets.find(t => t.id === selectedTicket);

  const handleReturnConfirm = async () => {
    if (!selectedTicket) return;
    
    setIsLoading(true);
    setShowConfirm(false);
    
    try {
      // Simulate API call
      if (onReturn) {
        await onReturn(selectedTicket);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setReturnStatus('success');
      toast({
        title: "Bilet zwrócony",
        description: `Bilet "${selectedTicketData?.name}" został pomyślnie zwrócony. Środki zostaną zwrócone w ciągu 3-5 dni roboczych.`,
      });
      
      setTimeout(() => {
        setIsOpen(false);
        setReturnStatus('idle');
        setSelectedTicket(null);
      }, 2000);
      
    } catch (error) {
      setReturnStatus('error');
      toast({
        title: "Błąd zwrotu",
        description: "Nie udało się zwrócić biletu. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedTicket(null);
      setReturnStatus('idle');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'komunikacja': return '🚌';
      case 'kultura': return '🎭';
      case 'sport': return '🏊';
      default: return '🎫';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 min-h-[48px] w-full sm:w-auto touch-manipulation"
            aria-label="Otwórz formularz zwrotu biletu"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Zwróć bilet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" aria-hidden="true" />
              Zwróć bilet
            </DialogTitle>
            <DialogDescription>
              Wybierz bilet, który chcesz zwrócić. Środki zostaną zwrócone na konto w ciągu 3-5 dni roboczych.
            </DialogDescription>
          </DialogHeader>

          {returnStatus === 'success' ? (
            <div 
              className="flex flex-col items-center justify-center py-8 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Bilet zwrócony!</h3>
              <p className="text-muted-foreground text-sm">
                Twój bilet został pomyślnie zwrócony.
              </p>
            </div>
          ) : returnStatus === 'error' ? (
            <div 
              className="flex flex-col items-center justify-center py-8 text-center"
              role="alert"
              aria-live="assertive"
            >
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Błąd zwrotu</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nie udało się zwrócić biletu. Spróbuj ponownie.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setReturnStatus('idle')}
                className="min-h-[44px]"
              >
                Spróbuj ponownie
              </Button>
            </div>
          ) : (
            <>
              {mockTickets.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p>Nie masz biletów do zwrotu.</p>
                </div>
              ) : (
                <RadioGroup 
                  value={selectedTicket || ""} 
                  onValueChange={setSelectedTicket}
                  className="space-y-3"
                  aria-label="Lista biletów do zwrotu"
                >
                  {mockTickets.map((ticket) => (
                    <div key={ticket.id}>
                      <RadioGroupItem
                        value={ticket.id}
                        id={ticket.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={ticket.id}
                        className={cn(
                          "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all",
                          "hover:bg-muted/50 peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                          selectedTicket === ticket.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border"
                        )}
                      >
                        <span className="text-2xl" aria-hidden="true">{getTypeIcon(ticket.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{ticket.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" aria-hidden="true" />
                            <span>{new Date(ticket.date).toLocaleDateString('pl-PL')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                          <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                          {ticket.price.toFixed(2)} zł
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="min-h-[48px] w-full sm:w-auto"
                >
                  Anuluj
                </Button>
                <Button 
                  onClick={() => setShowConfirm(true)}
                  disabled={!selectedTicket || isLoading}
                  className="min-h-[48px] w-full sm:w-auto gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Zwróć wybrany bilet
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
              Potwierdź zwrot biletu
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Czy na pewno chcesz zwrócić ten bilet?</p>
                {selectedTicketData && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">{selectedTicketData.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Data: {new Date(selectedTicketData.date).toLocaleDateString('pl-PL')}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      Kwota zwrotu: {selectedTicketData.price.toFixed(2)} zł
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Ta operacja jest nieodwracalna. Środki zostaną zwrócone w ciągu 3-5 dni roboczych.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="min-h-[48px]">Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReturnConfirm}
              className="min-h-[48px] bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Potwierdź zwrot
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}