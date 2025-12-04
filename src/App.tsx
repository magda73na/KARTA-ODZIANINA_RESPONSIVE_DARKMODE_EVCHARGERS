import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MapaLadowarek from "./pages/ev/MapaLadowarek";
import ListaStacji from "./pages/ev/ListaStacji";
import Ulubione from "./pages/ev/Ulubione";
import Historia from "./pages/ev/Historia";
import PorownanieCen from "./pages/ev/PorownanieCen";
import PorownanieTrasy from "./pages/ev/PorownanieTrasy";
import Bilety from "./pages/Bilety";
import Loteria from "./pages/Loteria";

const queryClient = new QueryClient();

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Przejdź do głównej treści
    </a>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <SkipLink />
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col pb-16 md:pb-0">
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/bilety" element={<Bilety />} />
                  <Route path="/loteria" element={<Loteria />} />
                  <Route path="/ev/mapa" element={<MapaLadowarek />} />
                  <Route path="/ev/lista" element={<ListaStacji />} />
                  <Route path="/ev/ulubione" element={<Ulubione />} />
                  <Route path="/ev/historia" element={<Historia />} />
                  <Route path="/ev/ceny" element={<PorownanieCen />} />
                  <Route path="/ev/trasa" element={<PorownanieTrasy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <MobileBottomNav />
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
