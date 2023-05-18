import { Injectable } from '@nestjs/common';
import { Block } from 'src/schema/block.schema';
import { Transaction } from '../schema/transaction.schema';
import { StaticFunction } from '../util/static.function';

@Injectable()
export class BlockChain {
  readonly ProofOfWorkDifficulty: number;
  readonly MiningReward: number;
  private PendingTransactions: Transaction[];
  Chain: Block[];

  constructor(proofOfWorkDifficulty: number, miningReward: number) {
    this.ProofOfWorkDifficulty = proofOfWorkDifficulty;
    this.MiningReward = miningReward;
    this.PendingTransactions = [];
    this.Chain = [this.createGenesisBlock()];
  }

  createTransaction(transaction: Transaction): void {
    this.PendingTransactions.push(transaction);
  }

  mineBlock(minerAddress: string): void {
    const minerRewardTransaction: Transaction = new Transaction({ Sender: null, Receiver: minerAddress, Amount: 0, Fee: this.MiningReward });
    this.PendingTransactions.push(minerRewardTransaction);
    const block: Block = new Block({ TimeStamp: new Date(), Transactions: this.PendingTransactions });
    StaticFunction.mineBlock(block, this.ProofOfWorkDifficulty);
    block.PreviousHash = this.Chain[this.Chain.length - 1].Hash;
    this.Chain.push(block);
    this.PendingTransactions = [];
  }

  isValidChain(): boolean {
    for (let i = 1; i < this.Chain.length; i++) {
      const previvousBlock = this.Chain[i - 1];
      const currentBlock = this.Chain[i];

      if (currentBlock.Hash != StaticFunction.createHash(currentBlock))
        return false;

      if (currentBlock.PreviousHash != previvousBlock.Hash)
        return false;

    }

    return true;
  }

  getBalance(address: string): number {
    let balance: number = 0;
    this.Chain.forEach((block: Block) => {
      block.Transactions.forEach((transaction: Transaction) => {
        if (transaction.Sender == address) {
          balance -= transaction.Amount;
        }

        if (transaction.Receiver == address) {
          balance += transaction.Amount;
        }
      });
    });

    return balance;
  }

  GetBalance(address: string): number {
    let balance: number = 0;

    this.Chain.forEach((block: Block) => {
      block.Transactions.forEach((transaction: Transaction) => {
        if (transaction.Sender == address) {
          balance -= transaction.Amount;
        }

        if (transaction.Receiver == address) {
          balance += transaction.Amount;
        }
      });
    });

    return balance;
  }

  private createGenesisBlock(): Block {
    const transactions: Transaction[] = [new Transaction({ Sender: '', Receiver: '', Amount: 0, Fee: 0 })]
    return new Block({ TimeStamp: new Date(), Transactions: transactions, PreviousHash: '0' });
  }
}