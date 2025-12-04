/**
 * Spójny system rozmiarów ikon dla całej aplikacji
 * Wszystkie ikony pochodzą z lucide-react i mają jednolitą grubość linii (strokeWidth: 2)
 * 
 * ROZMIARY IKON (responsywne klasy Tailwind):
 * 
 * 1. IKONY STANDARDOWE (nawigacja, przyciski, karty):
 *    - Mobile:  h-4 w-4    (16px)
 *    - Tablet:  h-5 w-5    (20px)  
 *    - Desktop: h-5 w-5    (20px)
 * 
 * 2. IKONY MAŁE (badge, kompaktowe widoki, inline):
 *    - Mobile:  h-3 w-3    (12px)
 *    - Tablet:  h-3.5 w-3.5 (14px)
 *    - Desktop: h-4 w-4    (16px)
 * 
 * 3. IKONY DUŻE (hero, floating action buttons, prominent):
 *    - Mobile:  h-5 w-5    (20px)
 *    - Tablet:  h-6 w-6    (24px)
 *    - Desktop: h-6 w-6    (24px)
 * 
 * 4. IKONY MINI (wewnątrz małych elementów):
 *    - Wszystkie: h-3 w-3  (12px)
 * 
 * DOSTĘPNOŚĆ:
 * - Ikony dekoracyjne: aria-hidden="true"
 * - Ikony jako jedyny element przycisku: dodać aria-label do rodzica
 * - Ikony z funkcją informacyjną: dodać <span className="sr-only">Opis</span>
 * 
 * ODSTĘPY:
 * - Między ikoną a tekstem: gap-1.5 (mobile) / gap-2 (tablet+)
 * - W przyciskach: mr-1.5 sm:mr-2
 */

// Klasy CSS dla standardowych rozmiarów ikon
export const iconSizes = {
  // Standardowe ikony w nawigacji, przyciskach, kartach
  standard: "h-4 w-4 md:h-5 md:w-5",
  
  // Małe ikony w badge, kompaktowych widokach
  small: "h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4",
  
  // Duże ikony w hero, FAB, wyróżnionych miejscach
  large: "h-5 w-5 md:h-6 md:w-6",
  
  // Mini ikony, bez responsywności
  mini: "h-3 w-3",
  
  // Ikony w dropdown menu
  menu: "h-4 w-4",
  
  // Ikony w sidebar
  sidebar: "h-5 w-5",
  
  // Chevron/arrow ikony (mniejsze)
  chevron: "h-4 w-4 md:h-5 md:w-5",
  
  // Ikony w formularzach (prefix/suffix)
  input: "h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5",
} as const;

// Klasy CSS dla odstępów między ikoną a tekstem
export const iconGaps = {
  // Standardowy odstęp
  standard: "gap-1.5 sm:gap-2 md:gap-2.5",
  
  // Mały odstęp
  small: "gap-1 sm:gap-1.5",
  
  // Duży odstęp
  large: "gap-2 sm:gap-2.5 md:gap-3",
} as const;

// Klasy CSS dla margin przy ikonie przed tekstem
export const iconMargins = {
  // Standardowy margin-right
  standard: "mr-1.5 sm:mr-2",
  
  // Mały margin
  small: "mr-1 sm:mr-1.5",
  
  // Duży margin
  large: "mr-2 sm:mr-2.5",
} as const;

export type IconSize = keyof typeof iconSizes;
export type IconGap = keyof typeof iconGaps;
export type IconMargin = keyof typeof iconMargins;
