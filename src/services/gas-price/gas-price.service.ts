import ConfigService from '../config/config.service';
import BlocknativeProvider from './providers/blocknative.provider';
import PolygonProvider from './providers/polygon.provider';
import { GasPrice } from './providers/types';
import BeethovenxService from '@/beethovenx/services/beethovenx/beethovenx.service';
import { GqlGasEstimatesData } from '@/beethovenx/services/beethovenx/beethovenx-types';

export default class GasPriceService {
  constructor(
    private readonly configService = new ConfigService(),
    private readonly blocknativeProvider = new BlocknativeProvider(),
    private readonly polygonProvider = new PolygonProvider(),
    private readonly beethovenxService = new BeethovenxService()
  ) {}

  public async getLatest(): Promise<GasPrice | null> {
    switch (this.configService.network.key) {
      case '1':
        return await this.blocknativeProvider.getLatest();
      case '137':
        return await this.polygonProvider.getLatest();
      default:
        return null;
    }
  }

  public async getGasPriceEstimation(): Promise<GqlGasEstimatesData | null> {
    switch (this.configService.network.key) {
      case '250':
        return await this.beethovenxService.getGasEstimates();
      default:
        return null;
    }
  }
}
