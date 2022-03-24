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
  const { getProvider, appNetworkConfig } = useWeb3();
  const { addTransaction } = useTransactions();
  const lockerQuery = useLockerQuery();
  const { isLoading, data, refetch } = lockerQuery;

  const lockerDataLoading = computed(() => isLoading.value);

  const totalLockedAmount = computed(
    () => data.value?.gqlData.locker.totalLockedAmount
  );
  const totalLockedUsd = computed(
    () => data.value?.gqlData.locker.totalLockedUsd
  );
  const totalLockedPercentage = computed(
    () => data.value?.gqlData.locker.totalLockedPercentage
  );
  const timestamp = computed(() => data.value?.gqlData.locker.timestamp);
  const block = computed(() => data.value?.gqlData.locker.block);

  const totalApr = computed(() => {
    const tokens = data.value?.gqlData.lockingRewardTokens;
    return sumBy(tokens, token => parseFloat(token.apr));
  });

  const userAllowance = computed(
    () => data.value?.contractData.allowance.div(1e18) ?? bn(0)
  );

  async function approve(amount?: string) {
    const tx = await erc20ContractService.erc20.approveToken(
      getProvider(),
      lockerContractsService.locker.lockerAddress,
      lockerContractsService.locker.fbeetsAddress,
      amount
    );

    addTransaction({
      id: tx.hash,
      type: 'tx',
      action: 'approve',
      summary: `Approve token`,
      details: {
        contractAddress: lockerContractsService.locker.lockerAddress,
        spender: lockerContractsService.locker.fbeetsAddress
      }
    });

    return tx;
  }

  async function lock(amount: string) {
    const tx = await lockerContractsService.locker.lock(getProvider(), amount);

    addTransaction({
      id: tx.hash,
      type: 'tx',
      action: 'lock',
      summary: 'Lock fBEETS',
      details: {
        contractAddress: lockerContractsService.locker.lockerAddress,
        spender: lockerContractsService.locker.fbeetsAddress
      }
    });

    return tx;
  }

  return {
    lockerDataLoading,
    totalLockedAmount,
    totalLockedUsd,
    totalLockedPercentage,
    timestamp,
    block,
    totalApr,
    userAllowance,
    refetch,
    approve,
    lock
  };
}
