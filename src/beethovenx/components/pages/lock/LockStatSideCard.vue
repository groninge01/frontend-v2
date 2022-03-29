<script setup lang="ts">
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import { useLock } from '@/beethovenx/composables/lock/useLock';
import useNumbers from '@/composables/useNumbers';
import BalLoadingBlock from '@/components/_global/BalLoadingBlock/BalLoadingBlock.vue';
import numeral from 'numeral';
import LockAprTooltip from '@/beethovenx/components/pages/lock/LockAprTooltip.vue';

type Props = {
  loading: boolean;
  fBeetsBalance: string;
  bptBalance: string;
  beetsBalance: string;
};

const props = defineProps<Props>();

const { fNum } = useNumbers();

const {
  lockerDataLoading,
  totalLockedAmount,
  totalLockedUsd,
  totalLockedPercentage,
  totalApr
} = useLock();

/**
 * STATE
 */
</script>

<template>
  <template v-if="lockerDataLoading">
    <BalLoadingBlock class="h-24" />
  </template>
  <template v-else>
    <BalCard class="mb-4">
      <div class="text-sm text-gray-500 font-medium mb-2">
        Total APR
      </div>
      <div class="text-xl font-medium truncate flex items-center">
        {{ fNum(totalApr, 'percent') }}
        <LockAprTooltip
          :swap-apr="0.026"
          :farm-apr="0.045"
          :fbeets-apr="0.65"
        />
      </div>
    </BalCard>
    <BalCard>
      <div class="text-sm text-gray-500 font-medium mb-2">
        Total fBEETS in lockers
      </div>
      <div class="text-xl font-medium truncate flex items-center">
        {{ fNum(totalLockedAmount, 'token-fixed') }} fBEETS
      </div>
      <div class="text-md truncate">
        ({{ fNum(totalLockedPercentage, 'percent') }} of total fBEETS)
      </div>
    </BalCard>
  </template>
</template>
