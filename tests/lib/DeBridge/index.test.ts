import chalk from 'chalk';
import { protocols } from '../../../src/config';
import { ProtocolParserUtils } from '../../index';
import { DEBRIDGE_VERSIONS, debridgeTestData } from './data';

describe('DeBridgeParser', () => {
  let utils: ProtocolParserUtils;

  beforeAll(async () => {
    utils = new ProtocolParserUtils(protocols.debridge.identifier);
    await utils.initialize();
  });

  it('is correctly defined', () => {
    utils.isValidProtocol();
  });

  it('should parse v1 transactions correctly', async () => {
    const v1Transactions = debridgeTestData[DEBRIDGE_VERSIONS.V1];

    for (const transaction of v1Transactions) {
      const actions = await utils.fetchAndParseTestTxn(transaction);
      utils.assertTestTransactionForData(transaction, actions);

      console.log(
        chalk.green('Successfully parsed transaction with actions:', actions.map((action) => action.type).join(',')),
        'and hash:',
        transaction.txnHash
      );
    }
  });
});