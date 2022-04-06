import { reactive, toRefs } from 'vue';

type GasEstimationState = {
  selectedGasPriceKey: number;
  selectedGasPrice: number | null;
};

/**
 * STATE
 */
const state = reactive<GasEstimationState>({
  selectedGasPriceKey: 1,
  selectedGasPrice: null
});

export default function useGasEstimationState() {
  return {
    ...toRefs(state)
  };
}
