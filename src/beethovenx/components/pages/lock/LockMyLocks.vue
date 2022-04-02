<script setup lang="ts">
import LockTable from './LockTable.vue';

import useLockUserQuery from '@/beethovenx/composables/lock/useLockUserQuery';
import { computed } from 'vue';

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
    no-results-label="You have no locked fBEETS."
  />
</template>
