import useWeb3 from '@/services/web3/useWeb3';
import { governanceContractsService } from '@/beethovenx/services/governance/governance-contracts.service';
import { erc20ContractService } from '@/beethovenx/services/erc20/erc20-contracts.service';
import useLockerUserQuery from '@/beethovenx/composables/locker/useLockerUserQuery';
import { computed } from 'vue';
import useTransactions from '@/composables/useTransactions';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import usePools from '@/composables/pools/usePools';
import { DecoratedFarm } from '@/beethovenx/services/subgraph/subgraph-types';
import BigNumber from 'bignumber.js';
import { lockerContractsService } from '@/beethovenx/services/locker/locker-contracts.service';

function bn(num: number | string) {
  return new BigNumber(num);
}

export function useLockerUser() {
  const { getProvider, appNetworkConfig, account } = useWeb3();
  const { addTransaction } = useTransactions();
  const lockerUserQuery = useLockerUserQuery();
  const { isLoading, data, refetch } = lockerUserQuery;

  const lockerUserDataLoading = computed(() => isLoading.value);

  const totalLockedAmount = computed(
    () => data.value?.gqlData.lockingUser.totalLockedAmount
  );
  const totalLockedAmountUsd = computed(
    () => data.value?.gqlData.lockingUser.totalLockedAmountUsd
  );
  const lockingUserVotingPower = computed(
    () => data.value?.gqlData.lockingUserVotingPower
  );

  const userAllowance = computed(
    () => data.value?.fBeetsData.allowance.div(1e18) ?? bn(0)
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

  async function lock(amount: string, account: string) {
    const tx = await lockerContractsService.locker.lock(
      getProvider(),
      amount,
      account
    );

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
    lockerUserDataLoading,
    totalLockedAmount,
    totalLockedAmountUsd,
    lockingUserVotingPower,
    userAllowance,
    refetch,
    approve,
    lock
  };
}
