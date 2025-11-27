import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { User, MapPin, Phone, Mail, Sprout } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-serif">Perfil do Produtor</SheetTitle>
          <SheetDescription>
            Gerencie suas informações pessoais e dados da propriedade.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Dados Pessoais
            </h3>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue="João da Silva" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="joao@sitioverde.com" className="pl-9" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" defaultValue="(41) 99111-7171" className="pl-9" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-4 h-4" /> Propriedade
            </h3>

            <div className="grid gap-2">
              <Label htmlFor="farm-name">Nome da Fazenda/Sítio</Label>
              <Input id="farm-name" defaultValue="Sítio Verde Orgânicos" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea 
                  id="address" 
                  className="pl-9 min-h-[80px] resize-none" 
                  defaultValue="Estrada Rural do Campo Magro, Km 4, s/n&#10;Campo Magro - PR, 83535-000" 
                />
              </div>
            </div>
          </div>

          <SheetFooter className="pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="mr-2">Cancelar</Button>
            </SheetClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
