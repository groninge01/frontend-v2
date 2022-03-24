import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import useApp from '@/composables/useApp';
import useWeb3 from '@/services/web3/useWeb3';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import {
  GqlLocker,
  GqlRewardToken
} from '@/beethovenx/services/beethovenx/beethovenx-types';
import { lockerContractsService } from '@/beethovenx/services/locker/locker-contracts.service';
import BigNumber from 'bignumber.js';

interface QueryResponse {
  gqlData: { locker: GqlLocker; lockingRewardTokens: GqlRewardToken[] };
  contractData: {
    allowance: BigNumber;
  };
}

export default function useLockerQuery() {
  const { appLoading } = useApp();
  const { isWalletReady, account } = useWeb3();
  const queryKey = reactive(QUERY_KEYS.Locker.all);
  const enabled = computed(() => !appLoading.value && isWalletReady.value);

  const queryFn = async () => {
    const contractData = await lockerContractsService.locker.getData(
      account.value
    );
    const gqlData = await beethovenxService.getLockerData();
    return {
      gqlData,
      contractData: {
        allowance: new BigNumber(contractData.allowance.toString())
      }
    };
  };

  const queryOptions = reactive({
    enabled
  });

  return useQuery<QueryResponse>(queryKey, queryFn, queryOptions);
}
