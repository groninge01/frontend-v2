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
  lockingUserVotingPower
} = useLockerUser();

const { rewards } = useLockerRewards();
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
          {{ fNum(lockingUserVotingPower || '0', 'token') }}
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
            {{ fNum(totalLockedAmount, 'token') }}
            fBEETS
          </div>
          <div class="truncate">({{ fNum(totalLockedAmountUsd, 'usd') }})</div>
        </div>
      </BalCard>
      <LockerClaimRewardsCard
        class="col-span-2 sm:row-span-2"
        :has-beets-rewards="true"
        :farm-id="appNetworkConfig.fBeets.farmId"
        :token-address="appNetworkConfig.fBeets.poolAddress"
        :pending-beets="rewards[0].amount || 100"
        :pending-beets-value="rewards[0].amountUsd || 100"
        :pending-reward-token-value="0"
        :pending-reward-token="0"
      />
    </template>
  </div>
</template>
