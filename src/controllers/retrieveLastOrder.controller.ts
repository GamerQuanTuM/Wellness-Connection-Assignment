import { type Request, type Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * The function retrieves the most recent order for each user and returns an array of order details
 * with user information.
 * @returns The `getLastOrdersForUsers` function returns an array of objects, where each object
 * represents the most recent order for a user. Each object contains the following properties:
 */

//Fetch All Orders: The findMany method fetches all orders from the database, including the associated user details.
//Process Orders: Iterate through the orders and use a map to keep track of the most recent order for each user.
//Map to Array: Convert the map to an array and format the results to include the order ID, amount, and the associated user's name and email.
export async function getLastOrdersForUsers(req: Request, res: Response) {
  // Fetch all orders
  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
  });

  // Create a map to store the most recent order for each user
  const userLastOrderMap = new Map<string, any>();
  orders.forEach((order) => {
    const userId = order.userId;

    // Check if the map has an entry for the userId or if the current order is more recent
    if (
      !userLastOrderMap.has(userId) ||
      userLastOrderMap.get(userId).createdAt < order.createdAt
    ) {
      // Update the map with the current order
      userLastOrderMap.set(userId, order);
    }
  });

  // Convert the map to an array
  const lastOrders = Array.from(userLastOrderMap.values());

  const lastOrdersArray = lastOrders.map((order) => ({
    orderId: order.id,
    amount: order.amount,
    createdAt: order.createdAt,
    user: {
      name: order.user.name,
      email: order.user.email,
    },
  }));

  return res.status(200).json({ message: lastOrdersArray });
}
