import { useState } from "react";
import { Filter, X, ArrowUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getAllConnectorTypes, getAllOperators } from "@/data/lodz-stations";
import { SortOption } from "@/data/lodz-stations";

export interface StationFiltersType {
  availability?: 'all' | 'available' | 'occupied';
  powerCategories?: ('ac' | 'fast' | 'ultra')[];
  connectorTypes?: string[];
  operator?: string;
  maxPrice?: number;
  onlyOpen?: boolean;
}

interface StationFiltersProps {
  filters: StationFiltersType;
  onFiltersChange: (filters: StationFiltersType) => void;
  activeFilterCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hasLocation: boolean;
}

const defaultFilters: StationFiltersType = {
  availability: 'all',
  powerCategories: ['ac', 'fast', 'ultra'],
  connectorTypes: [],
  operator: 'all',
  maxPrice: undefined,
  onlyOpen: false,
};

export function StationFilters({ 
  filters, 
  onFiltersChange, 
  activeFilterCount,
  sortBy,
  onSortChange,
  hasLocation
}: StationFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<StationFiltersType>(filters);
  const connectorTypes = getAllConnectorTypes();
  const operators = getAllOperators();

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const togglePowerCategory = (category: 'ac' | 'fast' | 'ultra') => {
    const current = localFilters.powerCategories || ['ac', 'fast', 'ultra'];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    setLocalFilters(p => ({ ...p, powerCategories: updated }));
  };

  const toggleConnectorType = (type: string) => {
    const current = localFilters.connectorTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setLocalFilters(p => ({ ...p, connectorTypes: updated }));
  };

  const sortOptions = [
    { value: 'distance', label: 'Odległość', disabled: !hasLocation },
    { value: 'availability', label: 'Dostępność' },
    { value: 'price', label: 'Cena' },
    { value: 'power', label: 'Moc' },
  ];

  const powerCategoryOptions = [
    { value: 'ac', label: 'AC (≤22 kW)' },
    { value: 'fast', label: 'Szybkie DC (23-49 kW)' },
    { value: 'ultra', label: 'Ultraszybkie (≥50 kW)' },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5" role="group" aria-label="Sortowanie i filtry">
      {/* Sort Dropdown */}
      <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger 
          className="h-9 sm:h-10 md:h-11 w-[120px] sm:w-[140px] md:w-[160px] text-xs sm:text-sm md:text-sm min-h-[36px] sm:min-h-[40px] md:min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Sortuj stacje"
        >
          <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
          <SelectValue placeholder="Sortuj" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              className="text-sm min-h-[40px]"
            >
              {option.label}
              {option.disabled && " (GPS)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filters Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="h-9 sm:h-10 md:h-11 gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-sm touch-manipulation min-h-[36px] sm:min-h-[40px] md:min-h-[44px] px-2.5 sm:px-3 md:px-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Otwórz filtry${activeFilterCount > 0 ? `, aktywne: ${activeFilterCount}` : ''}`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
          >
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Filtry</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-0.5 sm:ml-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs" aria-hidden="true">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="h-[85vh] rounded-t-xl"
          aria-label="Panel filtrów stacji"
        >
          <SheetHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>Filtry</SheetTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="min-h-[44px] gap-1.5 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Resetuj wszystkie filtry do wartości domyślnych"
              >
                <RotateCcw className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                Resetuj filtry
              </Button>
            </div>
          </SheetHeader>
          <div className="py-6 space-y-6 overflow-y-auto max-h-[55vh]" role="form" aria-label="Formularz filtrów">
            {/* Only Open */}
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="onlyOpen" 
                checked={localFilters.onlyOpen || false} 
                onCheckedChange={(c) => setLocalFilters(p => ({ ...p, onlyOpen: !!c }))}
                aria-describedby="onlyOpen-desc"
              />
              <div>
                <Label htmlFor="onlyOpen" className="text-sm font-medium cursor-pointer">
                  Tylko otwarte teraz
                </Label>
                <p id="onlyOpen-desc" className="text-xs text-muted-foreground">
                  Pokaż tylko stacje dostępne 24/7
                </p>
              </div>
            </div>

            {/* Power Categories - Checkboxes */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold">Moc ładowania (kW)</legend>
              <div className="space-y-2" role="group" aria-label="Kategorie mocy ładowania">
                {powerCategoryOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`power-${option.value}`}
                      checked={(localFilters.powerCategories || ['ac', 'fast', 'ultra']).includes(option.value as 'ac' | 'fast' | 'ultra')}
                      onCheckedChange={() => togglePowerCategory(option.value as 'ac' | 'fast' | 'ultra')}
                      aria-label={`Filtruj według mocy: ${option.label}`}
                    />
                    <Label htmlFor={`power-${option.value}`} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Connector Types - Multi-select list */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold" id="connector-types-label">Typ złącza</legend>
              <div 
                className="border rounded-md max-h-[140px] overflow-y-auto" 
                role="listbox" 
                aria-labelledby="connector-types-label"
                aria-multiselectable="true"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={(localFilters.connectorTypes || []).length === 0}
                  className={`px-3 py-2.5 w-full text-left min-h-[44px] cursor-pointer hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${(localFilters.connectorTypes || []).length === 0 ? 'bg-muted font-medium' : ''}`}
                  onClick={() => setLocalFilters(p => ({ ...p, connectorTypes: [] }))}
                >
                  Wszystkie
                </button>
                {connectorTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    role="option"
                    aria-selected={(localFilters.connectorTypes || []).includes(type)}
                    className={`px-3 py-2.5 w-full text-left min-h-[44px] cursor-pointer hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${(localFilters.connectorTypes || []).includes(type) ? 'bg-muted font-medium' : ''}`}
                    onClick={() => toggleConnectorType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Operator Dropdown */}
            <div className="space-y-3">
              <Label htmlFor="operator-select" className="text-sm font-semibold">Operator</Label>
              <Select 
                value={localFilters.operator || 'all'} 
                onValueChange={(v) => setLocalFilters(p => ({ ...p, operator: v }))}
              >
                <SelectTrigger id="operator-select" className="h-11 min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="min-h-[40px]">Wszyscy</SelectItem>
                  {operators.map((op) => <SelectItem key={op} value={op} className="min-h-[40px]">{op}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="price-slider" className="text-sm font-semibold">
                  Maksymalna cena za kWh
                </Label>
                <span className="text-sm font-medium text-primary">
                  {localFilters.maxPrice ? `${localFilters.maxPrice.toFixed(2)} zł` : 'Bez limitu'}
                </span>
              </div>
              <Slider
                id="price-slider"
                value={[localFilters.maxPrice || 5]}
                onValueChange={([value]) => setLocalFilters(p => ({ ...p, maxPrice: value >= 5 ? undefined : value }))}
                min={0.5}
                max={5}
                step={0.1}
                className="w-full"
                aria-label="Maksymalna cena za kWh"
                aria-valuemin={0.5}
                aria-valuemax={5}
                aria-valuenow={localFilters.maxPrice || 5}
                aria-valuetext={localFilters.maxPrice ? `${localFilters.maxPrice.toFixed(2)} złotych za kWh` : 'Bez limitu'}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0,50 zł</span>
                <span>2,50 zł</span>
                <span>Bez limitu</span>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-3">
              <Label htmlFor="availability-select" className="text-sm font-semibold">Dostępność</Label>
              <Select 
                value={localFilters.availability || 'all'} 
                onValueChange={(v) => setLocalFilters(p => ({ ...p, availability: v as StationFiltersType['availability'] }))}
              >
                <SelectTrigger id="availability-select" className="h-11 min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="min-h-[40px]">Wszystkie stacje</SelectItem>
                  <SelectItem value="available" className="min-h-[40px]">Dostępne teraz</SelectItem>
                  <SelectItem value="occupied" className="min-h-[40px]">W pełni zajęte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="pt-4 border-t">
            <Button 
              className="w-full h-11 min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring" 
              onClick={handleApply}
              aria-label="Zastosuj wybrane filtry"
            >
              Zastosuj Filtry
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function QuickFilters({ filters, onFiltersChange }: { filters: StationFiltersType; onFiltersChange: (f: StationFiltersType) => void }) {
  const togglePowerCategory = (category: 'ac' | 'fast' | 'ultra') => {
    const current = filters.powerCategories || ['ac', 'fast', 'ultra'];
    // If all are selected and we click one, select only that one
    // If one is selected and we click it, select all
    if (current.length === 3) {
      onFiltersChange({ ...filters, powerCategories: [category] });
    } else if (current.length === 1 && current.includes(category)) {
      onFiltersChange({ ...filters, powerCategories: ['ac', 'fast', 'ultra'] });
    } else {
      const updated = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      onFiltersChange({ ...filters, powerCategories: updated.length > 0 ? updated : ['ac', 'fast', 'ultra'] });
    }
  };

  const isOnlyCategory = (category: 'ac' | 'fast' | 'ultra') => {
    const current = filters.powerCategories || ['ac', 'fast', 'ultra'];
    return current.length === 1 && current.includes(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <nav 
      className="flex gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory md:snap-none md:flex-wrap" 
      role="toolbar" 
      aria-label="Szybkie filtry stacji"
    >
      <button
        type="button"
        role="switch"
        aria-checked={filters.availability === 'available'}
        onClick={() => onFiltersChange({ ...filters, availability: filters.availability === 'available' ? 'all' : 'available' })}
        className={`inline-flex items-center rounded-full border px-2.5 sm:px-3 md:px-4 py-1 md:py-1.5 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap h-7 sm:h-8 md:h-10 min-h-[28px] sm:min-h-[32px] md:min-h-[40px] touch-manipulation cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 snap-start md:snap-align-none ${
          filters.availability === 'available' 
            ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' 
            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
        aria-label={`Tylko dostępne. ${filters.availability === 'available' ? 'Włączone' : 'Wyłączone'}`}
      >
        Dostępne
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={filters.maxPrice !== undefined && filters.maxPrice <= 1.5}
        onClick={() => onFiltersChange({ 
          ...filters, 
          maxPrice: filters.maxPrice !== undefined && filters.maxPrice <= 1.5 ? undefined : 1.5 
        })}
        className={`inline-flex items-center rounded-full border px-2.5 sm:px-3 md:px-4 py-1 md:py-1.5 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap h-7 sm:h-8 md:h-10 min-h-[28px] sm:min-h-[32px] md:min-h-[40px] touch-manipulation cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 snap-start md:snap-align-none ${
          filters.maxPrice !== undefined && filters.maxPrice <= 1.5
            ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' 
            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
        aria-label={`Tanie (max 1,50 zł/kWh). ${filters.maxPrice !== undefined && filters.maxPrice <= 1.5 ? 'Włączone' : 'Wyłączone'}`}
      >
        Tanie ≤1,50 zł
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={isOnlyCategory('ultra')}
        onClick={() => togglePowerCategory('ultra')}
        className={`inline-flex items-center rounded-full border px-2.5 sm:px-3 md:px-4 py-1 md:py-1.5 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap h-7 sm:h-8 md:h-10 min-h-[28px] sm:min-h-[32px] md:min-h-[40px] touch-manipulation cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 snap-start md:snap-align-none ${
          isOnlyCategory('ultra') 
            ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' 
            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
        aria-label={`Ultraszybkie. ${isOnlyCategory('ultra') ? 'Włączone' : 'Wyłączone'}`}
      >
        Ultraszybkie
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={isOnlyCategory('fast')}
        onClick={() => togglePowerCategory('fast')}
        className={`inline-flex items-center rounded-full border px-2.5 sm:px-3 md:px-4 py-1 md:py-1.5 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap h-7 sm:h-8 md:h-10 min-h-[28px] sm:min-h-[32px] md:min-h-[40px] touch-manipulation cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 snap-start md:snap-align-none ${
          isOnlyCategory('fast') 
            ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' 
            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
        aria-label={`Szybkie DC. ${isOnlyCategory('fast') ? 'Włączone' : 'Wyłączone'}`}
      >
        Szybkie DC
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={filters.onlyOpen || false}
        onClick={() => onFiltersChange({ ...filters, onlyOpen: !filters.onlyOpen })}
        className={`inline-flex items-center rounded-full border px-2.5 sm:px-3 md:px-4 py-1 md:py-1.5 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap h-7 sm:h-8 md:h-10 min-h-[28px] sm:min-h-[32px] md:min-h-[40px] touch-manipulation cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 snap-start md:snap-align-none ${
          filters.onlyOpen 
            ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' 
            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
        }`}
        aria-label={`24/7. ${filters.onlyOpen ? 'Włączone' : 'Wyłączone'}`}
      >
        24/7
      </button>
    </nav>
  );
}
