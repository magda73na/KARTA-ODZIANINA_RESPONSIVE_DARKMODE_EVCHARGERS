import { useLocation, useNavigate } from "react-router-dom";
import { Home, MapPin, Heart, History, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
  matchPath?: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Start", href: "/" },
  { icon: MapPin, label: "Mapa", href: "/ev/mapa", matchPath: "/ev" },
  { icon: Heart, label: "Ulubione", href: "/ev/ulubione" },
  { icon: History, label: "Historia", href: "/ev/historia" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  const isActive = (item: NavItem) => {
    if (item.href === "/") {
      return location.pathname === "/";
    }
    return location.pathname === item.href || 
           (item.matchPath && location.pathname.startsWith(item.matchPath) && item.href === "/ev/mapa");
  };

  const handleNavClick = (href: string) => {
    navigate(href);
  };

  const handleMenuClick = () => {
    setOpenMobile(true);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border md:hidden safe-area-bottom"
      aria-label="Dolna nawigacja mobilna"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-[64px] px-2 py-2 rounded-lg transition-colors touch-manipulation active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-transform",
                  active && "scale-110"
                )} 
                aria-hidden="true" 
              />
              <span className={cn(
                "text-[10px] font-medium leading-none",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* Menu button to open sidebar */}
        <button
          onClick={handleMenuClick}
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-[64px] px-2 py-2 rounded-lg transition-colors touch-manipulation active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Otwórz menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-medium leading-none">Menu</span>
        </button>
      </div>
    </nav>
  );
}
