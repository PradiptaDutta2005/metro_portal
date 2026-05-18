"use client";
import { useState, FormEvent, ReactElement } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Train, Lock, User } from "lucide-react";
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

type FormData = {
  id: string;
  password: string;
  role: string;
};

const LoginClient = (): ReactElement => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    id: "",
    password: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const roles: string[] = ["Locopilot", "Engineer", "Admin", "Employee", "Maintainer"];

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.id || !formData.password || !formData.role) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!validateEmail(formData.id)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.id,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.");
      }

      const data: { access_token: string } = await response.json();

      localStorage.setItem("token", data.access_token);

      toast.success(`${formData.role} login successful!`);

      const redirectPath =
        formData.role === "Locopilot"
          ? "/passenger_dashboard"
          : formData.role === "Engineer"
          ? "/engineer_dashboard"
          : formData.role === "Admin"
          ? "/dashboard"
          : formData.role === "Maintainer"
          ? "/maintainer_dashboard"
          : "/employee_dashboard";

      router.push(redirectPath);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-950 dark:to-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900 dark:via-gray-900 dark:to-blue-900">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Train className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
              <CardTitle className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                Kochi Metro Login
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className="border-blue-600 dark:border-blue-400 text-gray-600 dark:text-gray-300">
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

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="id">Email *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <Input
                    id="id"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 text-gray-600 dark:text-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 text-gray-600 dark:text-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>

              {/* Navigation Links */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Register here
                </a>
              </p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                Return to{" "}
                <a
                  href="/"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Home
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginClient;
