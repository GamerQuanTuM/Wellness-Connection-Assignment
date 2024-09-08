import axios from "axios";
import type { Request, Response } from "express";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  tags: string[];
  brand: string;
  discountPercentage?: number;
  rating?: number;
}

const API_ENDPOINT = "https://dummyjson.com/products";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(API_ENDPOINT);
    const products: Product[] = response.data.products;

    const validatedProducts = products.map((product) => {
      // Log product details for debugging
      console.log(`Validating product with id: ${product.id}`);

      // Validate required fields
      if (
        typeof product.id !== "number" ||
        typeof product.title !== "string" ||
        typeof product.description !== "string" ||
        typeof product.category !== "string" ||
        typeof product.price !== "number" ||
        !Array.isArray(product.tags) ||
        typeof product.brand !== "string"
      ) {
        console.log(
          `Product validation failed for product with id: ${product.id}`
        );
      }

      // Calculate discounted price
      const discountPercentage = product.discountPercentage || 0;
      const discountedPrice =
        product.price - (product.price * discountPercentage) / 100;

      // Calculate average rating
      const averageRating = product.rating || 0;

      // Destructure product properties
      const { id, title, description, category, price, brand, tags } = product;

      return {
        id,
        title,
        description,
        category,
        price,
        discountedPrice,
        averageRating,
        brand,
        tags,
      };
    });

    return res.status(200).json({ message: validatedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllProducts };
