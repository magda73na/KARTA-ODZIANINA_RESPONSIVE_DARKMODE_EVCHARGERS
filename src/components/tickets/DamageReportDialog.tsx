import { useState } from "react";
import { AlertCircle, Send, Loader2, Check, FileWarning, Calendar, Mail, Phone, Ticket } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductType {
  id: string;
  name: string;
  type: string;
}

// Mock data
const mockProducts: ProductType[] = [
  { id: "p1", name: "Bilet jednorazowy MPK", type: "komunikacja" },
  { id: "p2", name: "Bilet 24h MPK", type: "komunikacja" },
  { id: "p3", name: "Wstęp do Muzeum Sztuki", type: "kultura" },
  { id: "p4", name: "Basen Fala - wejście 2h", type: "sport" },
  { id: "p5", name: "Karta Łodzianina - pakiet podstawowy", type: "karta" },
];

interface FormData {
  productId: string;
  description: string;
  date: string;
  time: string;
  email: string;
  phone: string;
  consent: boolean;
}

interface FormErrors {
  productId?: string;
  description?: string;
  date?: string;
  email?: string;
  consent?: string;
}

interface DamageReportDialogProps {
  onSubmit?: (data: FormData) => Promise<{ caseNumber: string }>;
}

export function DamageReportDialog({ onSubmit }: DamageReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');
  const [caseNumber, setCaseNumber] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    productId: "",
    description: "",
    date: "",
    time: "",
    email: "",
    phone: "",
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.productId) {
      newErrors.productId = "Wybierz produkt";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Opis zdarzenia jest wymagany";
    } else if (formData.description.length < 20) {
      newErrors.description = "Opis musi mieć co najmniej 20 znaków";
    }

    if (!formData.date) {
      newErrors.date = "Data zdarzenia jest wymagana";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Nieprawidłowy format adresu email";
    }

    if (!formData.consent) {
      newErrors.consent = "Wymagana zgoda na przetwarzanie danych";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let result: { caseNumber: string };
      
      if (onSubmit) {
        result = await onSubmit(formData);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = { caseNumber: `ZGL-${Date.now().toString(36).toUpperCase()}` };
      }

      setCaseNumber(result.caseNumber);
      setSubmitStatus('success');
      
      toast({
        title: "Zgłoszenie przyjęte",
        description: `Numer sprawy: ${result.caseNumber}`,
      });

    } catch (error) {
      toast({
        title: "Błąd wysyłania",
        description: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form
      setFormData({
        productId: "",
        description: "",
        date: "",
        time: "",
        email: "",
        phone: "",
        consent: false,
      });
      setErrors({});
      setSubmitStatus('idle');
      setCaseNumber("");
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 min-h-[48px] w-full sm:w-auto touch-manipulation border-destructive/50 text-destructive hover:bg-destructive/10"
          aria-label="Otwórz formularz zgłoszenia szkody"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          Zgłoś szkodę
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-destructive" aria-hidden="true" />
            Zgłoś szkodę
          </DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby zgłosić szkodę związaną z zakupionym produktem lub usługą.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div 
            className="flex flex-col items-center justify-center py-8 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Zgłoszenie przyjęte!</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Twoje zgłoszenie zostało zarejestrowane.
            </p>
            <div className="p-4 bg-muted rounded-lg w-full">
              <p className="text-sm text-muted-foreground">Numer sprawy:</p>
              <p className="text-xl font-bold text-primary">{caseNumber}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Zachowaj ten numer - pomoże nam szybciej obsłużyć Twoje zgłoszenie.
            </p>
            <Button 
              onClick={() => setIsOpen(false)} 
              className="mt-4 min-h-[48px]"
            >
              Zamknij
            </Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product" className="flex items-center gap-1">
                <Ticket className="h-4 w-4" aria-hidden="true" />
                Produkt / Usługa <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.productId} 
                onValueChange={(v) => updateField('productId', v)}
              >
                <SelectTrigger 
                  id="product"
                  className={cn("min-h-[48px]", errors.productId && "border-destructive")}
                  aria-invalid={!!errors.productId}
                  aria-describedby={errors.productId ? "product-error" : undefined}
                >
                  <SelectValue placeholder="Wybierz produkt" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productId && (
                <p id="product-error" className="text-sm text-destructive" role="alert">
                  {errors.productId}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Opis zdarzenia <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Opisz szczegółowo, co się wydarzyło..."
                className={cn("min-h-[120px]", errors.description && "border-destructive")}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "description-error" : "description-hint"}
              />
              <p id="description-hint" className="text-xs text-muted-foreground">
                Minimum 20 znaków. Podaj jak najwięcej szczegółów.
              </p>
              {errors.description && (
                <p id="description-error" className="text-sm text-destructive" role="alert">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Data zdarzenia <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={cn("min-h-[48px]", errors.date && "border-destructive")}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? "date-error" : undefined}
                />
                {errors.date && (
                  <p id="date-error" className="text-sm text-destructive" role="alert">
                    {errors.date}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Godzina (opcjonalnie)</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  className="min-h-[48px]"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  E-mail (opcjonalnie)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="jan@example.com"
                  className={cn("min-h-[48px]", errors.email && "border-destructive")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Telefon (opcjonalnie)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+48 123 456 789"
                  className="min-h-[48px]"
                />
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => updateField('consent', !!checked)}
                  className="mt-1"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                />
                <Label 
                  htmlFor="consent" 
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  Wyrażam zgodę na przetwarzanie moich danych osobowych w celu rozpatrzenia zgłoszenia szkody zgodnie z polityką prywatności. <span className="text-destructive">*</span>
                </Label>
              </div>
              {errors.consent && (
                <p id="consent-error" className="text-sm text-destructive" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="min-h-[48px] w-full sm:w-auto"
                disabled={isLoading}
              >
                Anuluj
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="min-h-[48px] w-full sm:w-auto gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                Wyślij zgłoszenie
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}