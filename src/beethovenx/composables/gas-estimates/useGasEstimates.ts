import useGasEstimatesQuery from '@/beethovenx/composables/gas-estimates/useGasEstimatesQuery';
import { computed } from 'vue';

export function useGasEstimates() {
  const gasEstimatesQuery = useGasEstimatesQuery();
  const { isLoading, data } = gasEstimatesQuery;

  const gasEstimatesDataLoading = computed(() => isLoading.value);

  const speeds = computed(() => data.value?.speeds);

  return {
    gasEstimatesDataLoading,
    speeds
  };
}
