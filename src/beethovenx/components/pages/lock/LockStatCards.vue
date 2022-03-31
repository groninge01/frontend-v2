<script setup lang="ts">
import LockClaimRewardsCard from '@/beethovenx/components/pages/lock/LockClaimRewardsCard.vue';
import LockMyStatsCard from '@/beethovenx/components/pages/lock/LockMyStatsCard.vue';
import LockTotalStatsCard from '@/beethovenx/components/pages/lock/LockTotalStatsCard.vue';
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <LockMyStatsCard />
    <LockClaimRewardsCard />
    <LockTotalStatsCard />
  </div>
</template>
