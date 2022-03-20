<script setup lang="ts">
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import LockerClaimRewardsCard from '@/beethovenx/components/pages/locker/LockerClaimRewardsCard.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import useNumbers from '@/composables/useNumbers';
import { computed } from 'vue';
import FarmStatCardsLoading from '@/beethovenx/components/pages/farm/FarmStatCardsLoading.vue';

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

const { appNetworkConfig } = useWeb3();
const { fNum } = useNumbers();

const {
  fbeetsDecoratedFarm,
  totalBptStaked,
  totalSupply,
  totalBeetsStaked,
  pool,
  fBeetsLoading,
  swapApr,
  farmApr,
  fbeetsApr,
  totalApr
} = useFreshBeets();
</script>

<template>
  <div class="grid grid-cols-2 grid-rows-2 sm:grid-flow-col gap-4 mb-6">
    <template v-if="fBeetsLoading">
      <BalLoadingBlock v-for="n in 3" :key="n" class="h-24" />
    </template>
    <template v-else>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          My Voting Power
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(data.lockingUserVotingPower || '0', 'token_fixed') }}
          fBEETS
        </div>
        <div class="truncate">
          ({{ fNum('0.002', 'percent') }} of total locked fBEETS)
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          My Locked Tokens
        </div>
        <div>
          <div class="text-xl font-medium truncate flex items-center">
            {{ fNum('48', 'token_fixed') }}
            fBEETS
          </div>
          <div class="truncate">({{ fNum('51', 'usd') }})</div>
        </div>
      </BalCard>
      <LockerClaimRewardsCard
        class="col-span-2 sm:row-span-2"
        :has-beets-rewards="true"
        :farm-id="appNetworkConfig.fBeets.farmId"
        :token-address="appNetworkConfig.fBeets.poolAddress"
        :pending-beets="data.lockingPendingRewards[0].amount || 0"
        :pending-beets-value="data.lockingPendingRewards[0].amountUsd || 0"
        :pending-reward-token-value="0"
        :pending-reward-token="0"
      />
    </template>
  </div>
</template>
