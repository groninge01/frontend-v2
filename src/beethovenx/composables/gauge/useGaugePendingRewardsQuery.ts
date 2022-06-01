import { FullPool } from '@/services/balancer/subgraph/types';
import GAUGE_CONTRACT_ABI from '@/beethovenx/abi/LiquidityGaugeV5.json';
import { Multicaller } from '@/lib/utils/balancer/contract';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import { QueryObserverOptions } from 'react-query/core';
import { bnum } from '@/lib/utils';
import { configService } from '@/services/config/config.service';
import { formatUnits } from 'ethers/lib/utils';
import { reactive } from 'vue';
import { useQuery } from 'vue-query';
import useTokens from '@/composables/useTokens';
import useWeb3 from '@/services/web3/useWeb3';

export default function useGaugePendingRewardsQuery(
  pool: FullPool | null,
  options: QueryObserverOptions<string> = {}
) {
  const { account, getProvider } = useWeb3();
  const provider = getProvider();
  const { priceFor } = useTokens();

  const queryKey = QUERY_KEYS.Rewards.GetRewards(pool?.id || '');

  const queryFn = async () => {
    if (!pool) {
      return '0';
    }

    const multicaller = new Multicaller(
      configService.network.key,
      provider,
      GAUGE_CONTRACT_ABI
    );

    pool.gauge.rewardTokens.map(rewardToken => {
      multicaller.call(
        `${pool.gauge.address}.claimableRewards.${rewardToken.address}`,
        pool.gauge.address,
        'claimable_reward_write',
        [account.value, rewardToken.address]
      );
    });

    const gaugesDataMap = await multicaller.execute();

    let balanceUSD = 0;
    const rewards = pool.gauge.rewardTokens.map(rewardToken => {
      const balance =
        gaugesDataMap[pool.gauge.address].claimableRewards[rewardToken.address];
      balanceUSD += bnum(balance)
        .times(priceFor(rewardToken.address))
        .toNumber();

      // console.log(rewardToken.address, priceFor(rewardToken.address));

      return {
        symbol: rewardToken.symbol,
        balance: formatUnits(balance, rewardToken.decimals)
      };
    });
    // console.log(balanceUSD); //TODO, need to add reward tokens to test this
    return { rewards: rewards, balanceUSD: balanceUSD };
  };

  const queryOptions = reactive({
    enabled: true,
    ...options,
    refetchInterval: 5000
  });

  return useQuery<any>(queryKey, queryFn, queryOptions);
}
