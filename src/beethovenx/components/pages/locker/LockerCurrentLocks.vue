<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';

type Props = {
  locks: any;
  loading: boolean;
};

const props = defineProps<Props>();

const { appNetworkConfig } = useWeb3();
const { freshBeetsQuery } = useFreshBeets();
const farmUserQuery = useFarmUserQuery(appNetworkConfig.fBeets.farmId);

function epochToDate(epoch): Date {
  const twelveWeeksInSeconds = 12 * 7 * 24 * 60 * 60 * 1000;
  const date = new Date(epoch * 1000 + twelveWeeksInSeconds);
  console.log(date);
  return date;
}

function handleFarmDeposit(txReceipt): void {
  freshBeetsQuery.refetch.value();
  farmUserQuery.refetch.value();
}
</script>

<template>
  <BalCard v-for="(lock, index) in locks" :key="index" class="mb-2">
    {{ lock.lockAmount }}
    {{ epochToDate(lock.epoch) }}
    <template v-slot:footer>
      <BalBtn :disabled="props.disabled" size="sm">
        <div class="w-28">
          Relock
        </div>
      </BalBtn>
    </template>
  </BalCard>
</template>
