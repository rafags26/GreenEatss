import React, { createContext, useContext, useState, useEffect } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// --- Types ---
export type Category = "Fruta" | "Legume" | "Verdura";

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: Category;
  estoque: number;
  unidade: string;
}

// --- Validation Schema (Matches backend requirements) ---
export const productSchema = z.object({
  nome: z.string().trim().min(5, { message: "O nome deve ter pelo menos 5 caracteres." }),
  descricao: z.string().optional(),
  preco: z.coerce.number().gt(0, { message: "O preço deve ser maior que 0." }),
  categoria: z.enum(["Fruta", "Legume", "Verdura"], {
    errorMap: () => ({ message: "Categoria inválida. Escolha Fruta, Legume ou Verdura." }),
  }),
  estoque: z.coerce.number().min(0, { message: "O estoque não pode ser negativo." }),
  unidade: z.string().min(1, { message: "A unidade é obrigatória (ex: kg, un)." }),
});

export type ProductFormData = z.infer<typeof productSchema>;

// --- Context Interface ---
interface ProductContextType {
  products: Product[];
  addProduct: (data: ProductFormData) => Promise<boolean>;
  updateProduct: (id: number, data: ProductFormData) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  validateProduct: (data: ProductFormData) => { valid: boolean; errors: string[] };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// --- Mock Data ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    nome: "Tomate Orgânico",
    descricao: "Tomate italiano fresco direto do produtor.",
    preco: 8.50,
    categoria: "Legume", // Technically a fruit, but culinarily often veggie, sticking to prompt cats
    estoque: 50,
    unidade: "kg"
  },
  {
    id: 2,
    nome: "Alface Americana",
    descricao: "Alface crocante e sem agrotóxicos.",
    preco: 4.00,
    categoria: "Verdura",
    estoque: 30,
    unidade: "un"
  },
  {
    id: 3,
    nome: "Morango Silvestre",
    descricao: "Morangos doces e pequenos.",
    preco: 12.00,
    categoria: "Fruta",
    estoque: 15,
    unidade: "bandeja"
  }
];

// --- Provider ---
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const { toast } = useToast();

  // Simulate API Validation Endpoint
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

  // Simulate POST /produtos
  const addProduct = async (data: ProductFormData) => {
    // Validate first (simulating the /validar-produto check)
    const validation = validateProduct(data);
    if (!validation.valid) {
      validation.errors.forEach(err => toast({ title: "Erro de validação", description: err, variant: "destructive" }));
      return false;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newProduct: Product = {
      ...data,
      id: Math.floor(Math.random() * 10000) + 100, // Mock ID
      descricao: data.descricao || ""
    };

    setProducts(prev => [...prev, newProduct]);
    toast({ title: "Produto criado!", description: `${newProduct.nome} foi adicionado ao catálogo.` });
    return true;
  };

  // Simulate PUT /produtos/:id
  const updateProduct = async (id: number, data: ProductFormData) => {
    const validation = validateProduct(data);
    if (!validation.valid) {
      validation.errors.forEach(err => toast({ title: "Erro de validação", description: err, variant: "destructive" }));
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data, descricao: data.descricao || "" } : p));
    toast({ title: "Produto atualizado!", description: `${data.nome} foi salvo com sucesso.` });
    return true;
  };

  // Simulate DELETE /produtos/:id
  const deleteProduct = async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Produto removido", variant: "default" });
    return true;
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, validateProduct }}>
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
