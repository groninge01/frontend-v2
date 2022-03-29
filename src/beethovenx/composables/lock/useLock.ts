import useWeb3 from '@/services/web3/useWeb3';
import { lockContractsService } from '@/beethovenx/services/lock/lock-contracts.service';
import { erc20ContractService } from '@/beethovenx/services/erc20/erc20-contracts.service';
import useLockQuery from '@/beethovenx/composables/lock/useLockQuery';
import { computed } from 'vue';
import useTransactions from '@/composables/useTransactions';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import usePools from '@/composables/pools/usePools';
import { DecoratedFarm } from '@/beethovenx/services/subgraph/subgraph-types';
import BigNumber from 'bignumber.js';
import { sumBy } from 'lodash';

function bn(num: number | string) {
  return new BigNumber(num);
}

export function useLock() {
  const lockQuery = useLockQuery();
  const { isLoading, data } = lockQuery;

  const lockDataLoading = computed(() => isLoading.value);

  const totalLockedAmount = computed(() => data.value?.lock.totalLockedAmount);
  const totalLockedUsd = computed(() => data.value?.lock.totalLockedUsd);
  const totalLockedPercentage = computed(
    () => data.value?.lock.totalLockedPercentage
  );
  const timestamp = computed(() => data.value?.lock.timestamp);
  const block = computed(() => data.value?.lock.block);

  const totalApr = computed(() => {
    const tokens = data.value?.lockingRewardTokens;
    return sumBy(tokens, token => parseFloat(token.apr));
  });

  return {
    lockDataLoading,
    totalLockedAmount,
    totalLockedUsd,
    totalLockedPercentage,
    timestamp,
    block,
    totalApr
  };
}
