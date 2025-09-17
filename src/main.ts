import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan'
import * as expressLayouts from 'express-ejs-layouts';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { join } from 'path';


async function bootstrap() {
  
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is not defined');
  }
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  // logger middleware
  app.use(morgan('dev'))

// somewhere in your initialization file
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );


  // enable layouts
  app.use(expressLayouts);
  app.set('layout', 'layouts/main'); // default layout
  
  const port = process.env.PORT || 3000
  await app.listen(port);
}
bootstrap();
