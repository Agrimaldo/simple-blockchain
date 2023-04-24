import { createHash } from 'crypto';

import { Transaction } from './transaction.class';

export class Block {
  readonly TimeStamp: Date;
  Nonce: number;
  PreviousHash: string;
  Transactions: Transaction[];
  Hash: string;

  constructor(timeStamp: Date, transactions: Transaction[], previousHash: string = '') {
    this.TimeStamp = timeStamp;
    this.Nonce = 0;
    this.Transactions = transactions;
    this.PreviousHash = previousHash;
    this.Hash = this.createHash();
  }

  createHash(): string {
    const rawData: string = `${this.PreviousHash}+${this.TimeStamp.toString()}+${this.Transactions}+${this.Nonce}`;
    return createHash('sha256').update(rawData).digest('hex');
  }

  mineBlock(proofOfWorkDifficulty: number): void {
    const hashValidationTemplate: string = `0${proofOfWorkDifficulty}`;
    while (this.Hash.substring(0, proofOfWorkDifficulty) != hashValidationTemplate) {
      this.Nonce++;
      this.Hash = this.createHash();
    }
    console.log(`Blocked with hash ='${this.Hash}' successfully mined! `);
  }
}