import React from "react";
import logoUrl from "@assets/generated_images/minimalist_organic_logo_for_greeneats.png";
import { useToast } from "@/hooks/use-toast";
import { ProfileSettings } from "@/components/profile-settings";

export function Header() {
  const { toast } = useToast();

  const handleOrdersClick = () => {
    // Redirect to WhatsApp with a pre-filled message
    const phoneNumber = "5541991117171";
    const message = encodeURIComponent("Olá, gostaria de gerenciar minhas encomendas.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 p-1.5 overflow-hidden flex items-center justify-center">
             <img src={logoUrl} alt="GreenEats Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground leading-none">GreenEats</h1>
            <p className="text-xs text-muted-foreground font-medium">Portal do Produtor</p>
          </div>
        </div>
        <nav className="flex gap-4">
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
            Meus Produtos
          </button>
          <button 
            onClick={handleOrdersClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Encomendas
          </button>
          <div className="w-px h-4 bg-border self-center mx-2"></div>
          
          <ProfileSettings>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" title="Configurações do Perfil">
              <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold border border-accent/10">
                JP
              </div>
            </div>
          </ProfileSettings>
        </nav>
      </div>
    </header>
  );
}
