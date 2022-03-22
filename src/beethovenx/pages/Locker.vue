<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import useWeb3 from '@/services/web3/useWeb3';
import { fNum } from '@/composables/useNumbers';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import { scaleDown } from '@/lib/utils';
import { BigNumber } from 'bignumber.js';
import LockerStatSideCard from '@/beethovenx/components/pages/locker/LockerStatSideCard.vue';
import LockerStatCards from '@/beethovenx/components/pages/locker/LockerStatCards.vue';
import LockerCurrentLocks from '@/beethovenx/components/pages/locker/LockerCurrentLocks.vue';
import BalTabs from '@/components/_global/BalTabs/BalTabs.vue';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';
import LockerDepositSteps from '@/beethovenx/components/pages/locker/LockerDepositSteps.vue';
import LockerWithdrawSteps from '@/beethovenx/components/pages/locker/LockerWithdrawSteps.vue';
import useTokens from '@/composables/useTokens';
import { getAddress } from '@ethersproject/address';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import usePoolWithFarm from '@/beethovenx/composables/pool/usePoolWithFarm';
import BalAlert from '@/components/_global/BalAlert/BalAlert.vue';

// BEGIN DATA

const data = {
  locker: {
    totalLockedAmount: '50',
    totalLockedUsd: '49.98442832648373',
    totalLockedPercentage: '0.005'
  },
  lockingUser: {
    totalLockedAmount: '50',
    totalLockedAmountUsd: '49.98442832648373',
    totalUnlockedAmount: '100.0000000000000005',
    totalUnlockedAmountUsd: '99.9688566529674605',
    lockingPeriods: [
      {
        lockAmount: '0.0000000000000005',
        lockAmountUsd: '0.0000000000000004998442832648373',
        epoch: '1647351600'
      },
      {
        lockAmount: '50',
        lockAmountUsd: '49.98442832648373',
        epoch: '1647535200'
      },
      {
        lockAmount: '50',
        lockAmountUsd: '49.98442832648373',
        epoch: '1647543600'
      }
    ],
    totalClaimedRewardsUsd: '4967.8557900162216298',
    claimedRewards: [
      {
        amount: '4969.4034285714285708',
        amountUsd: '4967.8557900162216298',
        token: '0xa9c0fb44a625c5648bb4df173703682d10b1c68a'
      }
    ],
    totalLostThroughKick: '0.0000000000000005',
    totalLostThroughKickUsd: '0.0000000000000004998442832648373'
  },
  lockingRewardTokens: [
    {
      rewardRate: '1.146991428571428571',
      rewardToken: '0xa9c0fb44a625c5648bb4df173703682d10b1c68a',
      rewardPeriodFinish: '1647536726',
      totalRewardAmount: '6345.793142857142857141',
      totalRewardAmountUsd: '6343.8168504766957303',
      apr: '723925.93412571428544'
    }
  ],
  lockingPendingRewards: [
    {
      amount: '1376.3897142857142852',
      amountUsd: '1375.9610604604740994',
      token: '0xa9c0FB44a625c5648Bb4DF173703682d10B1C68a'
    }
  ],
  lockingUserVotingPower: '50'
};

// END DATA

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
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdraw', label: 'Withdraw' },
  { value: 'locks', label: 'Current Locks' }
];

const activeTab = ref(tabs[0].value);
</script>

<template>
  <div class="lg:container lg:mx-auto pt-12 md:pt-12">
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
          title="You have unlocked fBEETS in your wallet"
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
          <LockerStatCards />
        </div>
        <div class="mb-4">
          <BalTabs v-model="activeTab" :tabs="tabs" no-pad class="-mb-px" />
        </div>
        <LockerCurrentLocks
          v-if="activeTab === 'locks'"
          :loading="dataLoading"
          :locks="data.lockingUser.lockingPeriods"
        />
        <LockerDepositSteps
          v-if="activeTab === 'deposit'"
          :hasBpt="hasBpt"
          :hasUnstakedFbeets="hasUnstakedFbeets"
          :hasStakedFbeets="fbeetsDeposited.gt(0)"
          :loading="dataLoading"
        />
        <LockerWithdrawSteps
          v-if="activeTab === 'withdraw'"
          :hasBpt="hasBpt"
          :hasUnstakedFbeets="hasUnstakedFbeets"
          :hasStakedFbeets="fbeetsDeposited.gt(0)"
          :loading="dataLoading"
        />
      </div>
      <div class="w-full lg:max-w-xl mx-auto md:mx-0 lg:ml-6 md:block lg:w-72">
        <LockerStatSideCard
          :loading="dataLoading"
          :f-beets-balance="userFbeetsBalance"
          :bpt-balance="bptBalance"
          :beets-balance="beetsBalance"
        />
      </div>
    </div>
  </div>
</template>
