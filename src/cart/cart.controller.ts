import { Controller, Param, Body, Req, Get, Post, Render } from '@nestjs/common';
import {CartService, DetailedCartItem} from './cart.service'
import {Request} from "express"

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService){}
  
  @Post("/add/:id")
  @Render("partials/cartCount")
  addToCart(
    @Param("id") id: string,
    @Body("quantity") quantity: number,
    @Req() req: Request
    ){
    return this.cartService.addToCart(+id, +quantity, req)
  }
  
  @Render("pages/cartPage")
  @Get("")
  async getCart(@Req() req: Request): Promise<{
    cart: DetailedCartItem[];
    regSum: number;
    bhisSum: number;
  }>{
    return this.cartService.getCart(req)
  }
}
