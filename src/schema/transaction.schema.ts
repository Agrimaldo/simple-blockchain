import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Transaction {
  constructor(transaction?: Partial<Transaction>) {
    this.TimeStamp = transaction.TimeStamp || new Date();
    this.Sender = transaction.Sender || '';
    this.Receiver = transaction.Receiver || '';
    this.Amount = transaction.Amount || 0;
    this.Fee = transaction.Fee || 0;
    this.Message = transaction.Message || '';
  }

  @Prop()
  Sender: string | null;
  @Prop()
  Receiver: string;
  @Prop()
  Amount: number;
  @Prop()
  Fee: number;
  @Prop()
  Message: string;
  @Prop()
  TimeStamp: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
export type TransactionDocument = Transaction & Document;