import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // GET /api/produtos - List all products
  app.get("/api/produtos", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // GET /api/produtos/:id - Get single product
  app.get("/api/produtos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // POST /api/validar-produto - Validate product data
  app.post("/api/validar-produto", async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      
      if (!result.success) {
        const errors = fromZodError(result.error).details.map(d => d.message);
        return res.status(400).json({ 
          valido: false, 
          erros: errors 
        });
      }
      
      res.json({ valido: true });
    } catch (error) {
      console.error("Error validating product:", error);
      res.status(500).json({ error: "Validation failed" });
    }
  });

  // POST /api/produtos - Create new product
  app.post("/api/produtos", async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      
      if (!result.success) {
        const errors = fromZodError(result.error).details.map(d => d.message);
        return res.status(400).json({ 
          valido: false, 
          erros: errors 
        });
      }
      
      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // PUT /api/produtos/:id - Update product
  app.put("/api/produtos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const result = insertProductSchema.safeParse(req.body);
      
      if (!result.success) {
        const errors = fromZodError(result.error).details.map(d => d.message);
        return res.status(400).json({ 
          valido: false, 
          erros: errors 
        });
      }
      
      const product = await storage.updateProduct(id, result.data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // DELETE /api/produtos/:id - Delete product
  app.delete("/api/produtos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  return httpServer;
}
