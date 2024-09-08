// src/routes.ts
import { Router, type Request, type Response } from "express";
import { inOrderTraversal } from "../controllers/treeTraversal.controller";
import { removeUnsedUrlFromS3Bucket } from "../controllers/imageUrl.controller";
import { authenticateToken } from "../middleware";
import { getAllProducts } from "../controllers/getProducts.contoller";

const router = Router();

router.get("/in-order-traversal", inOrderTraversal);
router.get("/remove-unused-images", removeUnsedUrlFromS3Bucket);
router.get("/get-products", getAllProducts);

router.get("/protected", authenticateToken, (req: Request, res: Response) => {
  res.send("This is a protected route");
});

export default router;
