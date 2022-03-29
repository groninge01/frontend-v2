<template>
  <BalForm ref="relockForm" @on-submit="submit">
    <div class="pt-4">
      <BalBtn
        v-if="!isWalletReady"
        :label="$t('connectWallet')"
        block
        @click.prevent="toggleWalletSelectModal"
      />
      <template v-else>
        <BalBtn
          type="submit"
          :loading-label="loading ? 'Loading' : $t('confirming')"
          color="gradient"
          :disabled="totalUnlockedAmount === '' || totalUnlockedAmount === '0'"
          :loading="relocking || loading"
          block
          @click="trackGoal(Goals.ClickFarmWithdraw)"
        >
          Relock ALL unlocked fBEETS
        </BalBtn>
      </template>
    </div>
  </BalForm>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { FormRef } from '@/types';
import { isRequired } from '@/lib/utils/validations';
import { useI18n } from 'vue-i18n';
import useFathom from '@/composables/useFathom';
import { TOKENS } from '@/constants/tokens';
import useWeb3 from '@/services/web3/useWeb3';
import useTokens from '@/composables/useTokens';
import { BigNumber } from 'bignumber.js';
import useEthers from '@/composables/useEthers';
import BalLoadingBlock from '@/components/_global/BalLoadingBlock/BalLoadingBlock.vue';
import { useLockUser } from '@/beethovenx/composables/lock/useLockUser';

type DataProps = {
  relockForm: FormRef;
  propMax: string[];
  validInput: boolean;
  propToken: number;
};
export default defineComponent({
  name: 'LockRelockForm',
  components: {},
  emits: ['success'],

  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const data = reactive<DataProps>({
      relockForm: {} as FormRef,
      propMax: [],
      validInput: true,
      propToken: 0
    });

    const { lockerUserQuery, totalUnlockedAmount, relock } = useLockUser();

    const { txListener } = useEthers();
    const {
      isWalletReady,
      account,
      toggleWalletSelectModal,
      appNetworkConfig
    } = useWeb3();
    const relocking = ref(false);
    const { t } = useI18n();
    const { tokens } = useTokens();
    const { trackGoal, Goals } = useFathom();

    async function submit(): Promise<void> {
      if (!data.relockForm.validate()) return;

      try {
        relocking.value = true;
        const tx = await relock();

        if (!tx) {
          relocking.value = false;
          return;
        }

        txListener(tx, {
          onTxConfirmed: async () => {
            emit('success', tx);
            await lockerUserQuery.refetch.value();
            relocking.value = false;
          },
          onTxFailed: () => {
            relocking.value = false;
          }
        });
      } catch {
        relocking.value = false;
      }
    }

    watch(isWalletReady, isAuth => {
      if (!isAuth) {
        data.propMax = [];
      }
    });

    watch(account, () => {
      //
    });

    onMounted(() => {
      //
    });

    return {
      // data
      ...toRefs(data),
      relocking,

      Goals,
      TOKENS,
      // computed
      tokens,
      isWalletReady,
      toggleWalletSelectModal,
      isRequired,
      // methods
      submit,
      trackGoal,
      totalUnlockedAmount
    };
  }
});
</script>
