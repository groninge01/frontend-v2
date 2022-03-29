<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';
import LockTable from './LockTable.vue';
import { flatten } from 'lodash';

type Props = {
  locks: any;
  loading: boolean;
};

const props = defineProps<Props>();

const { appNetworkConfig } = useWeb3();
import useLockUserQuery from '@/beethovenx/composables/lock/useLockUserQuery';
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
const lockUserQuery = useLockUserQuery();

/**
 * COMPUTED
 */
const lockingPeriods = computed(() =>
  lockUserQuery.data.value
    ? lockUserQuery.data.value.gqlData.lockingUser.lockingPeriods.filter(
        period => !period.withdrawn
      )
    : []
);
</script>

<template>
  <LockTable
    :locking-periods="lockingPeriods"
    :is-loading="loading"
    no-results-label="You have no locked or unlocked tokens in your locker."
  />
</template>
