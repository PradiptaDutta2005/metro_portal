"use client";
export const dynamic = "force-dynamic";

import { useState, ReactElement, FormEvent } from "react";
import { motion } from "framer-motion";
import { FileText, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "../Navigation";

// --- Types ---
type ComplaintForm = {
  rake_id: string;
  complaint: string;
  from_location: string;
  to_location: string;
  contact_email: string;
  contact_phone: string;
  category: string;
};

// --- Alert components ---
const Alert = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): ReactElement => (
  <div className={`flex items-start gap-2 rounded-lg border p-4 ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): ReactElement => (
  <div className={`text-sm ${className}`}>{children}</div>
);

const Complaint = (): ReactElement => {
  const [formData, setFormData] = useState<ComplaintForm>({
    rake_id: "",
    complaint: "",
    from_location: "",
    to_location: "",
    contact_email: "",
    contact_phone: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const metroStations: string[] = [
    "Aluva",
    "Pulinchodu",
    "Companypady",
    "Ambattukavu",
    "Muttom",
    "Kalamassery",
    "Cunat",
    "Pathalam",
    "Edappally",
    "Changampuzha Park",
    "Palarivattom",
    "JLN Stadium",
    "Kaloor",
    "Town Hall",
    "Maharaja's College",
    "Ernakulam South",
    "Kadavanthra",
    "Elamkulam",
    "Vyttila",
    "Thaikoodam",
    "Petta",
    "Maharaja's College Ground",
  ];

  const complaintCategories: string[] = [
    "Train Service Issues",
    "Station Facilities",
    "Staff Behavior",
    "Cleanliness",
    "Safety & Security",
    "Ticketing Issues",
    "Accessibility",
    "Others",
  ];

  const handleInputChange = (field: keyof ComplaintForm, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (
      !formData.rake_id ||
      !formData.complaint ||
      !formData.from_location ||
      !formData.to_location
    ) {
      setError(
        "Please fill in all required fields: Rake ID, Complaint Description, From Station, and To Station."
      );
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/complaints/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        let errorMessage = "Failed to submit complaint";

        if (data.detail) {
          if (typeof data.detail === "string") {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((d: any) => d.msg).join(", ");
          } else if (typeof data.detail === "object") {
            errorMessage = JSON.stringify(data.detail, null, 2);
          }
        }
        throw new Error(errorMessage);
      }

      setIsSubmitted(true);
      toast.success("Complaint submitted successfully!");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Complaint submit error:", err);
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <Navigation />
      <div className="container mt-15 mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            File a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Complaint
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We value your feedback. Help us improve our services by reporting
            any issues or concerns you experienced during your journey.
          </p>
        </motion.div>

        {/* Success Alert */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Thank you!</strong> Your complaint has been submitted
                successfully. We'll review it and get back to you within 24-48
                hours.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900 dark:via-gray-900 dark:to-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Complaint Details
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Please provide detailed information about your experience. All
                  fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rake ID */}
                  <div className="space-y-2">
                    <Label htmlFor="rake_id">Rake ID / Train Number *</Label>
                    <Input
                      id="rake_id"
                      placeholder="e.g., R001, Metro-A-123"
                      value={formData.rake_id}
                      onChange={(e) =>
                        handleInputChange("rake_id", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Complaint Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => handleInputChange("category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select complaint category" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintCategories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Journey */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>From Station *</Label>
                      <Select
                        value={formData.from_location}
                        onValueChange={(v) =>
                          handleInputChange("from_location", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select departure station" />
                        </SelectTrigger>
                        <SelectContent>
                          {metroStations.map((st) => (
                            <SelectItem key={st} value={st}>
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>To Station *</Label>
                      <Select
                        value={formData.to_location}
                        onValueChange={(v) =>
                          handleInputChange("to_location", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination station" />
                        </SelectTrigger>
                        <SelectContent>
                          {metroStations.map((st) => (
                            <SelectItem key={st} value={st}>
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="complaint">Complaint Description *</Label>
                    <Textarea
                      id="complaint"
                      placeholder="Describe your complaint in detail..."
                      value={formData.complaint}
                      onChange={(e) =>
                        handleInputChange("complaint", e.target.value)
                      }
                      required
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      id="contact_email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.contact_email}
                      onChange={(e) =>
                        handleInputChange("contact_email", e.target.value)
                      }
                    />
                    <Input
                      id="contact_phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.contact_phone}
                      onChange={(e) =>
                        handleInputChange("contact_phone", e.target.value)
                      }
                    />
                  </div>

                  {/* Submit */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-400"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Complaint
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
