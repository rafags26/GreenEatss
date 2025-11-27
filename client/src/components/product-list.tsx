import { useProducts, type Product } from "@/lib/product-store";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, PackageOpen, Leaf, Carrot, Apple } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function ProductList({ products, onEdit }: ProductListProps) {
  const { deleteProduct } = useProducts();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-xl bg-card border-dashed">
        <PackageOpen className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">Nenhum produto encontrado.</p>
        <p className="text-sm">Tente ajustar sua busca ou adicione um novo item.</p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Fruta": return <Apple className="w-4 h-4 text-rose-500" />;
      case "Legume": return <Carrot className="w-4 h-4 text-orange-500" />;
      case "Verdura": return <Leaf className="w-4 h-4 text-green-500" />;
      default: return <PackageOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Fruta": return "bg-rose-50 text-rose-700 border-rose-100";
      case "Legume": return "bg-orange-50 text-orange-700 border-orange-100";
      case "Verdura": return "bg-green-50 text-green-700 border-green-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-1">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200 hover:border-primary/30"
        >
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center border ${getCategoryColor(product.categoria)}`}>
              {getCategoryIcon(product.categoria)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground">{product.nome}</h3>
                <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${getCategoryColor(product.categoria)}`}>
                  {product.categoria}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                {product.descricao || "Sem descrição definida."}
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="font-semibold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(product.preco))}
                  <span className="text-muted-foreground font-normal ml-0.5">/{product.unidade}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span className="text-muted-foreground">
                  Estoque: <span className={product.estoque < 10 ? "text-amber-600 font-medium" : "text-foreground"}>{product.estoque}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" onClick={() => onEdit(product)} className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Edit2 className="w-4 h-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Produto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover "{product.nome}" do catálogo? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteProduct(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
