import { Trophy, AlertCircle, Image as ImageIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventWinner, EventGalleryImage } from "@/lib/types";
import { EventGallery } from "./EventGallery";

interface WinnersSectionProps {
  winners: EventWinner[];
  resultGallery?: EventGalleryImage[];
  isCompleted: boolean;
}

const rankColors: Record<number, string> = {
  1: "from-yellow-500 to-amber-600",
  2: "from-gray-300 to-gray-400",
  3: "from-orange-600 to-orange-700",
};

const rankIcons: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export function WinnersSection({ winners, resultGallery, isCompleted }: WinnersSectionProps) {
  return (
    <div className="glass-card p-6">
      <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Results & Winners
      </h2>
      
      {/* Results Section - Always show, with appropriate content */}
      {!isCompleted ? (
        // Event not completed - show "coming soon"
        <div className="text-center py-12 mb-6">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">
            Results coming soon
          </p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            Results will be announced after the event concludes.
          </p>
        </div>
      ) : winners.length === 0 ? (
        // Event completed but no winners added yet
        <div className="text-center py-12 mb-6">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">
            Winners coming soon
          </p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            The results are being finalized.
          </p>
        </div>
      ) : (
        // Event completed with winners
        <div className="space-y-4 mb-6">
          {/* Top 3 Winners Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {winners.filter(w => w.rank <= 3).sort((a, b) => a.rank - b.rank).map((winner) => (
              <div
                key={winner.id}
                className={cn(
                  "relative p-6 rounded-lg border text-center",
                  winner.rank === 1 && "bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border-yellow-500/30",
                  winner.rank === 2 && "bg-gradient-to-br from-gray-300/10 to-gray-400/10 border-gray-400/30",
                  winner.rank === 3 && "bg-gradient-to-br from-orange-600/10 to-orange-700/10 border-orange-600/30"
                )}
              >
                <div className="text-4xl mb-3">{rankIcons[winner.rank] || `#${winner.rank}`}</div>
                <div className="font-heading font-bold text-lg mb-1">{winner.team_name}</div>
                {winner.prize && (
                  <div className={cn(
                    "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
                    rankColors[winner.rank] || "from-primary to-secondary"
                  )}>
                    {winner.prize}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Other Winners */}
          {winners.filter(w => w.rank > 3).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Other Placements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {winners.filter(w => w.rank > 3).sort((a, b) => a.rank - b.rank).map((winner) => (
                  <div
                    key={winner.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center"
                  >
                    <div className="text-sm text-muted-foreground mb-1">#{winner.rank}</div>
                    <div className="font-heading font-semibold text-sm">{winner.team_name}</div>
                    {winner.prize && (
                      <div className="text-xs text-primary mt-1">{winner.prize}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Result Gallery Section - Show if images exist OR if event is completed */}
      <div className="pt-6 border-t border-border/50">
        <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-accent" />
          Result Gallery
        </h3>
        
        {resultGallery && resultGallery.length > 0 ? (
          // Show result images if they exist (regardless of event status)
          <EventGallery 
            images={resultGallery} 
            title=""
            emptyMessage=""
          />
        ) : isCompleted ? (
          // Event completed but no result images
          <div className="text-center py-12 rounded-xl bg-muted/10 border border-border/30">
            <ImageIcon className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground text-lg font-medium">
              Result images coming soon
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Photos from the event will be uploaded shortly
            </p>
          </div>
        ) : (
          // Event not completed and no images
          <div className="text-center py-12 rounded-xl bg-muted/10 border border-border/30">
            <ImageIcon className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground text-lg font-medium">
              Result images will be available after the event
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Check back once the tournament concludes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
