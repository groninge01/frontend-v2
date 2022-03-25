<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import StepContainer from '@/beethovenx/components/containers/StepContainer.vue';
import BalBtn from '@/components/_global/BalBtn/BalBtn.vue';
import LockerWithdrawForm from '@/beethovenx/components/pages/locker/LockerWithdrawForm.vue';
import FreshBeetsWithdrawForm from '@/beethovenx/components/pages/fbeets/FreshBeetsWithdrawForm.vue';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';

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

function handleFarmWithdrawal(txReceipt): void {
  freshBeetsQuery.refetch.value();
  farmUserQuery.refetch.value();
}
</script>

<template>
  <StepContainer
    :step-number="1"
    title="Withdraw ALL your unlocked fBEETS from the fBEETS locker"
    :complete="false"
  >
    <template v-slot:content>
      <LockerWithdrawForm
        :farm-id="appNetworkConfig.fBeets.farmId"
        :token-address="appNetworkConfig.fBeets.address"
        token-name="fBEETS"
        @success="handleFarmWithdrawal($event)"
        :data-loading="props.loading"
      />
    </template>
  </StepContainer>
  <StepContainer
    :step-number="2"
    title="Burn your fBEETS to receive Fidelio Duetto BPTs"
    :complete="props.hasBpt"
  >
    <template v-slot:content>
      <FreshBeetsWithdrawForm :loading="props.loading" />
    </template>
  </StepContainer>
  <StepContainer
    :step-number="3"
    title="Withdraw your BEETS and/or FTM from the Fidelio Duetto pool"
    :complete="false"
  >
    <template v-slot:right>
      <BalBtn
        class="w-40"
        tag="router-link"
        :to="{
          name: 'withdraw',
          params: { id: appNetworkConfig.fBeets.poolId }
        }"
        label="Withdraw"
      />
    </template>
  </StepContainer>
</template>
