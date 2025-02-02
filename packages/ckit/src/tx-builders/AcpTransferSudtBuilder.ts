import { Address, HexNumber } from '@ckb-lumos/base';
import { CkbTypeScript } from '@ckitjs/base';
import { Transaction } from '@lay2/pw-core';
import { RecipientSameWithSenderError } from '../errors';
import { CkitProvider } from '../providers';
import { AbstractTransactionBuilder } from './AbstractTransactionBuilder';
import { TransferSudtPwBuilder } from './pw/TransferSudtPwBuilder';

export interface RecipientOption {
  readonly recipient: Address;
  readonly sudt: CkbTypeScript;
  amount: HexNumber;
  policy: 'findAcp' | 'createCell' | 'findOrCreate';
}

export interface TransferSudtOptions {
  recipients: RecipientOption[];
}

export class AcpTransferSudtBuilder extends AbstractTransactionBuilder {
  private builder: TransferSudtPwBuilder;

  constructor(private options: TransferSudtOptions, private provider: CkitProvider, private sender: Address) {
    super();
    this.builder = new TransferSudtPwBuilder(options, provider, sender);
  }

  async build(): Promise<Transaction> {
    const transferToSelf = this.options.recipients.find((option) => option.recipient === this.sender);
    if (transferToSelf) throw new RecipientSameWithSenderError({ address: this.sender });

    return this.builder.build();
  }
}
