import { Ref, computed } from 'vue';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';

import BigNumber from 'bignumber.js';
import { FullPool } from '@/services/balancer/subgraph/types';
import GAUGE_CONTRACT_ABI from '@/beethovenx/abi/LiquidityGaugeV5.json';
import { default as abi } from '@/lib/abi/ERC20.json';
import { erc20ContractService } from '@/beethovenx/services/erc20/erc20-contracts.service';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import useEthers from '@/composables/useEthers';
import useGaugePendingRewardsQuery from './useGaugePendingRewardsQuery';
import useGaugeUserBalanceQuery from '@/beethovenx/composables/gauge/useGaugeUserBalanceQuery';
import useGaugeUserQuery from '@/beethovenx/composables/gauge/useGaugeUserQuery';
import useTransactions from '@/composables/useTransactions';
import useWeb3 from '@/services/web3/useWeb3';

export async function approveToken(
  web3: Web3Provider,
  spender: string,
  token: string,
  amount: string
): Promise<TransactionResponse> {
  return sendTransaction(web3, token, abi, 'approve', [spender, amount]);
}

export default function useGauge(pool: Ref<FullPool>) {
  const { getProvider, appNetworkConfig } = useWeb3();
  const { addTransaction } = useTransactions();
  const { txListener } = useEthers();

  const gaugeUserQuery = useGaugeUserQuery(pool.value.id);
  const { data: gaugeUserBalance } = useGaugeUserBalanceQuery(
    pool.value.gauge?.address || null
  );

  const gaugePendingRewardQuery = useGaugePendingRewardsQuery(pool.value);

  const pendingRewards = computed(() => {
    return gaugePendingRewardQuery.data.value;
  });

  const isPendingRewardsLoading = computed(() => {
    return gaugePendingRewardQuery.isLoading.value;
  });

  async function approve() {
    try {
      const provider = getProvider();
      const tx = await erc20ContractService.erc20.approveToken(
        provider,
        pool.value.gauge.address,
        pool.value.address
      );

      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'approve',
        summary: `Approve LP token`,
        details: {
          contractAddress: pool.value.address,
          spender: pool.value.gauge.address
        }
      });

      return tx;
    } catch (error) {
      console.error(error);
    }
  }

  async function deposit(amount: BigNumber) {
    try {
      const tx = await getDepositTransaction(amount.toString());

      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'invest',
        summary: 'Deposit LP tokens',
        details: {
          contractAddress: pool.value.address,
          spender: pool.value.gauge.address
        }
      });

      return tx;
    } catch (error) {
      console.error(error);
    }
  }

  async function getDepositTransaction(amount: string | number) {
    const provider = getProvider();
    return sendTransaction(
      provider,
      pool.value.gauge.address,
      GAUGE_CONTRACT_ABI,
      'deposit(uint256)',
      [amount.toString()]
    );
  }

  async function harvest() {
    try {
      const tx = await getHarvestTransaction();

      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'claim',
        summary: 'Harvest staked rewards',
        details: {
          contractAddress: pool.value.address
        }
      });

      txListener(tx, {
        onTxConfirmed: async () => {
          await gaugePendingRewardQuery.refetch.value();
        },
        onTxFailed: () => {
          //
        }
      });

      return tx;
    } catch (error) {
      console.error(error);
    }
  }

  async function getHarvestTransaction() {
    const provider = getProvider();
    return sendTransaction(
      provider,
      pool.value.gauge.address,
      GAUGE_CONTRACT_ABI,
      'claim_rewards()',
      []
    );
  }

  async function withdrawAndHarvest(amount: BigNumber) {
    try {
      const tx = await getWithdrawTransaction(amount.toString());
      console.log(tx);
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'claim',
        summary: 'Withdraw staked LP tokens',
        details: {
          contractAddress: pool.value.address,
          spender: appNetworkConfig.addresses.masterChef
        }
      });

      return tx;
    } catch (error) {
      console.error(error);
    }
  }

  async function getWithdrawTransaction(amount: string | number) {
    const provider = getProvider();
    return sendTransaction(
      provider,
      pool.value.gauge.address,
      GAUGE_CONTRACT_ABI,
      'withdraw(uint256,bool)',
      [amount.toString(), true]
    );
  }

  const gaugeUser = computed(() => {
    return gaugeUserQuery.data.value;
  });

  return {
    approve,
    deposit,
    harvest,
    withdrawAndHarvest,
    gaugeUser,
    pendingRewards,
    isPendingRewardsLoading,
    gaugeUserBalance
  };
}
