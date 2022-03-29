<template>
  <BalCard growContent>
    <div class="text-sm text-gray-500 font-medium mb-2">
      My Pending Rewards
    </div>
    <div
      v-if="hasBeetsRewards"
      class="text-xl font-medium truncate flex items-center"
    >
      {{ fNum(pendingBeets, 'token_fixed') }} BEETS
    </div>
    <div
      v-if="hasBeetsRewards"
      class="text-xl font-medium truncate flex items-center"
    >
      {{ fNum('12.5', 'token_fixed') }} USDC
    </div>
    <div
      v-if="hasBeetsRewards"
      class="text-xl font-medium truncate flex items-center"
    >
      {{ fNum('13.8', 'token_fixed') }} FTM
    </div>

    <div class="truncate flex items-center pb-8">
      ({{ fNum(pendingBeetsValue + pendingRewardTokenValue, 'usd') }})
    </div>
    <template v-slot:footer>
      <BalBtn
        label="Claim All"
        block
        color="gradient"
        :disabled="pendingBeets <= 0 && pendingRewardToken <= 0"
        :loading="gettingReward"
        @click.prevent="getLockReward"
      />
    </template>
  </BalCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useNumbers from '@/composables/useNumbers';
import useEthers from '@/composables/useEthers';
import useFarmUser from '@/beethovenx/composables/farms/useFarmUser';
import { useLockUser } from '@/beethovenx/composables/lock/useLockUser';

export default defineComponent({
  name: 'FarmHarvestRewardsCard',

  components: {},

  props: {
    hasBeetsRewards: {
      type: Boolean,
      required: true
    },
    hasThirdPartyRewards: {
      type: Boolean,
      required: true
    },
    pendingBeets: {
      type: Number,
      required: true
    },
    pendingRewardToken: {
      type: Number,
      required: true
    },
    pendingBeetsValue: {
      type: Number,
      required: true
    },
    pendingRewardTokenValue: {
      type: Number,
      required: true
    },
    farmId: {
      type: String,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true
    },
    rewardTokenSymbol: {
      type: String
    }
  },

  setup(props) {
    const { fNum } = useNumbers();
    const { txListener } = useEthers();
    const { getReward } = useLockUser();
    const gettingReward = ref(false);
    const { farmUserRefetch } = useFarmUser(props.farmId);

    async function getLockReward(): Promise<void> {
      gettingReward.value = true;
      const tx = await getReward();

      if (!tx) {
        gettingReward.value = false;
        return;
      }

      txListener(tx, {
        onTxConfirmed: async () => {
          await farmUserRefetch.value();
          gettingReward.value = false;
        },
        onTxFailed: () => {
          gettingReward.value = false;
        }
      });
    }

    return {
      fNum,
      getLockReward,
      gettingReward
    };
  }
});
</script>
