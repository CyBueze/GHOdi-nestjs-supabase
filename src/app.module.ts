import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrugsModule } from './drugs/drugs.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [DrugsModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
