import { Zap, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality
  };

  return (
    <section 
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 sm:py-12 md:py-16 lg:py-24"
    >
      {/* Background decoration - hidden from screen readers */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative px-3 sm:px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary/10 text-primary px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-6"
            role="status"
            aria-label="Aktualny status sieci"
          >
            <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 flex-shrink-0" aria-hidden="true" />
            <span>Sieć Ładowania EV w Łodzi</span>
          </div>

          {/* Heading */}
          <h1 
            id="hero-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-3 sm:mb-6 leading-tight"
          >
            Znajdź{" "}
            <span className="text-primary">Najbliższą</span>{" "}
            Stację Ładowania
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-5 sm:mb-8 max-w-2xl px-2">
            Odkryj 50+ punktów ładowania w całej Łodzi. Dostępność w czasie rzeczywistym, 
            nawigacja i bezproblemowe ładowanie.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-xl px-2 sm:px-0"
            role="search"
            aria-label="Wyszukaj stacje ładowania"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <label htmlFor="location-search" className="sr-only">
                  Wpisz swoją lokalizację
                </label>
                <MapPin 
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" 
                  aria-hidden="true" 
                />
                <Input
                  id="location-search"
                  type="text"
                  placeholder="Wpisz swoją lokalizację..."
                  className="h-11 sm:h-12 md:h-12 pl-9 sm:pl-10 md:pl-11 text-sm sm:text-base rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-describedby="search-hint"
                />
              </div>
              <Button 
                type="submit"
                className="h-11 sm:h-12 md:h-12 px-5 sm:px-6 md:px-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-w-[100px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-1.5 sm:gap-2"
              >
                <Search className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" aria-hidden="true" />
                Szukaj
              </Button>
            </div>
            <p id="search-hint" className="sr-only">
              Wpisz nazwę ulicy, dzielnicy lub adres, aby znaleźć najbliższe stacje ładowania
            </p>
          </form>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mt-6 sm:mt-10 md:mt-12 w-full max-w-md"
            role="list"
            aria-label="Statystyki sieci ładowania"
          >
            <div className="text-center" role="listitem">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary" aria-hidden="true">50+</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1">Stacji</p>
              <span className="sr-only">Ponad 50 stacji ładowania</span>
            </div>
            <div className="text-center" role="listitem">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary" aria-hidden="true">24/7</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1">Dostępne</p>
              <span className="sr-only">Dostępne 24 godziny na dobę, 7 dni w tygodniu</span>
            </div>
            <div className="text-center" role="listitem">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary" aria-hidden="true">350kW</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1">Szybkie</p>
              <span className="sr-only">Do 350 kilowatów mocy ładowania</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
