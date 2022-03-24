import useWeb3 from '@/services/web3/useWeb3';
import { governanceContractsService } from '@/beethovenx/services/governance/governance-contracts.service';
import { erc20ContractService } from '@/beethovenx/services/erc20/erc20-contracts.service';
import useLockerQuery from '@/beethovenx/composables/locker/useLockerQuery';
import { computed } from 'vue';
import useTransactions from '@/composables/useTransactions';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import usePools from '@/composables/pools/usePools';
import { DecoratedFarm } from '@/beethovenx/services/subgraph/subgraph-types';
import BigNumber from 'bignumber.js';

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
  const totalLockedUsd = computed(
    () => data.value?.locker.totalLockedUsd ?? bn(0)
  );
  const totalLockedPercentage = computed(
    () => data.value?.locker.totalLockedPercentage ?? bn(0)
  );
  const timestamp = computed(() => data.value?.locker.timestamp ?? bn(0));
  const block = computed(() => data.value?.locker.block ?? bn(0));

  return {
    lockerDataLoading,
    totalLockedAmount,
    totalLockedUsd,
    totalLockedPercentage,
    timestamp,
    block
  };
}
