<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';
import LockerTable from './LockerTable.vue';
import { flatten } from 'lodash';

type Props = {
  locks: any;
  loading: boolean;
};

const props = defineProps<Props>();

const { appNetworkConfig } = useWeb3();
import useLockerUserQuery from '@/beethovenx/composables/locker/useLockerUserQuery';
import { computed } from 'vue';

function epochToDate(epoch): Date {
  const twelveWeeksInSeconds = 12 * 7 * 24 * 60 * 60 * 1000;
  const date = new Date(epoch * 1000 + twelveWeeksInSeconds);
  console.log(date);
  return date;
}

/**
 * QUERIES
 */
const lockerUserQuery = useLockerUserQuery();

/**
 * COMPUTED
 */
const lockingPeriods = computed(() =>
  lockerUserQuery.data.value
    ? lockerUserQuery.data.value.gqlData.lockingUser.lockingPeriods.filter(
        period => !period.withdrawn
      )
    : []
);
</script>

<template>
  <LockerTable
    :locking-periods="lockingPeriods"
    :is-loading="loading"
    no-results-label="You have no locked or unlocked tokens in your locker."
  />
</template>
