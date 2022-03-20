<script setup lang="ts">
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import useNumbers from '@/composables/useNumbers';
import BalLoadingBlock from '@/components/_global/BalLoadingBlock/BalLoadingBlock.vue';
import numeral from 'numeral';
import LockerAprTooltip from '@/beethovenx/components/pages/locker/LockerAprTooltip.vue';

type Props = {
  loading: boolean;
  fBeetsBalance: string;
  bptBalance: string;
  beetsBalance: string;
};

const props = defineProps<Props>();

const { fNum } = useNumbers();

const {
  userStakedFtmBalance,
  userStakedBeetsBalance,
  userStakedBptBalance,
  userFbeetsBalance,
  currentExchangeRate,
  beetsPerShare,
  ftmPerShare,
  fBeetsLoading
} = useFreshBeets();

/**
 * STATE
 */
</script>

<template>
  <BalCard class="mb-4">
    <div class="text-sm text-gray-500 font-medium mb-2">
      APR
    </div>
    <div class="text-xl font-medium truncate flex items-center">
      {{ fNum('0.70', 'percent') }}
      <LockerAprTooltip
        :swap-apr="0.026"
        :farm-apr="0.045"
        :fbeets-apr="0.65"
      />
    </div>
    <div class="my-5">
      <div class="h-1 w-full flex-1 bg-gray-700 rounded-3xl" />
    </div>
    <div class="text-sm text-gray-500 font-medium mb-2">
      Total Locked
    </div>
    <div class="text-xl font-medium truncate flex items-center">
      {{ fNum('1000', 'token-fixed') }} fBEETS
    </div>
    <div class="my-5">
      <div class="h-1 w-full flex-1 bg-gray-700 rounded-3xl" />
    </div>
    <div class="text-sm text-gray-500 font-medium mb-2">
      Total Locked Percentage
    </div>
    <div class="text-xl font-medium truncate flex items-center">
      {{ fNum('0.005', 'percent') }}
    </div>
  </BalCard>
</template>
