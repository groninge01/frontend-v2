import Service from '@/services/balancer/contracts/balancer-contracts.service';
import ConfigService from '@/services/config/config.service';
import { call, Multicaller } from '@/lib/utils/balancer/contract';
import { default as LockerAbi } from '@/beethovenx/abi/FBeetsLocker.json';
import { default as ERC20Abi } from '@/lib/abi/ERC20.json';
import { BigNumber } from 'ethers';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { Web3Provider } from '@ethersproject/providers';

export default class Locker {
  service: Service;

  constructor(service, private readonly configService = new ConfigService()) {
    this.service = service;
  }

  public async lock(provider: Web3Provider, amount: string, account: string) {
    return sendTransaction(provider, this.lockerAddress, LockerAbi, 'lock', [
      account,
      BigNumber.from(amount)
    ]);
  }

  public async relock(provider: Web3Provider) {
    return sendTransaction(
      provider,
      this.lockerAddress,
      LockerAbi,
      'processExpiredLocks',
      [true]
    );
  }

  public async withdraw(provider: Web3Provider) {
    return sendTransaction(
      provider,
      this.lockerAddress,
      LockerAbi,
      'processExpiredLocks',
      [false]
    );
  }

  public async getReward(provider: Web3Provider) {
    return sendTransaction(
      provider,
      this.lockerAddress,
      LockerAbi,
      'getReward',
      []
    );
  }

  // public async leave(provider: Web3Provider, amount: string) {
  //   return sendTransaction(
  //     provider,
  //     this.fbeetsAddress,
  //     LockerAbi,
  //     'leave',
  //     [BigNumber.from(amount)]
  //   );
  // }

  public get fbeetsAddress(): string {
    return this.service.config.fBeets.address || '';
  }
  public get lockerAddress(): string {
    return this.service.config.fBeets.lockerAddress || '';
  }
}
