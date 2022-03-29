<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import useWeb3 from '@/services/web3/useWeb3';
import { fNum } from '@/composables/useNumbers';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import { scaleDown } from '@/lib/utils';
import { BigNumber } from 'bignumber.js';
import LockHeader from '@/beethovenx/components/pages/lock/LockHeader.vue';
import LockStatSideCard from '@/beethovenx/components/pages/lock/LockStatSideCard.vue';
import LockStatCards from '@/beethovenx/components/pages/lock/LockStatCards.vue';
import LockMyLocks from '@/beethovenx/components/pages/lock/LockMyLocks.vue';
import BalTabs from '@/components/_global/BalTabs/BalTabs.vue';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';
import LockDepositSteps from '@/beethovenx/components/pages/lock/LockDepositSteps.vue';
import LockWithdrawSteps from '@/beethovenx/components/pages/lock/LockWithdrawSteps.vue';
import LockRelockSteps from '@/beethovenx/components/pages/lock/LockRelockSteps.vue';
import useTokens from '@/composables/useTokens';
import { getAddress } from '@ethersproject/address';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import usePoolWithFarm from '@/beethovenx/composables/pool/usePoolWithFarm';
import BalAlert from '@/components/_global/BalAlert/BalAlert.vue';
import { useLockUser } from '@/beethovenx/composables/lock/useLockUser';

const { appNetworkConfig, isLoadingProfile } = useWeb3();
const {
  fBeetsLoading,
  userFbeetsBalance,
  userBptTokenBalance,
  userUnstakedFbeetsBalance
} = useFreshBeets();
const {
  balanceFor,
  injectTokens,
  dynamicDataLoading,
  loading: tokensLoading
} = useTokens();
const {
  totalLockedAmount,
  totalLockedAmountUsd,
  totalUnlockedAmount,
  totalUnlockedAmountUsd,
  lockingUserVotingPower,
  lockedToVotingPowerRatio,
  lockingPeriods
} = useLockUser();

const { farmUser, farmUserLoading } = useFarmUser(
  appNetworkConfig.fBeets.farmId
);
const { pool, loadingPool } = usePoolWithFarm(appNetworkConfig.fBeets.poolId);
const fbeetsDeposited = computed(() => {
  const amount = farmUser.value?.amount;

  return amount ? scaleDown(new BigNumber(amount), 18) : new BigNumber(0);
});

const bptBalance = computed(() => {
  return fNum(
    scaleDown(
      new BigNumber(userBptTokenBalance.value.toString()),
      18
    ).toString(),
    'token'
  );
});

const hasUnstakedFbeets = computed(() => userUnstakedFbeetsBalance.value.gt(0));
const hasBpt = computed(() => userBptTokenBalance.value.gt(0));

const beetsBalance = computed(() =>
  fNum(balanceFor(getAddress(appNetworkConfig.addresses.beets)), 'token')
);

onMounted(() => {
  injectTokens([
    appNetworkConfig.fBeets.poolAddress,
    appNetworkConfig.fBeets.address
  ]);
});

const dataLoading = computed(
  () =>
    fBeetsLoading.value ||
    farmUserLoading.value ||
    tokensLoading.value ||
    dynamicDataLoading.value
);

const tabs = [
  { value: 'lock', label: 'Lock' },
  { value: 'relock', label: 'Relock' },
  { value: 'withdraw', label: 'Withdraw' },
  { value: 'my-locker', label: 'My Lock' }
];

const activeTab = ref(tabs[0].value);
</script>

<template>
  <div class="lg:container lg:mx-auto pt-12 md:pt-12">
    <LockHeader />
    <div class="flex justify-center">
      <div class="w-full max-w-3xl">
        <BalAlert
          v-if="userBptTokenBalance.gt(0)"
          title="You have unstaked BPT in your wallet"
          description="Use your BPT's to mint fBEETS and be eligible to earn a portion of Beethoven X Protocol Revenue."
          type="warning"
          size="md"
          class="mb-4"
        />
        <BalAlert
          v-if="userBptTokenBalance.eq(0) && userUnstakedFbeetsBalance.gt(0)"
          title="You have fBEETS in your wallet"
          description="Lock your fBEETS to earn additional rewards and have voting power."
          type="warning"
          size="md"
          class="mb-4"
        />
      </div>
      <div
        class="hidden w-full max-w-xl mx-auto md:mx-0 md:ml-6 md:block md:w-72"
      />
    </div>

    <div class="lg:flex justify-center mb-8">
      <div class="w-full lg:max-w-3xl">
        <div class="mb-6">
          <LockStatCards />
        </div>
        <div class="mb-4">
          <BalTabs v-model="activeTab" :tabs="tabs" no-pad class="-mb-px" />
        </div>
        <LockDepositSteps
          v-if="activeTab === 'lock'"
          :hasBpt="hasBpt"
          :hasUnstakedFbeets="hasUnstakedFbeets"
          :hasStakedFbeets="fbeetsDeposited.gt(0)"
          :loading="dataLoading"
        />
        <LockRelockSteps v-if="activeTab === 'relock'" :loading="dataLoading" />
        <LockWithdrawSteps
          v-if="activeTab === 'withdraw'"
          :hasBpt="hasBpt"
          :hasUnstakedFbeets="hasUnstakedFbeets"
          :hasStakedFbeets="fbeetsDeposited.gt(0)"
          :loading="dataLoading"
        />
        <LockMyLocks
          v-if="activeTab === 'my-locker'"
          :loading="dataLoading"
          :locks="lockingPeriods"
        />
      </div>
      <div class="w-full lg:max-w-xl mx-auto md:mx-0 lg:ml-6 md:block lg:w-72">
        <LockStatSideCard
          :loading="dataLoading"
          :f-beets-balance="userFbeetsBalance"
          :bpt-balance="bptBalance"
          :beets-balance="beetsBalance"
        />
      </div>
    </div>
  </div>
</template>
