import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import useApp from '@/composables/useApp';
import useWeb3 from '@/services/web3/useWeb3';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import { GqlLockingReward } from '@/beethovenx/services/beethovenx/beethovenx-types';

export default function useLockerQuery() {
  const { appLoading } = useApp();
  const { account, isWalletReady } = useWeb3();
  const queryKey = reactive(QUERY_KEYS.Locker.Rewards(account));

  const queryFn = async () => {
    const data = await beethovenxService.getLockerRewardsData();
    return data;
  };

  const queryOptions = reactive({
    enabled: true
  });

  return useQuery<GqlLockingReward[]>(queryKey, queryFn, queryOptions);
}
