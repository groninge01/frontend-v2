import { reactive } from 'vue';
import { useQuery } from 'vue-query';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import { GqlGasEstimatesData } from '@/beethovenx/services/beethovenx/beethovenx-types';

export default function useGasEstimatesQuery() {
  const queryKey = reactive(QUERY_KEYS.GasEstimates.all);

  const queryFn = async () => {
    const data = await beethovenxService.getGasEstimates();
    return data;
  };

  const queryOptions = reactive({
    enabled: true,
    refetch: 5000
  });

  return useQuery<GqlGasEstimatesData>(queryKey, queryFn, queryOptions);
}
