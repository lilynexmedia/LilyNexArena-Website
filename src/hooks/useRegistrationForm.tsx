import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerEducation {
  type: "school" | "college" | "";
  schoolName?: string;
  schoolClass?: string;
  collegeName?: string;
  collegeYear?: string;
  collegeBranch?: string;
}

export interface TeammateData {
  fullName: string;
  ingameName: string;
  education: PlayerEducation;
}

export interface RegistrationFormData {
  // Step 1 - Team & Leader
  teamName: string;
  captainFullName: string;
  captainIngameName: string;
  captainMobile: string;
  captainEmail: string;
  captainEducation: PlayerEducation;
  
  // Step 2 - Teammates
  teammates: TeammateData[];
  
  // Step 3 - Terms
  termsAccepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const initialTeammate: TeammateData = {
  fullName: "",
  ingameName: "",
  education: { type: "" },
};

const initialFormData: RegistrationFormData = {
  teamName: "",
  captainFullName: "",
  captainIngameName: "",
  captainMobile: "",
  captainEmail: "",
  captainEducation: { type: "" },
  teammates: [
    { ...initialTeammate },
    { ...initialTeammate },
    { ...initialTeammate },
    { ...initialTeammate },
  ],
  termsAccepted: false,
};

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRegistrationForm(eventId: string) {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const updateFormData = useCallback((updates: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear related errors when updating
    const errorKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      errorKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Team Name
      if (!formData.teamName.trim()) {
        newErrors.teamName = "Team name is required";
      } else if (formData.teamName.trim().length < 2) {
        newErrors.teamName = "Team name must be at least 2 characters";
      }

      // Captain Full Name
      if (!formData.captainFullName.trim()) {
        newErrors.captainFullName = "Full name is required";
      }

      // Captain In-game Name
      if (!formData.captainIngameName.trim()) {
        newErrors.captainIngameName = "In-game name is required";
      }

      // Captain Mobile
      if (!formData.captainMobile.trim()) {
        newErrors.captainMobile = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(formData.captainMobile.replace(/\s/g, ""))) {
        newErrors.captainMobile = "Enter a valid 10-digit mobile number";
      }

      // Captain Email
      if (!formData.captainEmail.trim()) {
        newErrors.captainEmail = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.captainEmail)) {
        newErrors.captainEmail = "Enter a valid email address";
      }

      // Captain Education
      if (!formData.captainEducation.type) {
        newErrors.captainEducationType = "Please select school or college";
      } else if (formData.captainEducation.type === "school") {
        if (!formData.captainEducation.schoolName?.trim()) {
          newErrors.captainSchoolName = "School name is required";
        }
        if (!formData.captainEducation.schoolClass?.trim()) {
          newErrors.captainSchoolClass = "Class is required";
        }
      } else if (formData.captainEducation.type === "college") {
        if (!formData.captainEducation.collegeName?.trim()) {
          newErrors.captainCollegeName = "College name is required";
        }
        if (!formData.captainEducation.collegeYear?.trim()) {
          newErrors.captainCollegeYear = "Year is required";
        }
        if (!formData.captainEducation.collegeBranch?.trim()) {
          newErrors.captainCollegeBranch = "Branch is required";
        }
      }
    }

    if (step === 2) {
      // Validate teammates (all 4 required)
      formData.teammates.forEach((teammate, index) => {
        const prefix = `teammate${index}`;
        
        if (!teammate.fullName.trim()) {
          newErrors[`${prefix}FullName`] = "Full name is required";
        }
        if (!teammate.ingameName.trim()) {
          newErrors[`${prefix}IngameName`] = "In-game name is required";
        }
        
        if (!teammate.education.type) {
          newErrors[`${prefix}EducationType`] = "Please select school or college";
        } else if (teammate.education.type === "school") {
          if (!teammate.education.schoolName?.trim()) {
            newErrors[`${prefix}SchoolName`] = "School name is required";
          }
          if (!teammate.education.schoolClass?.trim()) {
            newErrors[`${prefix}SchoolClass`] = "Class is required";
          }
        } else if (teammate.education.type === "college") {
          if (!teammate.education.collegeName?.trim()) {
            newErrors[`${prefix}CollegeName`] = "College name is required";
          }
          if (!teammate.education.collegeYear?.trim()) {
            newErrors[`${prefix}CollegeYear`] = "Year is required";
          }
          if (!teammate.education.collegeBranch?.trim()) {
            newErrors[`${prefix}CollegeBranch`] = "Branch is required";
          }
        }
      });
    }

    if (step === 3) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitRegistration = useCallback(async (): Promise<{ success: boolean; registrationId?: string }> => {
    const isValid = await validateStep(3);
    if (!isValid) return { success: false };

    setIsSubmitting(true);

    try {
      // Prepare player names and in-game names
      const playerNames = [
        formData.captainFullName,
        ...formData.teammates.map((t) => t.fullName),
      ];
      
      const playerIngameNames = [
        formData.captainIngameName,
        ...formData.teammates.map((t) => t.ingameName),
      ];

      // Prepare education details for teammates
      const playerEducationDetails = formData.teammates.map((t) => ({
        type: t.education.type,
        schoolName: t.education.schoolName || null,
        schoolClass: t.education.schoolClass || null,
        collegeName: t.education.collegeName || null,
        collegeYear: t.education.collegeYear || null,
        collegeBranch: t.education.collegeBranch || null,
      }));

      // Use edge function for rate limiting and duplicate protection
      const { data, error } = await supabase.functions.invoke('submit-registration', {
        body: {
          event_id: eventId,
          team_name: formData.teamName.trim(),
          captain_name: formData.captainFullName.trim(),
          captain_email: formData.captainEmail.trim().toLowerCase(),
          captain_phone: formData.captainMobile.trim(),
          captain_ingame_name: formData.captainIngameName.trim(),
          captain_education_type: formData.captainEducation.type,
          captain_school_name: formData.captainEducation.schoolName?.trim() || null,
          captain_school_class: formData.captainEducation.schoolClass?.trim() || null,
          captain_college_name: formData.captainEducation.collegeName?.trim() || null,
          captain_college_year: formData.captainEducation.collegeYear?.trim() || null,
          captain_college_branch: formData.captainEducation.collegeBranch?.trim() || null,
          player_names: playerNames,
          player_ingame_names: playerIngameNames,
          player_education_details: playerEducationDetails,
        },
      });

      if (error) throw error;

      // Check for error response from edge function
      if (data?.error) {
        // Handle specific error codes
        if (data.code === 'DUPLICATE_REGISTRATION') {
          toast.error("Email already registered", {
            description: data.error,
          });
        } else if (data.code === 'RATE_LIMITED' || data.code === 'EMAIL_RATE_LIMITED') {
          toast.error("Too many attempts", {
            description: data.error,
          });
        } else {
          toast.error("Registration failed", {
            description: data.error,
          });
        }
        return { success: false };
      }

      // Store registration ID for payment flow
      const newRegistrationId = data?.registration_id;
      if (newRegistrationId) {
        setRegistrationId(newRegistrationId);
      }

      return { success: true, registrationId: newRegistrationId };
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle edge function errors
      if (error?.message?.includes('429')) {
        toast.error("Too many attempts", {
          description: "Please wait a moment before trying again.",
        });
      } else {
        toast.error("Failed to submit registration", {
          description: "Please try again later.",
        });
      }
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [eventId, formData, validateStep]);

  const initiatePayment = useCallback(async (regId: string, eventName: string): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          event_id: eventId,
          registration_id: regId,
        },
      });

      if (orderError) throw orderError;

      if (orderData?.error) {
        toast.error("Payment initialization failed", {
          description: orderData.error,
        });
        return false;
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.body.appendChild(script);
        });
      }

      // Open Razorpay checkout
      // SECURITY: Amount is already in paise from backend, don't multiply again
      return new Promise((resolve) => {
        const options = {
          key: orderData.key_id,
          amount: orderData.amount, // Amount already in paise from create-razorpay-order
          currency: orderData.currency,
          name: 'LilyNex Esports',
          description: `Entry Fee - ${eventName}`,
          order_id: orderData.order_id,
          prefill: orderData.prefill,
          notes: orderData.notes,
          theme: {
            color: '#00E5FF',
          },
          handler: async function (response: any) {
            // Verify payment
            try {
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  registration_id: regId,
                },
              });

              if (verifyError || verifyData?.error) {
                toast.error("Payment verification failed", {
                  description: verifyData?.error || "Please contact support.",
                });
                resolve(false);
                return;
              }

              toast.success("Payment successful!", {
                description: "Your registration is confirmed.",
              });
              resolve(true);
            } catch (err) {
              console.error("Payment verification error:", err);
              toast.error("Payment verification failed");
              resolve(false);
            }
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment cancelled", {
                description: "You can retry payment from the event page.",
              });
              resolve(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Payment failed", {
        description: "Please try again.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [eventId]);

  return {
    formData,
    updateFormData,
    errors,
    isSubmitting,
    registrationId,
    validateStep,
    submitRegistration,
    initiatePayment,
  };
}