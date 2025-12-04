import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LotteryButton } from "@/components/lottery/LotteryButton";
import logo from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";

const navItems = [
  { label: "Aktualności", href: "#news" },
  { label: "Wydarzenia", href: "#events" },
  { label: "Oferty", href: "#offers" },
  { label: "FAQ", href: "#faq" },
  { label: "Punkty obsługi", href: "#service" },
  { label: "Zostań partnerem", href: "#partner" },
];

export function Header() {
  return (
    <header 
      role="banner" 
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-12 sm:h-14 md:h-16 lg:h-16 items-center justify-between px-2 sm:px-3 md:px-6 lg:px-6 gap-1 sm:gap-2 md:gap-4">
        {/* Left side - Sidebar trigger and Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
          <SidebarTrigger 
            className="h-10 w-10 sm:h-10 sm:w-10 md:h-11 md:w-11 min-h-[44px] min-w-[44px] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation [&_svg]:h-5 [&_svg]:w-5" 
            aria-label="Otwórz menu nawigacji"
          />
          <a 
            href="/" 
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md flex-shrink-0"
            aria-label="Strona główna - Karta Łodzianina"
          >
            <img 
              src={logo} 
              alt="" 
              className="h-6 sm:h-7 md:h-9 lg:h-10 w-auto dark:hidden max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-none" 
              aria-hidden="true" 
            />
            <img 
              src={logoDark} 
              alt="" 
              className="h-6 sm:h-7 md:h-9 lg:h-10 w-auto hidden dark:block max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-none" 
              aria-hidden="true" 
            />
            <span className="sr-only">Karta Łodzianina - Strona główna</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav 
          role="navigation" 
          aria-label="Główna nawigacja"
          className="hidden xl:flex items-center gap-1 flex-shrink-0"
        >
          <ul className="flex items-center gap-0.5" role="list">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="px-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side - Lottery, Search, Theme, User */}
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-2 flex-shrink-0">
          <LotteryButton />
          <GlobalSearch />
          <ThemeToggle />
          <Button 
            variant="dark" 
            size="sm" 
            className="hidden sm:flex h-8 sm:h-9 md:h-10 lg:h-10 px-2 sm:px-3 md:px-4 lg:px-4 min-h-[32px] sm:min-h-[36px] md:min-h-[44px] lg:min-h-[44px] text-xs md:text-sm lg:text-sm touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Przejdź do panelu użytkownika"
          >
            <span className="hidden md:inline">MÓJ PANEL</span>
            <span className="md:hidden">PANEL</span>
          </Button>
        </div>
      </div>
    </header>
  );
}