import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from 'mongoose';
import { Transaction } from "./transaction.schema";

@Schema()
export class Block {
  constructor(block?: Partial<Block>) {
    this.TimeStamp = block.TimeStamp || new Date();
    this.Height = block.Height;
    this.PreviousHash = block.PreviousHash;
    this.Hash = block.Hash;
    this.Transactions = block.Transactions || [];
    this.Creator = block.Creator;
  }

  @Prop()
  TimeStamp: Date;
  @Prop()
  Height: number;
  @Prop()
  PreviousHash: string;
  @Prop()
  Hash: string;
  @Prop()
  Transactions: Transaction[];
  @Prop()
  Creator: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
export type BlockDocument = Block & Document;