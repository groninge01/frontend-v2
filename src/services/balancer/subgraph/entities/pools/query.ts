import { POOLS } from '@/constants/pools';
import { merge } from 'lodash';

const defaultArgs = {
  first: 1000,
  orderBy: 'totalLiquidity',
  orderDirection: 'desc'
  /*where: {
    totalShares_gt: 0.01,
    id_not_in: POOLS.BlockList,
    poolType_not: 'Element'
  }*/
};

const defaultAttrs = {
  id: true,
  name: true,
  address: true,
  poolType: true,
  swapFee: true,
  tokensList: true,
  totalLiquidity: true,
  totalSwapVolume: true,
  totalSwapFee: true,
  totalShares: true,
  owner: true,
  factory: true,
  amp: true,
  createTime: true,
  swapEnabled: true,
  wrappedIndex: true,
  mainIndex: true,
  lowerTarget: true,
  upperTarget: true,
  tokens: {
    name: true,
    symbol: true,
    decimals: true,
    address: true,
    balance: true,
    weight: true,
    priceRate: true
  }
};

export default (args = {}, attrs = {}) => ({
  pools: {
    ...merge({}, defaultAttrs, attrs)
  }
});

export const pastPoolsQuery = (args = {}, attrs = {}) => ({
  poolsPastPools: {
    ...merge({}, defaultAttrs, attrs)
  }
});
