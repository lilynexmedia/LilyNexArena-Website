import { FileText, Users, User, CheckCircle, AlertCircle, GraduationCap, School, Trophy, Target, Shield, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RegistrationFormData } from "@/hooks/useRegistrationForm";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  formData: RegistrationFormData;
  updateFormData: (updates: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
  eventName: string;
}

export function RegistrationStep3({ formData, updateFormData, errors, eventName }: Props) {
  const formatEducation = (edu: { type: string; schoolName?: string; schoolClass?: string; collegeName?: string; collegeYear?: string; collegeBranch?: string }) => {
    if (edu.type === "school") {
      return `${edu.schoolName} - Class ${edu.schoolClass}`;
    } else if (edu.type === "college") {
      return `${edu.collegeName} - ${edu.collegeYear} Year, ${edu.collegeBranch}`;
    }
    return "NOT SPECIFIED";
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center pb-12 border-b border-white/5">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.2)]"
        >
          <CheckCircle className="w-12 h-12 text-primary" />
        </motion.div>
        <h2 className="font-display text-4xl font-black uppercase italic tracking-tighter text-white mb-4">FINAL INTEL REVIEW</h2>
        <p className="text-white/30 font-bold font-heading uppercase tracking-[0.3em] text-xs">
          Verify all squad coordinates before deployment
        </p>
      </div>

      {/* Event Info */}
      <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 backdrop-blur-xl flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl">
          <Trophy className="w-8 h-8 text-black" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1">DESIGNATED ARENA</p>
          <p className="font-display text-2xl font-black text-white italic">{eventName}</p>
        </div>
      </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-10">
          {/* Team & Captain */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <h3 className="font-display text-base md:text-lg font-black uppercase italic tracking-widest text-white/80">COMMAND CENTER</h3>
            </div>
            
            <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 space-y-6 md:space-y-8">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/30">TEAM CALLSIGN</span>
                <span className="text-xl md:text-2xl font-display font-black text-primary uppercase italic">{formData.teamName}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-white/5">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/30">CAPTAIN IDENTITY</span>
                    <span className="font-bold text-white text-sm md:text-base uppercase tracking-wider">{formData.captainFullName}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/30">COMM LINK</span>
                    <span className="font-bold text-white/80 text-sm md:text-base">{formData.captainMobile}</span>
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/30">BATTLE ALIAS</span>
                    <span className="font-black text-primary italic uppercase text-sm md:text-base">{formData.captainIngameName}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/30">SECTOR / PHASE</span>
                    <span className="font-bold text-white/80 uppercase tracking-widest text-[10px] md:text-xs">{formatEducation(formData.captainEducation)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teammates Summary */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <h3 className="font-display text-base md:text-lg font-black uppercase italic tracking-widest text-white/80">SQUAD ROSTER</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {formData.teammates.map((teammate, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-500",
                    index === 3 ? "bg-secondary/10 border-secondary/30" : "bg-white/5 border-white/10"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className={cn(
                      "w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-[10px] md:text-xs border",
                      index === 3 ? "bg-secondary/20 text-secondary border-secondary/40" : "bg-primary/20 text-primary border-primary/40"
                    )}>
                      {index + 2}
                    </div>
                    <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-tighter">
                      {index === 3 ? "RESERVE" : `OPERATOR 0${index + 2}`}
                    </span>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5 md:pb-2">
                      <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">ALIAS</span>
                      <span className="text-[10px] md:text-xs font-black text-primary uppercase italic">{teammate.ingameName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5 md:pb-2">
                      <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">IDENTITY</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-white/60 uppercase truncate ml-2">{teammate.fullName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Terms & Conditions */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-secondary" />
          <h3 className="font-display text-lg font-black uppercase italic tracking-widest text-white/80">PROTOCOL ACCEPTANCE</h3>
        </div>
        
        <div className="p-8 rounded-3xl bg-black/40 border border-white/5 max-h-56 overflow-y-auto custom-scrollbar">
          <div className="space-y-4 text-[11px] font-bold font-heading uppercase tracking-[0.2em] text-white/40 leading-relaxed">
            <p className="text-white/60"><strong className="text-secondary mr-2">SEC 01. ELIGIBILITY:</strong> ALL TEAM MEMBERS MUST BE REGISTERED UNDER VALID ACADEMIC CREDENTIALS.</p>
            <p><strong className="text-secondary mr-2">SEC 02. FAIR PLAY:</strong> DEPLOYMENT OF EXPLOITS, THIRD-PARTY ASSISTANCE, OR DISHONORABLE CONDUCT TRIGGERS IMMEDIATE BANISHMENT.</p>
            <p><strong className="text-secondary mr-2">SEC 03. ROSTER LOCK:</strong> SQUAD COORDINATES ARE FINALIZED UPON SUBMISSION. UNAUTHORIZED MODIFICATIONS ARE FORBIDDEN.</p>
            <p><strong className="text-secondary mr-2">SEC 04. COMMS:</strong> TEAMS MUST REMAIN ACTIVE ON ALL SECURE FREQUENCIES DURING THE ENGAGEMENT.</p>
            <p><strong className="text-secondary mr-2">SEC 05. DISPUTES:</strong> COMMAND HQ DECISIONS ARE ABSOLUTE AND NON-NEGOTIABLE.</p>
            <p><strong className="text-secondary mr-2">SEC 06. PRIZES:</strong> REWARDS ARE ALLOCATED BASED ON FINAL ARENA STANDINGS.</p>
          </div>
        </div>

        <div className={cn(
          "flex items-start gap-4 p-8 rounded-3xl border transition-all duration-500",
          formData.termsAccepted ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary),0.1)]" : "bg-white/5 border-white/10"
        )}>
          <Checkbox
            id="termsAccepted"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => 
              updateFormData({ termsAccepted: checked === true })
            }
            className="w-6 h-6 rounded-lg mt-0.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black"
          />
          <div className="space-y-2">
            <Label 
              htmlFor="termsAccepted" 
              className="cursor-pointer font-display text-sm font-black uppercase tracking-widest text-white"
            >
              I ACCEPT THE RULES OF ENGAGEMENT *
            </Label>
            <p className="text-[10px] text-white/30 font-bold font-heading uppercase tracking-widest leading-relaxed">
              By confirming, you authorize the deployment of your squad into the arena. 
              <Link to="/rules" target="_blank" className="text-primary hover:text-primary/80 underline underline-offset-4 ml-2">
                FULL DOCUMENTATION
              </Link>
            </p>
          </div>
        </div>
        {errors.termsAccepted && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{errors.termsAccepted}</span>
          </motion.div>
        )}
      </div>

      {/* Warning Protocol */}
      <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/20 flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-secondary" />
        </div>
        <p className="text-[10px] font-black font-heading uppercase tracking-[0.2em] text-secondary/80 leading-relaxed">
          <strong>NOTICE:</strong> SUBMISSION WILL INITIATE A PENDING APPROVAL PHASE. 
          STAY ALERT FOR MISSION CLEARANCE VIA ENCRYPTED EMAIL FREQUENCY.
        </p>
      </div>

      {/* Esports Legal Disclaimer - REQUIRED FOR COMPLIANCE */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-[9px] font-medium text-white/40 leading-relaxed text-center">
          <strong className="text-white/60">LEGAL DISCLAIMER:</strong> This is a skill-based esports tournament. 
          Any entry fee is a participation fee for the tournament and is not gambling, betting, or a game of chance. 
          Winners are determined solely by player skill and game performance. 
          By registering, you acknowledge that outcomes are based entirely on competitive gameplay.
        </p>
      </div>
    </div>
  );
}
