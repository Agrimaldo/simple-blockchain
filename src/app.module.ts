import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './controllers/app.controller';
import { Block, BlockSchema } from './schema/block.schema';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { AppService } from './services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forFeature([
      { name: Block.name, schema: BlockSchema },
      //{ name: Transaction.name, schema: TransactionSchema },
      { name: Transaction.name, schema: TransactionSchema, collection: `${Transaction.name.toLowerCase()}-pool` },
    ]),
    MongooseModule.forRoot(process.env.MONGO_DB),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
