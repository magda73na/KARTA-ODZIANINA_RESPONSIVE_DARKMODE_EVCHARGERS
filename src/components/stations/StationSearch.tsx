import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StationSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  isSearching?: boolean;
}

export function StationSearch({ 
  onSearch, 
  placeholder = "Szukaj stacji po nazwie, adresie lub operatorze...",
  className,
  isSearching = false
}: StationSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    onSearch("");
    inputRef.current?.focus();
  }, [onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <label htmlFor="station-search" className="sr-only">
        Wyszukaj stację ładowania
      </label>
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
          aria-hidden="true" 
        />
        <Input
          ref={inputRef}
          id="station-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 h-11 md:h-12 text-sm md:text-base",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "min-h-[44px]" // Touch target
          )}
          aria-label="Wyszukaj stację po nazwie, adresie lub operatorze"
          aria-describedby="search-hint"
          autoComplete="off"
        />
        {isSearching ? (
          <Loader2 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" 
            aria-hidden="true"
          />
        ) : query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 min-h-[32px] min-w-[32px] hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            onClick={handleClear}
            aria-label="Wyczyść wyszukiwanie"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <p id="search-hint" className="sr-only">
        Wpisz minimum 2 znaki, aby rozpocząć wyszukiwanie. Naciśnij Escape, aby wyczyścić.
      </p>
      {query && query.length > 0 && query.length < 2 && (
        <p className="text-xs text-muted-foreground mt-1 ml-1" role="status" aria-live="polite">
          Wpisz minimum 2 znaki
        </p>
      )}
    </div>
  );
}
