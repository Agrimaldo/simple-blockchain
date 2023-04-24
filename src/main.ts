import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Main } from './blockchain/services/main.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const main: Main = new Main();
  await app.listen(3000);
  main.startMine();
}
bootstrap();
