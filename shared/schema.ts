import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao").default(""),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  categoria: text("categoria").notNull(),
  estoque: integer("estoque").notNull().default(0),
  unidade: text("unidade").notNull(),
});

export const insertProductSchema = createInsertSchema(products, {
  nome: z.string().trim().min(5, { message: "O nome deve ter pelo menos 5 caracteres." }),
  preco: z.string().refine(val => parseFloat(val) > 0, { message: "O preço deve ser maior que 0." }),
  categoria: z.enum(["Fruta", "Legume", "Verdura"], {
    errorMap: () => ({ message: "Categoria inválida. Escolha Fruta, Legume ou Verdura." }),
  }),
  estoque: z.number().min(0, { message: "O estoque não pode ser negativo." }),
  unidade: z.string().min(1, { message: "A unidade é obrigatória (ex: kg, un)." }),
  descricao: z.string().optional(),
}).omit({ id: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
