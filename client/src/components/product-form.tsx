import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData, useProducts, type Product } from "@/lib/product-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Loader2, Save, X } from "lucide-react";

interface ProductFormProps {
  productToEdit?: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ProductForm({ productToEdit, onCancel, onSuccess }: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      preco: "",
      categoria: "Legume",
      estoque: 0,
      unidade: "un",
    },
  });

  useEffect(() => {
    if (productToEdit) {
      form.reset({
        nome: productToEdit.nome,
        descricao: productToEdit.descricao,
        preco: productToEdit.preco,
        categoria: productToEdit.categoria,
        estoque: productToEdit.estoque,
        unidade: productToEdit.unidade,
      });
    } else {
      form.reset({
        nome: "",
        descricao: "",
        preco: "",
        categoria: "Legume",
        estoque: 0,
        unidade: "",
      });
    }
  }, [productToEdit, form]);

  const onSubmit = async (data: ProductFormData) => {
    let success = false;
    if (productToEdit) {
      success = await updateProduct(productToEdit.id, data);
    } else {
      success = await addProduct(data);
    }
    
    if (success) {
      onSuccess();
      if (!productToEdit) {
         form.reset();
      }
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col animate-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          {productToEdit ? "Editar Produto" : "Novo Produto"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {productToEdit ? "Atualize os dados do produto abaixo." : "Preencha as informações para adicionar ao catálogo."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto px-1">
          
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Cenoura Orgânica" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Mínimo de 5 caracteres.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fruta">Fruta</SelectItem>
                      <SelectItem value="Legume">Legume</SelectItem>
                      <SelectItem value="Verdura">Verdura</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="estoque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque Inicial</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: kg, maço, un" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (Opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detalhes sobre o cultivo, validade, etc." 
                    className="resize-none h-24"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4 border-t mt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {productToEdit ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
