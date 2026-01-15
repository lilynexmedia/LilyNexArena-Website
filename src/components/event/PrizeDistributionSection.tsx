import { Trophy, Medal } from 'lucide-react';
import { PrizeDistribution } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  prizes: PrizeDistribution[];
}

const getMedalStyle = (sortOrder: number) => {
  switch (sortOrder) {
    case 1:
      return {
        icon: '🥇',
        textClass: 'text-yellow-500',
        borderClass: 'border-yellow-500/30',
      };
    case 2:
      return {
        icon: '🥈',
        textClass: 'text-gray-300',
        borderClass: 'border-gray-400/30',
      };
    case 3:
      return {
        icon: '🥉',
        textClass: 'text-orange-500',
        borderClass: 'border-orange-600/30',
      };
    default:
      return {
        icon: `#${sortOrder}`,
        textClass: 'text-muted-foreground',
        borderClass: 'border-border/50',
      };
  }
};

export const PrizeDistributionSection = ({ prizes }: Props) => {
  const sortedPrizes = [...prizes].sort((a, b) => a.sort_order - b.sort_order);

  if (prizes.length === 0) {
    return (
      <div className="glass-card p-4">
        <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Prize Distribution
        </h2>
        <div className="text-center py-6">
          <Medal className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">Prize details coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent" />
        Prize Distribution
      </h2>
      
      <div className="space-y-2">
        {sortedPrizes.map((prize) => {
          const style = getMedalStyle(prize.sort_order);
          
          return (
            <div
              key={prize.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg bg-muted/20 border transition-all hover:bg-muted/30",
                style.borderClass
              )}
            >
              <span className="text-xl w-8 text-center">{style.icon}</span>
              <span className={cn("font-heading font-semibold flex-1", style.textClass)}>
                {prize.place}
              </span>
              <span className="font-display font-bold text-foreground">
                {prize.prize}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
