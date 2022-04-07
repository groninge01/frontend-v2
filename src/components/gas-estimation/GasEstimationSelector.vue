<script setup lang="ts">
/**
 * TYPES
 */

import { useGasEstimates } from '@/beethovenx/composables/gas-estimates/useGasEstimates';
import useGasEstimationState from '@/components/gas-estimation/useGasEstimationState';
import BalLoadingBlock from '@/components/_global/BalLoadingBlock/BalLoadingBlock.vue';
import useNumbers from '@/composables/useNumbers';

const { speeds, gasEstimatesDataLoading } = useGasEstimates();
const { selectedGasPrice, selectedGasPriceKey } = useGasEstimationState();
const { fNum } = useNumbers();

const items = [
  {
    name: 'Slow',
    key: 0
  },
  {
    name: 'Standard',
    key: 1
  },
  {
    name: 'Fast',
    key: 2
  }
];
</script>

<template>
  <div class="font-medium pb-2">
    Gas Price Estimation
    <BalTooltip
      text="To ensure your transactions are processed in a timely manner, select your desired gas price."
      icon-size="sm"
    />
  </div>
  <div class="flex">
    <div
      v-for="(item, i) in items"
      :key="item.key"
      :class="[
        'border rounded-lg p-2 cursor-pointer flex-1 select-none',
        i === items.length - 1 ? '' : 'mr-2',
        selectedGasPriceKey === item.key ? 'bg-white' : 'border-gray-700'
      ]"
      @click="
        () => {
          selectedGasPriceKey = item.key;
          selectedGasPrice = speeds ? speeds[item.key].gasPrice : null;
        }
      "
    >
      <div
        :class="[
          'text-center font-normal',
          selectedGasPriceKey === item.key ? 'text-black' : 'text-gray-200'
        ]"
      >
        {{ item.name }}
      </div>

      <BalLoadingBlock
        v-if="gasEstimatesDataLoading"
        class="h-6 my-1"
        :white="selectedGasPriceKey !== item.key"
      />
      <template v-else>
        <div
          :class="[
            'text-center text-xl my-1',
            selectedGasPriceKey === item.key ? 'text-black font-bold' : ''
          ]"
        >
          {{ fNum(speeds[item.key].gasPrice, 'two_decimals') }}<br />Gwei
        </div>
        <div
          :class="[
            'text-center',
            selectedGasPriceKey === item.key ? 'text-gray-800' : 'text-gray-400'
          ]"
        >
          ~{{ fNum(speeds[item.key].estimatedFee, 'usd_s') }}
        </div>
      </template>
    </div>
  </div>
</template>
