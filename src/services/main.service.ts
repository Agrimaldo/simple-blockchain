import { Block } from 'src/schema/block.schema';
import { BlockChain } from '../classes/blockchain.class';
import { Transaction } from '../schema/transaction.schema';

export class Main {

  startMine(): void {
    const minerAddress: string = 'miner1';
    const user1Address: string = 'A';
    const user2Address: string = 'B';

    const blockChain: BlockChain = new BlockChain(2, 10);
    blockChain.createTransaction(new Transaction({ Sender: user1Address, Receiver: user2Address, Amount: 200, Fee: Math.round(200 / 10) }));
    blockChain.createTransaction(new Transaction({ Sender: user2Address, Receiver: user1Address, Amount: 10, Fee: Math.round(10 / 10) }));

    console.log(`Is valid ${blockChain.isValidChain()}`);
    console.log(`------------------------ Start Mining ----------------------`);
    blockChain.mineBlock(minerAddress);

    console.log(`Balance of the miner: ${blockChain.getBalance(minerAddress)}`);
    blockChain.createTransaction(new Transaction({ Sender: user1Address, Receiver: user2Address, Amount: 5, Fee: 1 }));

    console.log(`------------------------ Start Mining ----------------------`);
    blockChain.mineBlock(minerAddress);
    console.log(`Balance of the miner: ${blockChain.getBalance(minerAddress)}`);
    this.printChain(blockChain);

    console.log(`Hacking the blockchain... `);
    blockChain.Chain[1].Transactions = [new Transaction({ Sender: user1Address, Receiver: minerAddress, Amount: 150, Fee: 10 })];
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
        console.log(`From ${transaction.Sender} To ${transaction.Receiver} Amount ${transaction.Amount}`);

      });
      console.log(`-------------------------- End Transactions ---------------------------------------`);
      console.log(`-------------------------- End Block ---------------------------------------------`);
    });
    console.log(`-------------------------- End BlockChain ---------------------------------------`);
  }
}