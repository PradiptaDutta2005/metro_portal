"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Train, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Role = "Locopilot" | "Engineer" | "Admin" | "Employee" | "Maintainer";

interface RegisterResponse {
  access_token?: string;
  detail?: string;
}

const RegisterClient = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    role: Role | "";
  }>({
    email: "",
    password: "",
    role: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles: Role[] = [
    "Locopilot",
    "Engineer",
    "Admin",
    "Employee",
    "Maintainer",
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        toast.success(`${formData.role} registered & logged in!`);

        const redirectPath =
          formData.role === "Locopilot"
            ? "/passenger_dashboard"
            : formData.role === "Engineer"
            ? "/engineer_dashboard"
            : formData.role === "Admin"
            ? "/dashboard"
            : "/employee_dashboard";

        router.push(redirectPath);
      } else {
        toast.error("Registration succeeded but no token returned.");
        router.push("/login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred during registration.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-green-900 dark:via-green-950 dark:to-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-900 dark:via-gray-900 dark:to-green-900">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Train className="h-8 w-8 text-green-600 dark:text-green-400 mr-2" />
              <CardTitle className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                Register for Kochi Metro
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Create your account and access the dashboard instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 text-gray-600 dark:text-gray-300"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600 dark:text-green-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 text-gray-600 dark:text-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: Role) =>
                    handleInputChange("role", value)
                  }
                >
                  <SelectTrigger className="border-green-600 dark:border-green-400 text-gray-600 dark:text-gray-300">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </motion.div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-green-600 dark:text-green-400 hover:underline"
                >
                  Sign in
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterClient;
