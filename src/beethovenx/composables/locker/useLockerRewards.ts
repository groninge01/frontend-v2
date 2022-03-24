import useWeb3 from '@/services/web3/useWeb3';
import { governanceContractsService } from '@/beethovenx/services/governance/governance-contracts.service';
import { erc20ContractService } from '@/beethovenx/services/erc20/erc20-contracts.service';
import useLockerRewardsQuery from '@/beethovenx/composables/locker/useLockerRewardsQuery';
import { computed } from 'vue';
import useTransactions from '@/composables/useTransactions';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import usePools from '@/composables/pools/usePools';
import { DecoratedFarm } from '@/beethovenx/services/subgraph/subgraph-types';
import BigNumber from 'bignumber.js';

function bn(num: number | string) {
  return new BigNumber(num);
}

export function useLockerRewards() {
  const lockerRewardsQuery = useLockerRewardsQuery();
  const { isLoading, data } = lockerRewardsQuery;

  const lockerRewardDataLoading = computed(() => isLoading.value);

  const rewards = computed(() => data.value?.lockingPendingRewards);

  return {
    lockerRewardDataLoading,
    rewards
  };
}
