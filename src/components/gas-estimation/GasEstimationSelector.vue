<script setup lang="ts">
/**
 * TYPES
 */

import { useGasEstimates } from '@/beethovenx/composables/gas-estimates/useGasEstimates';
import useGasEstimationState from '@/components/gas-estimation/useGasEstimationState';
import BalLoadingBlock from '@/components/_global/BalLoadingBlock/BalLoadingBlock.vue';

const { speeds, gasEstimatesDataLoading } = useGasEstimates();
const { selectedGasPrice, selectedGasPriceKey } = useGasEstimationState();

const items = [
  {
    name: 'Slow',
    key: 0,
    estimatedTime: '30-60 secs',
    color: 'text-green-500'
  },
  {
    name: 'Standard',
    key: 1,
    estimatedTime: '10-30 secs',
    color: 'text-blue-500'
  },
  {
    name: 'Fast',
    key: 2,
    estimatedTime: '5-10 secs',
    color: 'text-red-500'
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
      :key="item.id"
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
          'text-center font-medium',
          selectedGasPriceKey === item.key ? 'text-black' : ''
        ]"
      >
        {{ item.name }}
      </div>

      <BalLoadingBlock
        v-if="gasEstimatesDataLoading"
        class="h-6 my-1"
        :white="selectedGasPriceKey !== item.key"
      />
      <div v-else :class="['text-center text-xl my-1 font-medium', item.color]">
        {{ speeds[item.key].gasPrice }} Gwei
      </div>
      <div
        :class="[
          'text-center',
          selectedGasPriceKey === item.key ? 'text-gray-800' : 'text-gray-400'
        ]"
      >
        ({{ item.estimatedTime }})
      </div>
    </div>
    <!--    <div
      class="border rounded-lg border-gray-700 p-2 cursor-pointer flex-1 mr-2"
    >
      <div class="text-center">Fast</div>
      <div class="text-center text-xl my-1 text-blue-500 font-medium">
        {{ estimations?.fastPriceGwei }} Gwei
      </div>
      <div class="text-center text-gray-400">(10-30 secs)</div>
    </div>
    <div class="border rounded-lg border-gray-700 p-2 cursor-pointer flex-1">
      <div class="text-center">Rapid</div>
      <div class="text-center text-xl my-1 text-red-500 font-medium">
        {{ estimations?.rapidPriceGwei }} Gwei
      </div>
      <div class="text-center text-gray-400">(5-10 secs)</div>
    </div>-->
  </div>
</template>
