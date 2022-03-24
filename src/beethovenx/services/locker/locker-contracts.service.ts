import { Config } from '@/lib/config';
import { JsonRpcProvider } from '@ethersproject/providers';
import { configService as _configService } from '@/services/config/config.service';
import { rpcProviderService as _rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import Locker from '@/beethovenx/services/locker/contracts/locker';
import { default as LockerAbi } from '@/beethovenx/abi/FBeetsLocker.json';

export default class LockerContractsService {
  config: Config;
  provider: JsonRpcProvider;
  locker: Locker;

  constructor(
    readonly configService = _configService,
    readonly rpcProviderService = _rpcProviderService
  ) {
    this.provider = this.rpcProviderService.jsonProvider;
    this.config = this.configService.network;

    // Init contracts
    this.locker = new Locker(this);
  }

  // Combine all the ABIs and remove duplicates
  public get allABIs() {
    return Object.values(
      Object.fromEntries([...LockerAbi].map(row => [row.name, row]))
    );
  }
}

export const lockerContractsService = new LockerContractsService();
