import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Users, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitRegistration } from "@/hooks/useEvents";
import { toast } from "sonner";

const registrationSchema = z.object({
  team_name: z.string().min(2, "Team name must be at least 2 characters"),
  captain_name: z.string().min(2, "Captain name is required"),
  captain_email: z.string().email("Valid email is required"),
  captain_phone: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
  minPlayers?: number;
  maxPlayers?: number;
}

export function RegistrationModal({ 
  isOpen, 
  onClose, 
  eventId, 
  eventName,
  minPlayers = 4,
  maxPlayers = 6
}: RegistrationModalProps) {
  const [players, setPlayers] = useState<Array<{ name: string; email: string; discord: string }>>([
    { name: "", email: "", discord: "" },
    { name: "", email: "", discord: "" },
    { name: "", email: "", discord: "" },
    { name: "", email: "", discord: "" },
  ]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });
  
  const submitRegistration = useSubmitRegistration();

  const addPlayer = () => {
    if (players.length < maxPlayers) {
      setPlayers([...players, { name: "", email: "", discord: "" }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > minPlayers) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, field: string, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    // Validate at least minPlayers have names
    const validPlayers = players.filter(p => p.name.trim() !== "");
    if (validPlayers.length < minPlayers) {
      toast.error(`At least ${minPlayers} player names are required`);
      return;
    }

    try {
      await submitRegistration.mutateAsync({
        event_id: eventId,
        team_name: data.team_name,
        captain_name: data.captain_name,
        captain_email: data.captain_email,
        captain_phone: data.captain_phone || null,
        player_names: validPlayers.map(p => p.name),
        player_emails: validPlayers.map(p => p.email).filter(e => e),
        player_discord_ids: validPlayers.map(p => p.discord).filter(d => d),
      });
      
      toast.success("Registration submitted successfully!", {
        description: "Your registration is pending approval. We'll notify you once it's reviewed."
      });
      
      reset();
      setPlayers([
        { name: "", email: "", discord: "" },
        { name: "", email: "", discord: "" },
        { name: "", email: "", discord: "" },
        { name: "", email: "", discord: "" },
      ]);
      onClose();
    } catch (error) {
      toast.error("Failed to submit registration", {
        description: "Please try again later."
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-card border border-border rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-display text-xl font-bold">Team Registration</h2>
            <p className="text-sm text-muted-foreground">{eventName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Team Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Team Information
            </h3>
            
            <div>
              <Label htmlFor="team_name">Team Name *</Label>
              <Input
                id="team_name"
                {...register("team_name")}
                className="mt-1"
                placeholder="Enter your team name"
              />
              {errors.team_name && (
                <p className="text-sm text-destructive mt-1">{errors.team_name.message}</p>
              )}
            </div>
          </div>

          {/* Captain Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Team Captain</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="captain_name">Name *</Label>
                <Input
                  id="captain_name"
                  {...register("captain_name")}
                  className="mt-1"
                  placeholder="Captain's full name"
                />
                {errors.captain_name && (
                  <p className="text-sm text-destructive mt-1">{errors.captain_name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="captain_email">Email *</Label>
                <Input
                  id="captain_email"
                  type="email"
                  {...register("captain_email")}
                  className="mt-1"
                  placeholder="captain@email.com"
                />
                {errors.captain_email && (
                  <p className="text-sm text-destructive mt-1">{errors.captain_email.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="captain_phone">Phone (Optional)</Label>
                <Input
                  id="captain_phone"
                  type="tel"
                  {...register("captain_phone")}
                  className="mt-1"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold">Team Members ({players.length})</h3>
              {players.length < maxPlayers && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPlayer}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Player
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {players.map((player, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-heading text-muted-foreground">
                      Player {index + 1}
                    </span>
                    {players.length > minPlayers && (
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Player Name *"
                      value={player.name}
                      onChange={(e) => updatePlayer(index, "name", e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Email (Optional)"
                      value={player.email}
                      onChange={(e) => updatePlayer(index, "email", e.target.value)}
                    />
                    <Input
                      placeholder="Discord ID (Optional)"
                      value={player.discord}
                      onChange={(e) => updatePlayer(index, "discord", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              className="flex-1"
              disabled={submitRegistration.isPending}
            >
              {submitRegistration.isPending ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
