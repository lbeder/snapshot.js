import { BigNumber } from '@ethersproject/bignumber';
import toNumber from 'lodash.tonumber';
import { call } from '../../utils';

export default class Plugin {
  public author = 'lbeder';
  public version = '0.1.0';
  public name = 'Quorum';

  /**
   * Returns the total voting power at specific snapshot
   */
  async getTotalVotingPower(
    web3: any,
    quorumOptions: any,
    snapshot: string | Number
  ) {
    try {
      const { strategy } = quorumOptions;

      switch (strategy) {
        case 'static': {
          return quorumOptions.total;
        }

        case 'balance': {
          const { address, methodABI, decimals } = quorumOptions;

          const blockTag =
            snapshot === 'latest' ? snapshot : toNumber(snapshot);

          const totalVotingPower = await call(
            web3,
            [methodABI],
            [address, methodABI.name],
            { blockTag }
          );

          return BigNumber.from(totalVotingPower)
            .div(BigNumber.from(10).pow(decimals))
            .toNumber();
        }

        default:
          throw new Error(`Unsupported quorum strategy: ${strategy}`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
