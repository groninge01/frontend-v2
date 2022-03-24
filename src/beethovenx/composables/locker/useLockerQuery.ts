import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import useApp from '@/composables/useApp';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import {
  GqlLocker,
  GqlRewardToken
} from '@/beethovenx/services/beethovenx/beethovenx-types';

interface QueryResponse {
  locker: GqlLocker;
  lockingRewardTokens: GqlRewardToken[];
}

export default function useLockerQuery() {
  const { appLoading } = useApp();
  const queryKey = reactive(QUERY_KEYS.Locker.all);
  const enabled = computed(() => !appLoading.value);

  const queryFn = async () => {
    const data = await beethovenxService.getLockerData();
    return data;
  };

  const queryOptions = reactive({
    enabled
  });

  return useQuery<QueryResponse>(queryKey, queryFn, queryOptions);
}
