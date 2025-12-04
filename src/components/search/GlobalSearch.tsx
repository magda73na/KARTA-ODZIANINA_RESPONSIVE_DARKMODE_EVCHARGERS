import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Zap, Ticket, MapPin, FileText, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  category: 'stacje' | 'bilety' | 'usługi' | 'informacje';
  icon: React.ElementType;
}

// Dane do wyszukiwania - mogą być rozszerzone o dane z API
const searchableContent: SearchResult[] = [
  // Stacje EV
  { id: 's1', title: 'Mapa ładowarek EV', description: 'Interaktywna mapa stacji ładowania', href: '/ev/mapa', category: 'stacje', icon: MapPin },
  { id: 's2', title: 'Lista stacji ładowania', description: 'Wszystkie stacje w Łodzi', href: '/ev/lista', category: 'stacje', icon: Zap },
  { id: 's3', title: 'Porównanie cen ładowania', description: 'Porównaj ceny ładowania EV', href: '/ev/ceny', category: 'stacje', icon: Zap },
  { id: 's4', title: 'Ulubione stacje', description: 'Twoje zapisane stacje', href: '/ev/ulubione', category: 'stacje', icon: Zap },
  { id: 's5', title: 'Historia ładowania', description: 'Historia sesji ładowania', href: '/ev/historia', category: 'stacje', icon: Zap },
  { id: 's6', title: 'Planowanie trasy', description: 'Zaplanuj trasę z ładowaniem', href: '/ev/trasa', category: 'stacje', icon: MapPin },
  
  // Bilety
  { id: 'b1', title: 'Moje bilety', description: 'Zarządzaj biletami i wejściówkami', href: '/bilety', category: 'bilety', icon: Ticket },
  { id: 'b2', title: 'Historia biletów', description: 'Wykorzystane bilety', href: '/bilety', category: 'bilety', icon: Ticket },
  { id: 'b3', title: 'Zwrot biletu', description: 'Procedura zwrotu biletu', href: '/bilety', category: 'bilety', icon: Ticket },
  
  // Usługi Karty Łodzianina
  { id: 'u1', title: 'Karta i pakiety', description: 'Zarządzaj Kartą Łodzianina', href: '/karta', category: 'usługi', icon: CreditCard },
  { id: 'u2', title: 'Wejścia i zniżki', description: 'Dostępne zniżki i benefity', href: '/wejscia', category: 'usługi', icon: Ticket },
  { id: 'u3', title: 'Profil użytkownika', description: 'Ustawienia konta', href: '/profil', category: 'usługi', icon: FileText },
  { id: 'u4', title: 'Faktury', description: 'Twoje dokumenty księgowe', href: '/faktury', category: 'usługi', icon: FileText },
  { id: 'u5', title: 'Zgłoszenia', description: 'Status zgłoszeń serwisowych', href: '/zgloszenia', category: 'usługi', icon: FileText },
  { id: 'u6', title: 'Ekoharmonogram', description: 'Harmonogram odbioru odpadów', href: '/ekoharmonogram', category: 'informacje', icon: FileText },
  
  // Informacje
  { id: 'i1', title: 'Strona główna', description: 'Wróć do strony głównej', href: '/', category: 'informacje', icon: MapPin },
  { id: 'i2', title: 'Aktualności', description: 'Najnowsze informacje', href: '/#news', category: 'informacje', icon: FileText },
  { id: 'i3', title: 'FAQ', description: 'Najczęściej zadawane pytania', href: '/#faq', category: 'informacje', icon: FileText },
  { id: 'i4', title: 'Punkty obsługi', description: 'Lokalizacje punktów obsługi', href: '/#service', category: 'informacje', icon: MapPin },
];

