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
  const totalUnlockedAmount = computed(
    () => data.value?.gqlData.lockingUser.totalUnlockedAmount
  );
  const totalUnlockedAmountUsd = computed(
    () => data.value?.gqlData.lockingUser.totalUnlockedAmountUsd
  );
  const lockingUserVotingPower = computed(
    () => data.value?.gqlData.lockingUserVotingPower
  );

  const lockedToVotingPowerRatio = computed(
    () => data.value?.gqlData.lockingUser.lockedToVotingPowerRatio
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

  async function getReward() {
    try {
      const provider = getProvider();
      const tx = await lockerContractsService.locker.getReward(provider);

      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'getReward',
        summary: 'Get locker rewards',
        details: {
          contractAddress: lockerContractsService.locker.lockerAddress,
          spender: lockerContractsService.locker.lockerAddress
        }
      });

      return tx;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    lockerUserDataLoading,
    totalLockedAmount,
    totalLockedAmountUsd,
    totalUnlockedAmount,
    totalUnlockedAmountUsd,
    lockingUserVotingPower,
    userAllowance,
    lockedToVotingPowerRatio,
    refetch,
    approve,
    lock,
    getReward
  };
}
