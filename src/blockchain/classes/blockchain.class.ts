import { Block } from './block.class';
import { Transaction } from './transaction.class';

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
    const minerRewardTransaction: Transaction = new Transaction(null, minerAddress, this.MiningReward);
    this.PendingTransactions.push(minerRewardTransaction);
    const block: Block = new Block(new Date(), this.PendingTransactions);
    block.mineBlock(this.ProofOfWorkDifficulty);
    block.PreviousHash = this.Chain[this.Chain.length - 1].Hash;
    this.Chain.push(block);
    this.PendingTransactions = [];
  }

  isValidChain(): boolean {
    for (let i = 1; i < this.Chain.length; i++) {
      const previvousBlock = this.Chain[i - 1];
      const currentBlock = this.Chain[i];

      if (currentBlock.Hash != currentBlock.createHash())
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
        if (transaction.From == address) {
          balance -= transaction.Amount;
        }

        if (transaction.To == address) {
          balance += transaction.Amount;
        }
      });
    });

    return balance;
  }

  private createGenesisBlock(): Block {
    const transactions: Transaction[] = [new Transaction('', '', 0)]
    return new Block(new Date(), transactions, '0');
  }
}