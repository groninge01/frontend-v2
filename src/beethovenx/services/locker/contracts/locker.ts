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

  public async getData(
    account: string
  ): Promise<{
    allowance: BigNumber;
  }> {
    const multicaller = new Multicaller(
      this.configService.network.key,
      this.service.provider,
      LockerAbi
    );

    multicaller.call('allowance', this.lockerAddress, 'allowance', [
      account,
      this.fbeetsAddress
    ]);

    return multicaller.execute();
  }

  // public async getTotalLockerSupply(): Promise<BigNumber> {
  //   return await call(this.service.provider, LockerAbi, [
  //     this.fbeetsAddress,
  //     'totalSupply'
  //   ]);
  // }

  // public async getTotalVestedTokenAmount(): Promise<BigNumber> {
  //   return await call(this.service.provider, LockerAbi, [
  //     this.bptTokenAddress,
  //     'balanceOf',
  //     [this.fbeetsAddress]
  //   ]);
  // }

  // public async fBeetsBalanceOf(account: string): Promise<BigNumber> {
  //   return await call(this.service.provider, LockerAbi, [
  //     this.fbeetsAddress,
  //     'balanceOf',
  //     [account]
  //   ]);
  // }

  // public async bptBalanceOf(account: string): Promise<BigNumber> {
  //   return await call(this.service.provider, ERC20Abi, [
  //     this.bptTokenAddress,
  //     'balanceOf',
  //     [account]
  //   ]);
  // }

  public async lock(provider: Web3Provider, amount: string) {
    return sendTransaction(provider, this.fbeetsAddress, LockerAbi, 'lock', [
      BigNumber.from(amount)
    ]);
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
