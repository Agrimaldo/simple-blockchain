import { Block } from '../classes/block.class';
import { BlockChain } from '../classes/blockchain.class';
import { Transaction } from '../classes/transaction.class';

export class Main {

  startMine(): void {
    const minerAddress: string = 'miner1';
    const user1Address: string = 'A';
    const user2Address: string = 'B';

    const blockChain: BlockChain = new BlockChain(2, 10);
    blockChain.createTransaction(new Transaction(user1Address, user2Address, 200));
    blockChain.createTransaction(new Transaction(user2Address, user1Address, 10));

    console.log(`Is valid ${blockChain.isValidChain()}`);
    console.log(`------------------------ Start Mining ----------------------`);
    blockChain.mineBlock(minerAddress);

    console.log(`Balance of the miner: ${blockChain.getBalance(minerAddress)}`);
    blockChain.createTransaction(new Transaction(user1Address, user2Address, 5));

    console.log(`------------------------ Start Mining ----------------------`);
    blockChain.mineBlock(minerAddress);
    console.log(`Balance of the miner: ${blockChain.getBalance(minerAddress)}`);
    this.printChain(blockChain);

    console.log(`Hacking the blockchain... `);
    blockChain.Chain[1].Transactions = [new Transaction(user1Address, minerAddress, 150)];
    console.log(`Is valid: ${blockChain.isValidChain()}`);

  }

  private printChain(blockChain: BlockChain): void {
    console.log(`------------------------ Start BlockChain ---------------------------------------`);
    blockChain.Chain.forEach((block: Block) => {
      console.log(`------------------------ Start Block ---------------------------------------------`);
      console.log(`Hash ${block.Hash}`);
      console.log(`Previous Hash ${block.PreviousHash}`);

      console.log(`------------------------ Start Transactions ---------------------------------------`);
      block.Transactions.forEach((transaction: Transaction) => {
        console.log(`From ${transaction.From} To ${transaction.To} Amount ${transaction.Amount}`);

      });
      console.log(`-------------------------- End Transactions ---------------------------------------`);
      console.log(`-------------------------- End Block ---------------------------------------------`);
    });
    console.log(`-------------------------- End BlockChain ---------------------------------------`);
  }
}