<script setup lang="ts">
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import LockClaimRewardsCard from '@/beethovenx/components/pages/lock/LockClaimRewardsCard.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { useLockUser } from '@/beethovenx/composables/lock/useLockUser';
import useNumbers from '@/composables/useNumbers';
import { computed } from 'vue';
import FarmStatCardsLoading from '@/beethovenx/components/pages/farm/FarmStatCardsLoading.vue';
import { useLockRewards } from '@/beethovenx/composables/lock/useLockRewards';

const { appNetworkConfig } = useWeb3();
const { fNum } = useNumbers();

const {
  totalLockedAmount,
  totalLockedAmountUsd,
  totalUnlockedAmount,
  totalUnlockedAmountUsd,
  lockingUserVotingPower,
  lockedToVotingPowerRatio
} = useLockUser();

const { rewards } = useLockRewards();
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <template v-if="fBeetsLoading">
      <BalLoadingBlock class="h-24" />
    </template>
    <BalCard class="mb-4">
      <div class="text-sm text-gray-500 font-medium mb-2">
        My Voting Power
        <BalTooltip
          text="An explanation about the voting power. Also include the percentage!"
          icon-size="sm"
          class="ml-2"
        />
      </div>
      <div class="text-xl font-medium truncate flex items-center">
        {{ fNum(lockingUserVotingPower || '0', 'token') }}
        fBEETS
      </div>
      <div class="truncate">
        ({{ fNum(lockedToVotingPowerRatio, 'percent') }})
      </div>

      <div class="my-5">
        <div class="h-1 w-full flex-1 bg-gray-700 rounded-3xl" />
      </div>
      <div class="text-sm text-gray-500 font-medium mb-2">
        My Tokens in Lock
        <BalTooltip
          text="An explanation about this number!"
          icon-size="sm"
          class="ml-2"
        />
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
        <BalTooltip
          text="An explanation about this number!"
          icon-size="sm"
          class="ml-2"
        />
      </div>
      <div class="text-xl font-medium truncate flex items-center">
        {{ fNum(totalUnlockedAmount, 'token') }}
        fBEETS
      </div>
      <div class="truncate">({{ fNum(totalUnlockedAmountUsd, 'usd') }})</div>
    </BalCard>
    <LockClaimRewardsCard
      class="col-span-1 sm:row-span-3"
      :has-beets-rewards="true"
      :farm-id="appNetworkConfig.fBeets.farmId"
      :token-address="appNetworkConfig.fBeets.poolAddress"
      :pending-beets="rewards[0].amount || 100"
      :pending-beets-value="rewards[0].amountUsd || 100"
      :pending-reward-token-value="100"
      :pending-reward-token="100"
    />
  </div>
</template>
