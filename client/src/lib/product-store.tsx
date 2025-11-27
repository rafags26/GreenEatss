import React, { createContext, useContext, useState, useEffect } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---
export type Category = "Fruta" | "Legume" | "Verdura";

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  categoria: Category;
  estoque: number;
  unidade: string;
}

// --- Validation Schema (Matches backend requirements) ---
export const productSchema = z.object({
  nome: z.string().trim().min(5, { message: "O nome deve ter pelo menos 5 caracteres." }),
  descricao: z.string().optional(),
  preco: z.string().refine(val => parseFloat(val) > 0, { message: "O preço deve ser maior que 0." }),
  categoria: z.enum(["Fruta", "Legume", "Verdura"], {
    errorMap: () => ({ message: "Categoria inválida. Escolha Fruta, Legume ou Verdura." }),
  }),
  estoque: z.coerce.number().min(0, { message: "O estoque não pode ser negativo." }),
  unidade: z.string().min(1, { message: "A unidade é obrigatória (ex: kg, un)." }),
});

export type ProductFormData = z.infer<typeof productSchema>;

// --- API Functions ---
async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/produtos");
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

async function createProduct(data: ProductFormData): Promise<Product> {
  const response = await fetch("/api/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erros?.join(", ") || "Failed to create product");
  }
  return response.json();
}

async function updateProductApi(id: number, data: ProductFormData): Promise<Product> {
  const response = await fetch(`/api/produtos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erros?.join(", ") || "Failed to update product");
  }
  return response.json();
}

async function deleteProductApi(id: number): Promise<void> {
  const response = await fetch(`/api/produtos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

// --- Context Interface ---
interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (data: ProductFormData) => Promise<boolean>;
  updateProduct: (id: number, data: ProductFormData) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  validateProduct: (data: ProductFormData) => { valid: boolean; errors: string[] };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// --- Provider ---
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ 
        title: "Produto criado!", 
        description: `${newProduct.nome} foi adicionado ao catálogo.` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao criar produto", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) => 
      updateProductApi(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ 
        title: "Produto atualizado!", 
        description: `${updatedProduct.nome} foi salvo com sucesso.` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar produto", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produto removido", variant: "default" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao remover produto", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  // Validate product
  const validateProduct = (data: ProductFormData) => {
    const result = productSchema.safeParse(data);
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.errors.map(e => e.message)
      };
    }
    return { valid: true, errors: [] };
  };

  // Wrapper functions
  const addProduct = async (data: ProductFormData) => {
    const validation = validateProduct(data);
    if (!validation.valid) {
      validation.errors.forEach(err => 
        toast({ title: "Erro de validação", description: err, variant: "destructive" })
      );
      return false;
    }

    try {
      await createMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  const updateProduct = async (id: number, data: ProductFormData) => {
    const validation = validateProduct(data);
    if (!validation.valid) {
      validation.errors.forEach(err => 
        toast({ title: "Erro de validação", description: err, variant: "destructive" })
      );
      return false;
    }

    try {
      await updateMutation.mutateAsync({ id, data });
      return true;
    } catch {
      return false;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      isLoading,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      validateProduct 
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
