import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { Main } from 'src/services/main.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docBuilder = new DocumentBuilder().setTitle('Simple Blockchain').setDescription('-----').setVersion('1.0').build();

  const doc = SwaggerModule.createDocument(app, docBuilder);
  SwaggerModule.setup('swagger', app, doc);



  await app.listen(3000);
  const main: Main = new Main();
  //main.startMine();
}
bootstrap();
