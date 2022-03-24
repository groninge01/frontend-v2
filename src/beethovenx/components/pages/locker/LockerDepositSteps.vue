<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import StepContainer from '@/beethovenx/components/containers/StepContainer.vue';
import BalBtn from '@/components/_global/BalBtn/BalBtn.vue';
import FreshBeetsDepositForm from '@/beethovenx/components/pages/fbeets/FreshBeetsDepositForm.vue';
import LockerDepositForm from '@/beethovenx/components/pages/locker/LockerDepositForm.vue';
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

function handleFarmDeposit(txReceipt): void {
  freshBeetsQuery.refetch.value();
  farmUserQuery.refetch.value();
}
</script>

<template>
  <StepContainer
    :step-number="1"
    title="Deposit your BEETS or FTM into the Fidelio Duetto pool"
    :complete="props.hasBpt || props.hasUnstakedFbeets || props.hasStakedFbeets"
  >
    <template v-slot:right>
      <BalBtn
        class="w-40"
        tag="router-link"
        :to="{
          name: 'invest',
          params: { id: appNetworkConfig.fBeets.poolId }
        }"
        label="Deposit"
      />
    </template>
  </StepContainer>
  <StepContainer
    v-if="props.hasBpt"
    :step-number="2"
    title="Use your Fidelio Duetto BPTs to mint fBEETS"
    :complete="props.hasUnstakedFbeets || props.hasStakedFbeets"
  >
    <template v-slot:content>
      <FreshBeetsDepositForm :loading="props.loading" />
    </template>
  </StepContainer>
  <StepContainer
    :step-number="props.hasBpt ? 3 : 2"
    title="Lock your fBEETS in the fBEETS locker"
    :complete="props.hasStakedFbeets"
  >
    <template v-slot:content>
      <LockerDepositForm
        :farm-id="appNetworkConfig.fBeets.farmId"
        :token-address="appNetworkConfig.fBeets.address"
        token-name="fBEETS"
        :data-loading="props.loading"
        @success="handleFarmDeposit($event)"
      />
    </template>
  </StepContainer>
</template>
