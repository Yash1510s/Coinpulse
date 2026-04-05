import React from 'react';
import { fetcher, getPools } from '@/lib/coingecko.actions';
import { getTokenSecurityScore } from '@/lib/security.actions';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import Converter from '@/components/Converter';

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: 'contract_address',
    }),
    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1,
      precision: 'full',
    }),
  ]);

  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms?.[coinData.asset_platform_id]
    : null;
  const network = platform?.geckoterminal_url?.split('/')[3] || null;
  const contractAddress = platform?.contract_address || null;

  const pool = await getPools(id, network, contractAddress);

  const NETWORK_TO_CHAIN_ID: Record<string, string> = {
    ethereum: '1',
    eth: '1',
    'binance-smart-chain': '56',
    bsc: '56',
    'polygon-pos': '137',
    polygon: '137',
    arbitrum: '42161',
    arb: '42161',
    'optimistic-ethereum': '10',
    optimism: '10',
    avalanche: '43114',
    avax: '43114',
    base: '8453',
    linea: '59144',
    fantom: '250',
    ftm: '250',
    cronos: '25',
    cro: '25',
  };

  let securityScore: SecurityScore | null = null;
  if (contractAddress && (network || coinData.asset_platform_id)) {
    const chainId =
      NETWORK_TO_CHAIN_ID[network ?? ''] || NETWORK_TO_CHAIN_ID[coinData.asset_platform_id ?? ''];
    if (chainId) {
      securityScore = await getTokenSecurityScore(chainId, contractAddress);
    }
  }

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <LiveDataWrapper
          coinId={id}
          poolId={pool.id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
          securityScore={securityScore}
        >
          <h4>Exchange Listings</h4>
        </LiveDataWrapper>
      </section>

      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        <div className="details">
          <h4>Coin Details</h4>

          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li key={index}>
                <p className={label}>{label}</p>

                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};
export default Page;
