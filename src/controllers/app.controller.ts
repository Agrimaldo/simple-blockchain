import { Controller, Get, Headers } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AppService } from 'src/services/app.service';

@ApiTags('Main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('genesis-block')
  getGenesisBlock() {
    return this.appService.GetGenesisBlock();
  }

  @Get('last-block')
  getLastBlock() {
    return this.appService.GetLastBlock();
  }

  @Get('send-coin')
  @ApiHeader({ name: 'Sender', required: true })
  @ApiHeader({ name: 'Receiver', required: true })
  @ApiHeader({ name: 'Amount', required: true })
  @ApiHeader({ name: 'Fee', required: true })
  getSendCoin(
    @Headers('Sender') Sender: string,
    @Headers('Receiver') Receiver: string,
    @Headers('Amount') Amount: number,
    @Headers('Fee') Fee: number
  ) {
    return this.appService.SendCoin(Sender, Receiver, Amount, Fee);
  }

  @Get('create-block')
  getCreateBlock() {
    return this.appService.CreateBlock();
  }

  @Get('check-balance')
  @ApiHeader({ name: 'Address', required: true })
  getCheckBalance(@Headers('Address') Address: string) {
    return this.appService.GetBalance(Address);
  }

  @Get('transaction-history')
  @ApiHeader({ name: 'Address', required: true })
  getTransactionHistory(@Headers('Address') Address: string) {
    return this.appService.GetHistory(Address);
  }

  @Get('blockchain-explorer')
  getBlockchainExplorer() {
    return this.appService.ShowBlockchain();
  }
}
