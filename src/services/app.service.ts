import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from 'src/schema/block.schema';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { StaticFunction } from '../util/static.function';

@Injectable()
export class AppService {
  constructor(@InjectModel(Transaction.name) private transactionPoolModel: Model<TransactionDocument>, @InjectModel(Block.name) private blockModel: Model<BlockDocument>) {
    this.Initialize();
  }

  private Initialize(): void {
    //get All BLocks
    setTimeout(async () => {
      const blocks = await this.blockModel.find({}).limit(6).sort({ Height: -1 });
      if (blocks.length < 1) {
        // Create genesis block
        const gnsBlock = StaticFunction.BlockGenesis();
        await this.blockModel.create(gnsBlock);
        // create genesis transaction
        await this.CreateGenesisTransaction();
      }
    }, 500);
  }

  getHello(): string {
    return 'Hello World!';
  }

  async CreateGenesisTransaction(): Promise<void> {
    let newTrx = new Transaction({ TimeStamp: new Date(), Sender: 'system', Receiver: 'ga1', Amount: 1000000, Fee: 0 });
    await this.transactionPoolModel.create(newTrx);

    newTrx = new Transaction({ TimeStamp: new Date(), Sender: 'system', Receiver: 'ga2', Amount: 2000000, Fee: 0 });
    await this.transactionPoolModel.create(newTrx);

    const transactions = await this.transactionPoolModel.find({}).limit(6);

    const lastBlock = await this.blockModel.findOne({}).sort({ _id: -1 });
    const block = new Block({ Height: lastBlock.Height + 1, PreviousHash: lastBlock.Hash, TimeStamp: new Date(), Transactions: transactions });
    block.Hash = StaticFunction.createHash(block);
    await this.blockModel.create(block);
    await this.transactionPoolModel.deleteMany({});
  }

  async GetGenesisBlock(): Promise<Block> {
    return await this.blockModel.findOne({}).sort({ _id: 1 });
  }

  async GetLastBlock(): Promise<Block> {
    return await this.blockModel.findOne({}).sort({ _id: -1 });
  }

  async GetBalance(address: string): Promise<number> {
    let balance: number = 0;
    let spending: number = 0;
    let income: number = 0;

    const blocks = await this.blockModel.find({ $or: [{ 'Transactions.Sender': address }, { 'Transactions.Receiver': address }] });
    blocks.forEach((block: Block) => {
      block.Transactions.forEach((trx: Transaction) => {
        if (address == trx.Sender)
          spending += trx.Amount + trx.Fee;

        if (address == trx.Receiver)
          income += trx.Amount;

        balance = income - spending;
      });
    });

    return balance;
  }

  async GetHistory(address: string): Promise<Transaction[]> {
    const trxs: Transaction[] = [];
    const blocks = await this.blockModel.find({ $or: [{ 'Transactions.Sender': address }, { 'Transactions.Receiver': address }] });
    blocks.forEach((b: Block) => {
      trxs.push.apply(trxs, b.Transactions);
    });
    return trxs;
  }

  async SendCoin(sender: string, receiver: string, amount: number, fee: number): Promise<string> {
    if (isNaN(amount) || isNaN(fee))
      throw new BadRequestException('Amount/Fee is not a numeric value');

    if (fee > (0.5 * amount))
      throw new BadRequestException('inputted the fee to high, max fee 50% of amount');

    const senderBalance = await this.GetBalance(sender);

    if ((amount + fee) > senderBalance) {
      throw new BadRequestException(`Sender (${sender}) don't have enough balance! Current balance: ${senderBalance}`);
    }

    const newTrx = new Transaction({ TimeStamp: new Date(), Sender: sender, Receiver: receiver, Amount: amount, Fee: fee, Message: '' });
    await this.transactionPoolModel.create(newTrx);

    const totalTrx = await this.transactionPoolModel.find({});
    if (totalTrx.length == 6) {
      this.CreateBlock();
    }
    const text: string = `Transaction added to the Pool Sender: ${sender}, Receiver: ${receiver}, Amount: ${amount}$, Fee: ${fee}$`;
    return text;
    console.log(text);
  }

  async CreateBlock(): Promise<Block> {
    const trxPool = await this.transactionPoolModel.find({});
    if (trxPool.length <= 0) {
      throw new BadRequestException(`No transaction in pool, please create transaction first!`);
    }

    const lastBlock = await this.GetLastBlock();
    const newBlock = new Block({ PreviousHash: lastBlock.Hash, Height: lastBlock.Height + 1, Transactions: trxPool });
    newBlock.Hash = StaticFunction.createHash(newBlock);
    const saveResult = await this.blockModel.create(newBlock);
    await this.transactionPoolModel.deleteMany({});

    return saveResult
  }

  async ShowBlockchain(): Promise<Block[]> {
    const blockchain = await this.blockModel.find({});
    return blockchain;
  }
}
