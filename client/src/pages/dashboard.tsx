import React, { useState } from "react";
import { Header } from "@/components/header";
import { ProductForm } from "@/components/product-form";
import { ProductList } from "@/components/product-list";
import { ProductProvider, useProducts, type Product } from "@/lib/product-store";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DashboardContent() {
  const { products } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.categoria);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Product List */}
          <div className={`flex-1 w-full transition-all duration-500 ${isFormOpen ? 'hidden md:block' : 'block'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground">Catálogo</h2>
                <p className="text-muted-foreground mt-1">Gerencie seus produtos disponíveis para venda.</p>
              </div>
              <Button onClick={handleAddNew} className="shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar produtos..." 
                  className="pl-9 bg-white" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className={selectedCategories.length > 0 ? "border-primary text-primary bg-primary/5" : ""}>
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filtrar por Categoria</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem 
                    checked={selectedCategories.includes("Fruta")}
                    onCheckedChange={() => toggleCategory("Fruta")}
                  >
                    Frutas
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={selectedCategories.includes("Legume")}
                    onCheckedChange={() => toggleCategory("Legume")}
                  >
                    Legumes
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={selectedCategories.includes("Verdura")}
                    onCheckedChange={() => toggleCategory("Verdura")}
                  >
                    Verduras
                  </DropdownMenuCheckboxItem>
                  {selectedCategories.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem 
                        checked={false}
                        onSelect={() => setSelectedCategories([])}
                        className="text-destructive focus:text-destructive"
                      >
                        Limpar filtros
                      </DropdownMenuCheckboxItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ProductList products={filteredProducts} onEdit={handleEdit} />
          </div>

          {/* Right Column: Form (or modal on mobile) */}
          {(isFormOpen) && (
            <div className="w-full md:w-[400px] lg:w-[450px] sticky top-24 z-20">
               <ProductForm 
                 productToEdit={editingProduct}
                 onCancel={handleFormCancel}
                 onSuccess={handleFormSuccess}
               />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProductProvider>
      <DashboardContent />
    </ProductProvider>
  );
}
