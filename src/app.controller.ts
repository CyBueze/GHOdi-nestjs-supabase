import { Controller, Get, Render, Req } from '@nestjs/common';
import {Request} from "express"
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("index") 
  async getHomePage(@Req() req: Request) {
    return this.appService.getHomePage(req)
  }
}
