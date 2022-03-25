<script setup lang="ts">
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import LockerClaimRewardsCard from '@/beethovenx/components/pages/locker/LockerClaimRewardsCard.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { useLockerUser } from '@/beethovenx/composables/locker/useLockerUser';
import useNumbers from '@/composables/useNumbers';
import { computed } from 'vue';
import FarmStatCardsLoading from '@/beethovenx/components/pages/farm/FarmStatCardsLoading.vue';
import { useLockerRewards } from '@/beethovenx/composables/locker/useLockerRewards';

const { appNetworkConfig } = useWeb3();
const { fNum } = useNumbers();

const {
  totalLockedAmount,
  totalLockedAmountUsd,
  totalUnlockedAmount,
  totalUnlockedAmountUsd,
  lockingUserVotingPower,
  lockedToVotingPowerRatio
} = useLockerUser();

const { rewards } = useLockerRewards();
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="justify-items-stretch">
      <template v-if="fBeetsLoading">
        <BalLoadingBlock class="h-24" />
      </template>
      <BalCard growContent class="mb-4">
        <div class="text-sm text-gray-500 font-medium mb-2">
          My Voting Power
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(lockingUserVotingPower || '0', 'token') }}
          fBEETS
        </div>
        <div class="truncate">
          ({{ fNum(lockedToVotingPowerRatio, 'percent') }} of total locked
          fBEETS)
        </div>

        <div class="my-5">
          <div class="h-1 w-full flex-1 bg-gray-700 rounded-3xl" />
        </div>
        <div class="text-sm text-gray-500 font-medium mb-2">
          My Locked Tokens
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(totalLockedAmount, 'token') }}
          fBEETS
        </div>
        <div class="truncate">({{ fNum(totalLockedAmountUsd, 'usd') }})</div>
        <div class="my-5">
          <div class="h-1 w-full flex-1 bg-gray-700 rounded-3xl" />
        </div>
        <div class="text-sm text-gray-500 font-medium mb-2">
          My Unlocked Tokens
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(totalUnlockedAmount, 'token') }}
          fBEETS
        </div>
        <div class="truncate">({{ fNum(totalUnlockedAmountUsd, 'usd') }})</div>
      </BalCard>
    </div>
    <LockerClaimRewardsCard
      class="col-span-1 sm:row-span-3"
      :has-beets-rewards="true"
      :farm-id="appNetworkConfig.fBeets.farmId"
      :token-address="appNetworkConfig.fBeets.poolAddress"
      :pending-beets="rewards[0].amount || 100"
      :pending-beets-value="rewards[0].amountUsd || 100"
      :pending-reward-token-value="0"
      :pending-reward-token="0"
    />
  </div>
</template>
