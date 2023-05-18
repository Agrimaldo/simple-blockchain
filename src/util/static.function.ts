import { createHash } from 'crypto';
import { Block } from 'src/schema/block.schema';
import { Transaction } from 'src/schema/transaction.schema';

export class StaticFunction {

  static createHash(block: Block): string {
    const rawData: string = `${block.PreviousHash}+${block.TimeStamp.toString()}+${JSON.stringify(block.Transactions)}+${block.Height}`;
    return createHash('sha256').update(rawData).digest('hex');
  }

  static mineBlock(block: Block, proofOfWorkDifficulty: number): void {
    const hashValidationTemplate: string = `0${proofOfWorkDifficulty}`;
    while (block.Hash.substring(0, proofOfWorkDifficulty) != hashValidationTemplate) {
      block.Height++;
      block.Hash = this.createHash(block);
    }
    console.log(`Blocked with hash ='${block.Hash}' successfully mined! `);
  }

  static BlockGenesis(): Block {
    const timeStamp: Date = new Date(2019, 10, 24);
    const genesisTrx: Transaction = new Transaction({ Message: 'Genesis Block created by P.HC  on 2019 10 24' });
    const prevHash = Buffer.from('-', 'binary').toString('base64');
    const block: Block = new Block({ Height: 1, TimeStamp: timeStamp, PreviousHash: prevHash, Transactions: [genesisTrx], Creator: 'System' });
    block.Hash = this.createHash(block);
    return block;
  }
}