const getCategoryLabel = (category: SearchResult['category']) => {
  switch (category) {
    case 'stacje': return 'Ładowarki EV';
    case 'bilety': return 'Bilety';
    case 'usługi': return 'Usługi';
    case 'informacje': return 'Informacje';
  }
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Wyszukiwanie
  const performSearch = useCallback((searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const filtered = searchableContent.filter(item => 
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      getCategoryLabel(item.category).toLowerCase().includes(normalizedQuery)
    );

    setResults(filtered.slice(0, 8));
    setSelectedIndex(-1);
  }, []);

  // Debounce wyszukiwania
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Zamknij dropdown po kliknięciu na zewnątrz
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obsługa klawiatury
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelectResult(results[0]);
      }
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    setResults([]);
    navigate(result.href);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const toggleMobileSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop Search */}
      <div className="hidden md:block">
        <form 
          role="search" 
          aria-label="Wyszukaj w serwisie"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative">
            <label htmlFor="desktop-search" className="sr-only">Szukaj</label>
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-4 md:w-4 text-muted-foreground pointer-events-none" 
              aria-hidden="true" 
            />
            <Input
              ref={inputRef}
              id="desktop-search"
              type="search"
              placeholder="Szukaj stacji, biletów..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className="h-9 md:h-10 w-44 md:w-48 lg:w-64 pl-9 pr-8 text-sm bg-muted/50 border-transparent focus:border-border focus:bg-background transition-all focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={isOpen && results.length > 0}
              aria-controls="search-results"
              aria-autocomplete="list"
              autoComplete="off"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={handleClear}
                aria-label="Wyczyść wyszukiwanie"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Mobile Search Toggle */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 min-h-[44px] min-w-[44px] touch-manipulation"
          onClick={toggleMobileSearch}
          aria-label={isOpen ? "Zamknij wyszukiwanie" : "Otwórz wyszukiwanie"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile Search Overlay - pełnoekranowe */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[56px] p-3 bg-background border-b border-border shadow-lg z-[60]">
          <form 
            role="search" 
            aria-label="Wyszukaj w serwisie"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative max-w-lg mx-auto">
              <label htmlFor="mobile-search" className="sr-only">Szukaj</label>
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
                aria-hidden="true" 
              />
              <Input
                ref={inputRef}
                id="mobile-search"
                type="search"
                placeholder="Szukaj stacji, biletów..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-11 sm:h-12 w-full pl-10 pr-10 text-base focus-visible:ring-2 focus-visible:ring-ring"
                aria-expanded={results.length > 0}
                aria-controls="mobile-search-results"
                aria-autocomplete="list"
                autoComplete="off"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 min-h-[36px] min-w-[36px]"
                  onClick={handleClear}
                  aria-label="Wyczyść wyszukiwanie"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </form>

          {/* Mobile Results */}
          {results.length > 0 && (
            <ul
              id="mobile-search-results"
              role="listbox"
              aria-label="Wyniki wyszukiwania"
              className="mt-2 max-h-[60vh] overflow-y-auto divide-y divide-border max-w-lg mx-auto"
            >
              {results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <li
                    key={result.id}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectResult(result)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors focus-visible:bg-muted/50 focus-visible:outline-none touch-manipulation min-h-[48px]",
                        index === selectedIndex && "bg-muted/50"
                      )}
                    >
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block">{getCategoryLabel(result.category)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {query.length >= 2 && results.length === 0 && (
            <p className="mt-2 p-3 text-sm text-muted-foreground text-center" role="status">
              Brak wyników dla „{query}"
            </p>
          )}
        </div>
      )}

      {/* Desktop Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="hidden md:block absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <ul
            id="search-results"
            role="listbox"
            aria-label="Wyniki wyszukiwania"
            className="max-h-80 overflow-y-auto"
          >
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <li
                  key={result.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors focus-visible:bg-muted/50 focus-visible:outline-none border-b border-border last:border-0",
                      index === selectedIndex && "bg-muted/50"
                    )}
                  >
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 md:h-4 md:w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      {getCategoryLabel(result.category)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Desktop No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="hidden md:block absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-muted-foreground text-center" role="status">
            Brak wyników dla „{query}"
          </p>
        </div>
      )}
    </div>
  );
}
