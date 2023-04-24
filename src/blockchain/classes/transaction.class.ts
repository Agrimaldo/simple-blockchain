export class Transaction {
  From: string;
  To: string;
  Amount: number;
  constructor(from: string, to: string, amount: number) {
    this.From = from;
    this.To = to;
    this.Amount = amount;
  }
}