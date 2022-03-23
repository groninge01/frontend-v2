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

  // async function approve(amount?: string) {
  //   const tx = await erc20ContractService.erc20.approveToken(
  //     getProvider(),
  //     governanceContractsService.fbeets.fbeetsAddress,
  //     governanceContractsService.fbeets.bptTokenAddress,
  //     amount
  //   );

  //   addTransaction({
  //     id: tx.hash,
  //     type: 'tx',
  //     action: 'approve',
  //     summary: `Approve LP token`,
  //     details: {
  //       contractAddress: governanceContractsService.fbeets.bptTokenAddress,
  //       spender: governanceContractsService.fbeets.fbeetsAddress
  //     }
  //   });

  //   return tx;
  // }

  // async function stake(amount: string) {
  //   const tx = await governanceContractsService.fbeets.enter(
  //     getProvider(),
  //     amount
  //   );

  //   addTransaction({
  //     id: tx.hash,
  //     type: 'tx',
  //     action: 'deposit',
  //     summary: 'Stake LP tokens for fBEETS',
  //     details: {
  //       contractAddress: governanceContractsService.fbeets.bptTokenAddress,
  //       spender: governanceContractsService.fbeets.fbeetsAddress
  //     }
  //   });

  //   return tx;
  // }

  // async function unStake(amount: string) {
  //   const tx = await governanceContractsService.fbeets.leave(
  //     getProvider(),
  //     amount
  //   );

  //   addTransaction({
  //     id: tx.hash,
  //     type: 'tx',
  //     action: 'claim',
  //     summary: 'Burn fBEETS and withdraw LP tokens',
  //     details: {
  //       contractAddress: governanceContractsService.fbeets.bptTokenAddress,
  //       spender: governanceContractsService.fbeets.fbeetsAddress
  //     }
  //   });

  //   return tx;
  // }

  return {
    lockerDataLoading,
    totalLockedAmount,
    totalLockedUsd,
    totalLockedPercentage,
    timestamp,
    block

    // approve,
    // stake,
    // unStake
  };
}
