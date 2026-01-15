import { Users, User, Phone, Mail, GraduationCap, School, Target, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RegistrationFormData, PlayerEducation } from "@/hooks/useRegistrationForm";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  formData: RegistrationFormData;
  updateFormData: (updates: Partial<RegistrationFormData>) => void;
  errors: Record<string, string>;
}

export function RegistrationStep1({ formData, updateFormData, errors }: Props) {
  const updateCaptainEducation = (updates: Partial<PlayerEducation>) => {
    updateFormData({
      captainEducation: { ...formData.captainEducation, ...updates },
    });
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Team Details */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h3 className="font-display text-lg md:text-2xl font-black uppercase italic tracking-tighter text-white">
              SQUAD DESIGNATION
            </h3>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="teamName" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Team Callsign *</Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              placeholder="ENTER TEAM NAME"
              className={cn(
                "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-black font-display uppercase tracking-widest transition-all",
                errors.teamName && "border-destructive"
              )}
            />
            {errors.teamName && (
              <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.teamName}</p>
            )}
          </div>
        </div>

        {/* Team Leader Details */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h3 className="font-display text-lg md:text-2xl font-black uppercase italic tracking-tighter text-white">
              CAPTAIN INTEL
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="captainFullName" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Real Name *</Label>
              <Input
                id="captainFullName"
                value={formData.captainFullName}
                onChange={(e) => updateFormData({ captainFullName: e.target.value })}
                placeholder="FULL NAME"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainFullName && "border-destructive"
                )}
              />
              {errors.captainFullName && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainFullName}</p>
              )}
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="captainIngameName" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">In-Game Alias *</Label>
              <Input
                id="captainIngameName"
                value={formData.captainIngameName}
                onChange={(e) => updateFormData({ captainIngameName: e.target.value })}
                placeholder="IGN"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-black font-display uppercase tracking-widest transition-all",
                  errors.captainIngameName && "border-destructive"
                )}
              />
              {errors.captainIngameName && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainIngameName}</p>
              )}
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="captainMobile" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Comms Link (Phone) *</Label>
              <Input
                id="captainMobile"
                type="tel"
                value={formData.captainMobile}
                onChange={(e) => updateFormData({ captainMobile: e.target.value })}
                placeholder="+91-0000000000"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainMobile && "border-destructive"
                )}
              />
              {errors.captainMobile && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainMobile}</p>
              )}
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="captainEmail" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Encryption Link (Email) *</Label>
              <Input
                id="captainEmail"
                type="email"
                value={formData.captainEmail}
                onChange={(e) => updateFormData({ captainEmail: e.target.value })}
                placeholder="SIGNAL@NEXUS.COM"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainEmail && "border-destructive"
                )}
              />
              {errors.captainEmail && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h3 className="font-display text-lg md:text-2xl font-black uppercase italic tracking-tighter text-white">
              ACADEMIC BACKGROUND
            </h3>
          </div>
        
          <div className="space-y-3 md:space-y-4">
            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Current Academic Phase *</Label>
            <RadioGroup
              value={formData.captainEducation.type}
              onValueChange={(value: "school" | "college") => 
                updateCaptainEducation({ type: value })
              }
              className="grid grid-cols-2 gap-3 md:gap-6"
            >
              <div className={cn(
                "relative flex flex-col items-center justify-center p-3 md:p-6 rounded-xl md:rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden group",
                formData.captainEducation.type === "school" 
                  ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}>
                <RadioGroupItem value="school" id="captainSchool" className="sr-only" />
                <Label htmlFor="captainSchool" className="cursor-pointer flex flex-col items-center gap-2 md:gap-3">
                  <div className={cn(
                    "w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center border transition-all duration-500",
                    formData.captainEducation.type === "school" ? "bg-primary text-black border-primary" : "bg-white/5 text-white/40 border-white/10"
                  )}>
                    <School className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <span className={cn(
                    "font-display text-xs md:text-lg font-black uppercase tracking-widest",
                    formData.captainEducation.type === "school" ? "text-white" : "text-white/40"
                  )}>SCHOOL</span>
                </Label>
              </div>
              
              <div className={cn(
                "relative flex flex-col items-center justify-center p-3 md:p-6 rounded-xl md:rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden group",
                formData.captainEducation.type === "college" 
                  ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}>
                <RadioGroupItem value="college" id="captainCollege" className="sr-only" />
                <Label htmlFor="captainCollege" className="cursor-pointer flex flex-col items-center gap-2 md:gap-3">
                  <div className={cn(
                    "w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center border transition-all duration-500",
                    formData.captainEducation.type === "college" ? "bg-primary text-black border-primary" : "bg-white/5 text-white/40 border-white/10"
                  )}>
                    <GraduationCap className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <span className={cn(
                    "font-display text-xs md:text-lg font-black uppercase tracking-widest",
                    formData.captainEducation.type === "college" ? "text-white" : "text-white/40"
                  )}>COLLEGE</span>
                </Label>
              </div>
            </RadioGroup>
            {errors.captainEducationType && (
              <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainEducationType}</p>
            )}
          </div>

        {/* School Fields */}
        {formData.captainEducation.type === "school" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 p-4 md:p-8 rounded-xl md:rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl"
          >
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="captainSchoolName" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">School Identity *</Label>
              <Input
                id="captainSchoolName"
                value={formData.captainEducation.schoolName || ""}
                onChange={(e) => updateCaptainEducation({ schoolName: e.target.value })}
                placeholder="SCHOOL NAME"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainSchoolName && "border-destructive"
                )}
              />
              {errors.captainSchoolName && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainSchoolName}</p>
              )}
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="captainSchoolClass" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Academic Grade *</Label>
              <Input
                id="captainSchoolClass"
                value={formData.captainEducation.schoolClass || ""}
                onChange={(e) => updateCaptainEducation({ schoolClass: e.target.value })}
                placeholder="CLASS"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainSchoolClass && "border-destructive"
                )}
              />
              {errors.captainSchoolClass && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainSchoolClass}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* College Fields */}
        {formData.captainEducation.type === "college" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 p-4 md:p-8 rounded-xl md:rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl"
          >
            <div className="md:col-span-3 space-y-2 md:space-y-3">
              <Label htmlFor="captainCollegeName" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Institution Identity *</Label>
              <Input
                id="captainCollegeName"
                value={formData.captainEducation.collegeName || ""}
                onChange={(e) => updateCaptainEducation({ collegeName: e.target.value })}
                placeholder="COLLEGE NAME"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainCollegeName && "border-destructive"
                )}
              />
              {errors.captainCollegeName && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainCollegeName}</p>
              )}
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="captainCollegeYear" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Cycle Year *</Label>
              <Input
                id="captainCollegeYear"
                value={formData.captainEducation.collegeYear || ""}
                onChange={(e) => updateCaptainEducation({ collegeYear: e.target.value })}
                placeholder="YEAR"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainCollegeYear && "border-destructive"
                )}
              />
              {errors.captainCollegeYear && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainCollegeYear}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-2 md:space-y-3">
              <Label htmlFor="captainCollegeBranch" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Deployment Specialization *</Label>
              <Input
                id="captainCollegeBranch"
                value={formData.captainEducation.collegeBranch || ""}
                onChange={(e) => updateCaptainEducation({ collegeBranch: e.target.value })}
                placeholder="BRANCH / COURSE"
                className={cn(
                  "h-12 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 px-4 md:px-6 text-sm md:text-lg font-bold font-heading uppercase tracking-widest transition-all",
                  errors.captainCollegeBranch && "border-destructive"
                )}
              />
              {errors.captainCollegeBranch && (
                <p className="text-[9px] md:text-[10px] text-destructive mt-1 md:mt-2 font-black uppercase tracking-widest">{errors.captainCollegeBranch}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
