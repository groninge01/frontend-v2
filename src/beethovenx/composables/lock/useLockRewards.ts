import useWeb3 from '@/services/web3/useWeb3';
import { governanceContractsService } from '@/beethovenx/services/governance/governance-contracts.service';
import { erc20ContractService } from '@/beethovenx/services/erc20/erc20-contracts.service';
import useLockRewardsQuery from '@/beethovenx/composables/lock/useLockRewardsQuery';
import { computed } from 'vue';
import useTransactions from '@/composables/useTransactions';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import usePools from '@/composables/pools/usePools';
import { DecoratedFarm } from '@/beethovenx/services/subgraph/subgraph-types';
import BigNumber from 'bignumber.js';

function bn(num: number | string) {
  return new BigNumber(num);
}

export function useLockRewards() {
  const lockRewardsQuery = useLockRewardsQuery();
  const { isLoading, data } = lockRewardsQuery;

  const lockRewardDataLoading = computed(() => isLoading.value);

  const rewards = computed(() => data.value?.lockingPendingRewards);

  return {
    lockRewardDataLoading,
    rewards
  };
}
