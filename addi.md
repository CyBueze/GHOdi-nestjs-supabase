src/cart/cart.service.ts:58:27 - error TS18047: 'drugs' is possibly 'null'.

58   const drugMap = new Map(drugs.map(d => [d.id, d]));
                             ~~~~~

src/cart/cart.service.ts:81:59 - error TS18047: 'item' is possibly 'null'.

81   const regSum = detailedCart.reduce((sum, item) => sum + item.regTotal, 0);
                                                             ~~~~

src/cart/cart.service.ts:82:60 - error TS18047: 'item' is possibly 'null'.

82   const bhisSum = detailedCart.reduce((sum, item) => sum + item.bhisTotal, 0);
                                                              ~~~~

[2:22:42 PM] Found 3 errors. Watching for file changes.

.....

import { Injectable } from '@nestjs/common';
import {supabase} from '../db/supabase.client'
import {Request} from "express"

@Injectable()
export class CartService {
  
  addToCart(id: number, quantity: number, req: Request) {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    console.log(req.session.cart)

    const existingItem = req.session.cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({ id, quantity });
    }

    return { message: 'Item added to cart', cart: req.session.cart, layout: false };
  }
  
  async getCart(req: Request){
    const cart = req.session.cart || [];

  // Validate cart structure
  if (!Array.isArray(cart) || cart.some(item => !item.id || !item.quantity)) {
    console.error("Invalid cart structure");
  }

  if (cart.length === 0) {
    return { cart: [], regSum: 0, bhisSum: 0 };
  }

  // Collect all ids in the cart
  const ids = cart.map((item) => item.id);

  // Handle empty IDs array
  if (ids.length === 0) {
    return { cart: [], regSum: 0, bhisSum: 0 };
  }
  

  // Fetch all drugs in one query
  const { data: drugs, error } = await supabase
    .from("drugs")
    .select("id, name, regPrice, bhisPrice")
    .in("id", ids);

  if (error) {
    console.error("Error fetching drugs", error);
  }

  // Create a lookup map for drugs
  const drugMap = new Map(drugs.map(d => [d.id, d]));

  // Merge cart quantities with drug details
  const detailedCart = cart
    .map((item) => {
      const drug = drugMap.get(item.id);
      if (!drug) {
        console.warn(`Drug with ID ${item.id} not found in database`);
        return null;
      }
      return {
        id: item.id,
        name: drug.name,
        regPrice: parseInt(drug.regPrice),
        bhisPrice: parseInt(drug.bhisPrice),
        quantity: item.quantity,
        regTotal: item.quantity * parseInt(drug.regPrice),
        bhisTotal: item.quantity * parseInt(drug.bhisPrice),
      };
    })
    .filter(Boolean);

  // Totals
  const regSum = detailedCart.reduce((sum, item) => sum + item.regTotal, 0);
  const bhisSum = detailedCart.reduce((sum, item) => sum + item.bhisTotal, 0);

  return {
    cart: detailedCart,
    regSum,
    bhisSum,
  };
  }
}
