import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import useApp from '@/composables/useApp';
import useWeb3 from '@/services/web3/useWeb3';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import {
  GqlLocker,
  GqlLockingReward,
  GqlLockingUser,
  GqlRewardToken
} from '@/beethovenx/services/beethovenx/beethovenx-types';

interface QueryResponse {
  locker: GqlLocker;
  lockingUser: GqlLockingUser;
  lockingRewardTokens: GqlRewardToken;
  lockingUserVotingPower: number;
}

export default function useLockerQuery() {
  const { appLoading } = useApp();
  const queryKey = reactive(QUERY_KEYS.Locker.all);

  const queryFn = async () => {
    const data = await beethovenxService.getLockerData();
    return data;
  };

  const queryOptions = reactive({
    enabled: true
  });

  return useQuery<QueryResponse>(queryKey, queryFn, queryOptions);
}
