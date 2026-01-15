import { Users, GraduationCap, School, Target, Zap, Shield, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RegistrationFormData, TeammateData, PlayerEducation } from "@/hooks/useRegistrationForm";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  formData: RegistrationFormData;
  updateFormData: (updates: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
}

const PLAYER_LABELS = ["Operator 02", "Operator 03", "Operator 04", "RESERVE OPERATOR"];

export function RegistrationStep2({ formData, updateFormData, errors }: Props) {
  const updateTeammate = (index: number, updates: Partial<TeammateData>) => {
    const newTeammates = [...formData.teammates];
    newTeammates[index] = { ...newTeammates[index], ...updates };
    updateFormData({ teammates: newTeammates });
  };

  const updateTeammateEducation = (index: number, updates: Partial<PlayerEducation>) => {
    const newTeammates = [...formData.teammates];
    newTeammates[index] = {
      ...newTeammates[index],
      education: { ...newTeammates[index].education, ...updates },
    };
    updateFormData({ teammates: newTeammates });
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-black uppercase italic tracking-tighter text-white">SQUAD ASSEMBLY</h2>
      </div>

      <div className="space-y-10">
        {formData.teammates.map((teammate, index) => {
          const prefix = `teammate${index}`;
          const isSubstitute = index === 3;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-10 rounded-3xl border transition-all duration-500 relative overflow-hidden group",
                isSubstitute 
                  ? "bg-secondary/5 border-secondary/20 shadow-[0_0_40px_rgba(var(--secondary),0.05)]" 
                  : "bg-white/5 border-white/10 shadow-2xl"
              )}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                
                <div className="flex items-center gap-4 mb-6 md:mb-10">
                  <div className={cn(
                    "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl border transition-all duration-500",
                    isSubstitute 
                      ? "bg-secondary/10 text-secondary border-secondary/30 group-hover:bg-secondary/20" 
                      : "bg-primary/10 text-primary border-primary/30 group-hover:bg-primary/20"
                  )}>
                    {index + 2}
                  </div>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tighter text-white">{PLAYER_LABELS[index]}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      {isSubstitute ? "Tactical Reserve Unit" : "Active Deployment Unit"}
                    </p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
                  <div className="space-y-3">
                    <Label htmlFor={`${prefix}FullName`} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Identity *</Label>
                    <Input
                      id={`${prefix}FullName`}
                      value={teammate.fullName}
                      onChange={(e) => updateTeammate(index, { fullName: e.target.value })}
                      placeholder="FULL NAME"
                      className={cn(
                        "h-14 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-6 text-base md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                        errors[`${prefix}FullName`] && "border-destructive"
                      )}
                    />
                    {errors[`${prefix}FullName`] && (
                      <p className="text-[10px] text-destructive mt-2 font-black uppercase tracking-widest">{errors[`${prefix}FullName`]}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor={`${prefix}IngameName`} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Battle Alias *</Label>
                    <Input
                      id={`${prefix}IngameName`}
                      value={teammate.ingameName}
                      onChange={(e) => updateTeammate(index, { ingameName: e.target.value })}
                      placeholder="IGN"
                      className={cn(
                        "h-14 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-6 text-base md:text-lg font-black font-display uppercase tracking-widest transition-all",
                        errors[`${prefix}IngameName`] && "border-destructive"
                      )}
                    />
                    {errors[`${prefix}IngameName`] && (
                      <p className="text-[10px] text-destructive mt-2 font-black uppercase tracking-widest">{errors[`${prefix}IngameName`]}</p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-6">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Current Academic Phase *</Label>
                  <RadioGroup
                    value={teammate.education.type}
                    onValueChange={(value: "school" | "college") => 
                      updateTeammateEducation(index, { type: value })
                    }
                    className="grid grid-cols-2 gap-4 md:gap-6"
                  >
                    <div className={cn(
                      "relative flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden group/radio",
                      teammate.education.type === "school" 
                        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    )}>
                      <RadioGroupItem value="school" id={`${prefix}School`} className="sr-only" />
                      <Label htmlFor={`${prefix}School`} className="cursor-pointer flex items-center gap-3">
                        <School className={cn("w-4 h-4 md:w-5 md:h-5", teammate.education.type === "school" ? "text-primary" : "text-white/30")} />
                        <span className={cn("font-display text-[10px] md:text-sm font-black uppercase tracking-widest", teammate.education.type === "school" ? "text-white" : "text-white/30")}>SCHOOL</span>
                      </Label>
                    </div>
                    <div className={cn(
                      "relative flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden group/radio",
                      teammate.education.type === "college" 
                        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    )}>
                      <RadioGroupItem value="college" id={`${prefix}College`} className="sr-only" />
                      <Label htmlFor={`${prefix}College`} className="cursor-pointer flex items-center gap-3">
                        <GraduationCap className={cn("w-4 h-4 md:w-5 md:h-5", teammate.education.type === "college" ? "text-primary" : "text-white/30")} />
                        <span className={cn("font-display text-[10px] md:text-sm font-black uppercase tracking-widest", teammate.education.type === "college" ? "text-white" : "text-white/30")}>COLLEGE</span>
                      </Label>
                    </div>
                  </RadioGroup>
                {errors[`${prefix}EducationType`] && (
                  <p className="text-[10px] text-destructive mt-2 font-black uppercase tracking-widest">{errors[`${prefix}EducationType`]}</p>
                )}

                {/* School Fields */}
                <AnimatePresence mode="wait">
                  {teammate.education.type === "school" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/5"
                    >
                      <div className="space-y-3">
                        <Label htmlFor={`${prefix}SchoolName`} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Institution *</Label>
                        <Input
                          id={`${prefix}SchoolName`}
                          value={teammate.education.schoolName || ""}
                          onChange={(e) => updateTeammateEducation(index, { schoolName: e.target.value })}
                          placeholder="SCHOOL NAME"
                          className={cn("h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 px-6", errors[`${prefix}SchoolName`] && "border-destructive")}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor={`${prefix}SchoolClass`} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Grade *</Label>
                        <Input
                          id={`${prefix}SchoolClass`}
                          value={teammate.education.schoolClass || ""}
                          onChange={(e) => updateTeammateEducation(index, { schoolClass: e.target.value })}
                          placeholder="CLASS"
                          className={cn("h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 px-6", errors[`${prefix}SchoolClass`] && "border-destructive")}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* College Fields */}
                  {teammate.education.type === "college" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white/5 border border-white/5"
                    >
                      <div className="md:col-span-3 space-y-3">
                        <Label htmlFor={`${prefix}CollegeName`} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Institution *</Label>
                        <Input
                          id={`${prefix}CollegeName`}
                          value={teammate.education.collegeName || ""}
                          onChange={(e) => updateTeammateEducation(index, { collegeName: e.target.value })}
                          placeholder="COLLEGE NAME"
                          className={cn("h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 px-6", errors[`${prefix}CollegeName`] && "border-destructive")}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor={`${prefix}CollegeYear`} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Cycle *</Label>
                        <Input
                          id={`${prefix}CollegeYear`}
                          value={teammate.education.collegeYear || ""}
                          onChange={(e) => updateTeammateEducation(index, { collegeYear: e.target.value })}
                          placeholder="YEAR"
                          className={cn("h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 px-6", errors[`${prefix}CollegeYear`] && "border-destructive")}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <Label htmlFor={`${prefix}CollegeBranch`} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Sector *</Label>
                        <Input
                          id={`${prefix}CollegeBranch`}
                          value={teammate.education.collegeBranch || ""}
                          onChange={(e) => updateTeammateEducation(index, { collegeBranch: e.target.value })}
                          placeholder="BRANCH"
                          className={cn("h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/10 px-6", errors[`${prefix}CollegeBranch`] && "border-destructive")}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
