import useWeb3 from '@/services/web3/useWeb3';
import { lockerContractsService } from '@/beethovenx/services/locker/locker-contracts.service';
import { erc20ContractService } from '@/beethovenx/services/erc20/erc20-contracts.service';
import useLockerQuery from '@/beethovenx/composables/locker/useLockerQuery';
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

export function useLocker() {
  const lockerQuery = useLockerQuery();
  const { isLoading, data } = lockerQuery;

  const lockerDataLoading = computed(() => isLoading.value);

  const totalLockedAmount = computed(
    () => data.value?.locker.totalLockedAmount
  );
  const totalLockedUsd = computed(() => data.value?.locker.totalLockedUsd);
  const totalLockedPercentage = computed(
    () => data.value?.locker.totalLockedPercentage
  );
  const timestamp = computed(() => data.value?.locker.timestamp);
  const block = computed(() => data.value?.locker.block);

  const totalApr = computed(() => {
    const tokens = data.value?.lockingRewardTokens;
    return sumBy(tokens, token => parseFloat(token.apr));
  });

  return {
    lockerDataLoading,
    totalLockedAmount,
    totalLockedUsd,
    totalLockedPercentage,
    timestamp,
    block,
    totalApr
  };
}
