import { Injectable } from '@nestjs/common';
import { supabase } from '../db/supabase.client';
import { Request } from 'express';

interface CartItem {
  id: number; // Changed from string to number
  quantity: number;
}

interface Drug {
  id: number; // Changed from string to number
  name: string;
  regPrice: number;
  bhisPrice: number;
}

export interface DetailedCartItem {
  id: number; // Changed from string to number
  name: string;
  regPrice: number;
  bhisPrice: number;
  quantity: number;
  regTotal: number;
  bhisTotal: number;
}

@Injectable()
export class CartService {
  addToCart(id: number, quantity: number, req: Request) { // Changed id from string to number
    if (!req.session.cart) {
      req.session.cart = [];
    }

    console.log(req.session.cart);

    const existingItem = req.session.cart.find((item: CartItem) => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({ id, quantity });
    }

    return { message: 'Item added to cart', cart: req.session.cart, layout: false };
  }

  async getCart(req: Request) {
    const cart: CartItem[] = req.session.cart || [];

    // Validate cart structure
    if (!Array.isArray(cart) || cart.some((item) => !item.id || !item.quantity)) {
      console.error('Invalid cart structure');
      return { cart: [], regSum: 0, bhisSum: 0 };
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
      .from('drugs')
      .select('id, name, regPrice, bhisPrice')
      .in('id', ids);

    if (error) {
      console.error('Error fetching drugs', error);
      return { cart: [], regSum: 0, bhisSum: 0 };
    }

    // Check if drugs is null or undefined
    if (!drugs || !Array.isArray(drugs)) {
      console.error('No drugs found or invalid response from Supabase');
      return { cart: [], regSum: 0, bhisSum: 0 };
    }

    // Create a lookup map for drugs
    const drugMap = new Map<number, Drug>(drugs.map((d) => [d.id, d])); // Changed key type to number

    // Merge cart quantities with drug details
    const detailedCart: DetailedCartItem[] = cart
      .map((item) => {
        const drug = drugMap.get(item.id);
        if (!drug) {
          console.warn(`Drug with ID ${item.id} not found in database`);
          return null;
        }
        return {
          id: item.id,
          name: drug.name,
          regPrice: Number(drug.regPrice),
          bhisPrice: Number(drug.bhisPrice),
          quantity: item.quantity,
          regTotal: item.quantity * Number(drug.regPrice),
          bhisTotal: item.quantity * Number(drug.bhisPrice),
        };
      })
      .filter((item): item is DetailedCartItem => item !== null); // Type guard to ensure non-null

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