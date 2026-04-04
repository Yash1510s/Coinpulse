import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { WatchlistButton } from '@/components/WatchlistButton';

const SecurityBadge = ({ securityScore }: { securityScore?: SecurityScore | null }) => {
  if (!securityScore) return null;

  const { score, status, risks } = securityScore;

  const config = {
    Safe: {
      icon: ShieldCheck,
      colorClass: 'security-safe',
      label: 'Safe',
    },
    Warning: {
      icon: ShieldAlert,
      colorClass: 'security-warning',
      label: 'Warning',
    },
    'Critical Risk': {
      icon: ShieldX,
      colorClass: 'security-critical',
      label: 'Critical',
    },
    Error: {
      icon: ShieldX,
      colorClass: 'security-unknown',
      label: 'Error',
    },
    Unknown: {
      icon: ShieldAlert,
      colorClass: 'security-unknown',
      label: 'Unknown',
    },
  };

  const current = config[status as keyof typeof config] || config.Unknown;
  const Icon = current.icon;

  return (
    <div className={cn('security-badge', current.colorClass)}>
      <div className="security-badge-header">
        <Icon size={18} />
        <span className="security-score">{score}/100</span>
        <span className="security-label">{current.label}</span>
      </div>

      {risks.length > 0 && (
        <div className="security-risks">
          <ul>
            {risks.map((risk, i) => (
              <li key={i}>⚠ {risk}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
  securityScore,
  coinId,
}: LiveCoinHeaderProps & { coinId: string }) => {
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  const stats = [
    {
      label: 'Today',
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: '30 Days',
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: 'Price Change (24h)',
      value: priceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  return (
    <div id="coin-header">
      <div className="header-top-row flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3>{name}</h3>
          <WatchlistButton coinId={coinId} />
        </div>
        <SecurityBadge securityScore={securityScore} />
      </div>

      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />

        <div className="price-row">
          <h1>{formatCurrency(livePrice)}</h1>
          <Badge className={cn('badge', isTrendingUp ? 'badge-up' : 'badge-down')}>
            {formatPercentage(livePriceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
            (24h)
          </Badge>
        </div>
      </div>

      <ul className="stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <p className="label">{stat.label}</p>

            <div
              className={cn('value', {
                'text-green-500': stat.isUp,
                'text-red-500': !stat.isUp,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CoinHeader;
