"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const AdminLoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred during login.");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0E0E0E]">
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-sm w-full text-black">
          <div className="text-center mb-6 flex flex-col items-center">
            <Image
              src="/logo/logo.svg"
              alt="Deejah Strands Logo"
              width={80}
              height={80}
            />
            <h2 className="text-2xl font-bold mt-4">
              Welcome to Deejah Strands
            </h2>
            <p className="text-gray-500 mt-2">
              Enter your details below to login your account.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter Email Address"
                className={`mt-1 block w-full px-3 py-2 bg-white border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="Enter Password"
                className={`mt-1 block w-full px-3 py-2 bg-white border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
      <footer className="relative z-10 text-center text-white py-4 w-full flex items-center justify-center gap-2">
        <p>Copyright © {currentYear} Deejah Strands</p>
      </footer>
    </div>
  );
};

export default AdminLoginPage;
