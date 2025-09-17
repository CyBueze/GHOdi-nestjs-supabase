import { Injectable } from '@nestjs/common';
import {Request} from "express"
import {DrugsService} from './drugs/drugs.service'

@Injectable()
export class AppService {
  constructor(private readonly drugsService: DrugsService){}
  
  async getHomePage(req: Request){
    if(!req.session.cart){
      req.session.cart = []
    }
    
    const cart = req.session.cart
    const drugs = await this.drugsService.findAll()
    return {drugs, cart}
  }
}
