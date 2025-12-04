import { useState } from "react";
import { useLocation } from "react-router-dom";
import { 
  CreditCard, 
  Ticket, 
  Receipt, 
  History, 
  User, 
  Users, 
  FileText, 
  CheckSquare, 
  ShoppingCart, 
  MessageSquare, 
  Calendar,
  LogOut,
  ChevronRight,
  ChevronDown,
  Zap,
  MapPin,
  List,
  Heart,
  BarChart3,
  Navigation,
  LucideIcon,
  Moon,
  Sun,
  Monitor,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import logo from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";

interface NavItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

interface NavGroup {
  title: string;
  icon: LucideIcon;
  href?: string;
  children?: NavItem[];
}

const mainNavItems: NavGroup[] = [
  { title: "Karta i pakiety", icon: CreditCard, href: "/karta" },
  { title: "Wejścia i zniżki", icon: Ticket, href: "/wejscia" },
  { title: "Bilety", icon: Receipt, href: "/bilety" },
  { title: "Historia", icon: History, href: "/historia-karta" },
  { title: "Profil", icon: User, href: "/profil" },
  { title: "Rodzina", icon: Users, href: "/rodzina" },
  { title: "Faktury", icon: FileText, href: "/faktury" },
  { title: "Zgody", icon: CheckSquare, href: "/zgody" },
  { title: "Koszyk", icon: ShoppingCart, href: "/koszyk" },
  { title: "Zgłoszenia", icon: MessageSquare, href: "/zgloszenia" },
  { title: "Ekoharmonogram", icon: Calendar, href: "/ekoharmonogram" },
  { 
    title: "Ładowarki EV", 
    icon: Zap, 
    children: [
      { title: "Mapa ładowarek", icon: MapPin, href: "/ev/mapa" },
      { title: "Lista stacji", icon: List, href: "/ev/lista" },
      { title: "Ulubione", icon: Heart, href: "/ev/ulubione" },
      { title: "Historia", icon: History, href: "/ev/historia" },
      { title: "Porównanie cen", icon: BarChart3, href: "/ev/ceny" },
      { title: "Porównanie trasy", icon: Navigation, href: "/ev/trasa" },
    ]
  },
];

function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const getNextTheme = () => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };
  
  const getThemeLabel = () => {
    if (theme === 'light') return 'Jasny';
    if (theme === 'dark') return 'Ciemny';
    return 'Systemowy';
  };
  
  const getThemeIcon = () => {
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    return Monitor;
  };
  
  const ThemeIcon = getThemeIcon();
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={() => setTheme(getNextTheme())}
        className="flex items-center justify-between px-4 py-3 min-h-[48px] hover:bg-sidebar-accent rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset touch-manipulation"
        aria-label={`Zmień motyw. Aktualny: ${getThemeLabel()}`}
      >
        <span className="flex items-center gap-2.5">
          <ThemeIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">Motyw: {getThemeLabel()}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarCloseButton() {
  const { setOpenMobile, isMobile } = useSidebar();
  
  if (!isMobile) return null;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpenMobile(false)}
      className="h-10 w-10 min-h-[44px] min-w-[44px] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Zamknij menu nawigacji"
    >
      <X className="h-5 w-5" aria-hidden="true" />
    </Button>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const [evOpen, setEvOpen] = useState(location.pathname.startsWith('/ev'));
  const { setOpenMobile, isMobile } = useSidebar();
  
  const isActive = (href: string) => location.pathname === href;
  const isEvActive = location.pathname.startsWith('/ev');

  // Zamknij sidebar na mobile po kliknięciu w link
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar 
      className="border-r border-sidebar-border"
      aria-label="Panel boczny nawigacji"
    >
      {/* Logo w sidebar - widoczne na desktop i w otwartym menu mobile */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            onClick={handleLinkClick}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            aria-label="Strona główna - Karta Łodzianina"
          >
            <img src={logo} alt="" className="h-9 sm:h-10 w-auto dark:hidden" aria-hidden="true" />
            <img src={logoDark} alt="" className="h-9 sm:h-10 w-auto hidden dark:block" aria-hidden="true" />
            <span className="sr-only">Karta Łodzianina</span>
          </a>
          <SidebarCloseButton />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 overflow-y-auto">
        <SidebarMenu role="navigation" aria-label="Główna nawigacja">
          {mainNavItems.map((item) => {
            const IconComponent = item.icon;
            
            if (item.children) {
              return (
                <SidebarMenuItem key={item.title}>
                  <Collapsible open={evOpen} onOpenChange={setEvOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className={`flex items-center justify-between px-4 py-3 min-h-[48px] w-full hover:bg-sidebar-accent rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset touch-manipulation ${isEvActive ? 'bg-sidebar-accent text-primary font-medium' : ''}`}
                        aria-expanded={evOpen}
                        aria-label={`${item.title} - ${evOpen ? 'zwiń' : 'rozwiń'} podmenu`}
                      >
                        <span className="flex items-center gap-2.5">
                          <IconComponent className={`h-5 w-5 flex-shrink-0 ${isEvActive ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
                          <span className="text-sm font-medium truncate">{item.title}</span>
                        </span>
                        {evOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-4 border-l-2 border-primary/20 ml-6">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const active = isActive(child.href);
                          return (
                            <a
                              key={child.title}
                              href={child.href}
                              onClick={handleLinkClick}
                              className={`flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset touch-manipulation ${active ? 'bg-sidebar-accent text-primary font-medium' : 'text-foreground'}`}
                              aria-current={active ? 'page' : undefined}
                              aria-label={`Przejdź do: ${child.title}`}
                            >
                              <ChildIcon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
                              <span className="text-sm truncate">{child.title}</span>
                            </a>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              );
            }
            
            const active = isActive(item.href!);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={`flex items-center justify-between px-4 py-3 min-h-[48px] hover:bg-sidebar-accent rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset touch-manipulation ${active ? 'bg-sidebar-accent text-primary font-medium' : ''}`}
                >
                  <a 
                    href={item.href} 
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 w-full"
                    aria-label={`Przejdź do: ${item.title}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <IconComponent className={`h-5 w-5 flex-shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
                    <span className="flex-1 text-sm font-medium truncate">{item.title}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          
          {/* Theme Toggle - widoczny w sidebarze */}
          <div className="border-t border-sidebar-border mt-2 pt-2">
            <MobileThemeToggle />
          </div>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-4 py-3 min-h-[48px] w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
              aria-label="Wyloguj się z konta"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">Wyloguj</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}