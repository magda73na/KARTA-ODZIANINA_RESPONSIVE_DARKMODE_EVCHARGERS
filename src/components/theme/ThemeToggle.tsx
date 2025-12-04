import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 md:h-11 md:w-11 min-h-[44px] min-w-[44px] touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Zmień motyw kolorystyczny"
          aria-haspopup="menu"
        >
          <Sun 
            className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
            aria-hidden="true" 
          />
          <Moon 
            className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
            aria-hidden="true" 
          />
          <span className="sr-only">
            {theme === 'dark' ? 'Aktualny motyw: ciemny' : theme === 'light' ? 'Aktualny motyw: jasny' : 'Aktualny motyw: systemowy'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="gap-2 min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Wybierz jasny motyw"
        >
          <Sun className="h-4 w-4" aria-hidden="true" />
          Jasny
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="gap-2 min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Wybierz ciemny motyw"
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
          Ciemny
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className="gap-2 min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Wybierz motyw systemowy"
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          Systemowy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
