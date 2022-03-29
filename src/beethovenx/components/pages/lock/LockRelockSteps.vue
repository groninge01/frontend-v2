<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import StepContainer from '@/beethovenx/components/containers/StepContainer.vue';
import BalBtn from '@/components/_global/BalBtn/BalBtn.vue';
import LockRelockForm from '@/beethovenx/components/pages/lock/LockRelockForm.vue';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';
import { useLockUser } from '@/beethovenx/composables/lock/useLockUser';

type Props = {
  hasBpt: boolean;
  hasUnstakedFbeets: boolean;
  hasStakedFbeets: boolean;
  loading: boolean;
};

const props = defineProps<Props>();

const { appNetworkConfig } = useWeb3();
const { freshBeetsQuery } = useFreshBeets();
const farmUserQuery = useFarmUserQuery(appNetworkConfig.fBeets.farmId);
const { totalUnlockedAmount } = useLockUser();

function handleFarmWithdrawal(txReceipt): void {
  freshBeetsQuery.refetch.value();
  farmUserQuery.refetch.value();
}
</script>

<template>
  <StepContainer
    :step-number="1"
    title="Relock ALL your unlocked fBEETS back into the fBEETS locker"
    :complete="totalUnlockedAmount === '' || totalUnlockedAmount === '0'"
  >
    <template v-slot:content>
      <LockRelockForm
        :farm-id="appNetworkConfig.fBeets.farmId"
        :token-address="appNetworkConfig.fBeets.address"
        token-name="fBEETS"
        @success="handleFarmWithdrawal($event)"
        :data-loading="props.loading"
      />
    </template>
  </StepContainer>
</template>
