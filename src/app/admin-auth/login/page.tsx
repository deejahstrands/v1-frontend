"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/store/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRememberCredentials } from "@/hooks/use-remember-credentials";
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const AdminLoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  const { rememberedCredentials, saveCredentials, clearCredentials } = useRememberCredentials();
  const [rememberMe, setRememberMe] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: rememberedCredentials.email,
    },
  });

  // Auto-fill email if remembered
  useEffect(() => {
    if (rememberedCredentials.email && rememberedCredentials.rememberMe) {
      setValue('email', rememberedCredentials.email);
      setRememberMe(true);
      console.log('🔐 Auto-filling remembered email:', rememberedCredentials.email);
    }
  }, [rememberedCredentials, setValue]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      console.log("Attempting admin login with:", data.email);
      
      // Save credentials if remember me is checked
      saveCredentials(data.email, rememberMe);
      
      // Create login payload without rememberMe field
      const loginPayload = {
        email: data.email,
        password: data.password
      };
      
      // Use the auth store login method instead of authService directly
      await login(loginPayload);
      
      console.log("Login completed, checking store state...");
      
      // Check if the user is an admin (this will be available in the store now)
      const { user, isAuthenticated } = useAuth.getState();
      
      console.log("Store state after login:", { user, isAuthenticated });
      
      if (user?.isAdmin) {
        console.log("User is admin, redirecting to dashboard...");
        toast.success("Login successful! Redirecting to admin dashboard...");
        
        // Small delay to ensure store state is stable before navigation
        setTimeout(() => {
          router.push("/admin");
        }, 100);
      } else {
        console.log("User is not admin, clearing auth state...");
        toast.error("Access denied. Admin privileges required.");
        // Clear the auth state since this user shouldn't have access
        useAuth.getState().logout();
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      // Prevent any redirects by staying on current page
      toast.error("Invalid credentials or an error occurred during login.");
      
      // Force stay on admin login page
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/admin-auth/login');
      }
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
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                  rememberedCredentials.email && rememberedCredentials.rememberMe ? 'bg-blue-50' : ''
                }`}
              />
              {rememberedCredentials.email && rememberedCredentials.rememberMe && (
                <p className="text-xs text-blue-600 mt-1">
                  ✓ Email auto-filled from saved credentials
                </p>
              )}
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
               disabled={isSubmitting || isLoading}
               className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 cursor-pointer"
             >
               {isSubmitting || isLoading ? "Signing in..." : "Continue"}
             </button>
           </form>
           
           {/* Remember Me section - outside the form so it doesn't get submitted */}
           <div className="flex items-center justify-between mt-4">
             <div className="flex items-center">
               <input
                 type="checkbox"
                 id="rememberMe"
                 checked={rememberMe}
                 onChange={(e) => setRememberMe(e.target.checked)}
                 className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
               />
               <label htmlFor="rememberMe" className="text-sm text-gray-700">
                 Remember me
               </label>
             </div>
             <button
               type="button"
               onClick={clearCredentials}
               className="text-sm text-gray-500 hover:text-gray-700 underline"
             >
               Clear saved
             </button>
           </div>
        </div>
      </div>
      <footer className="relative z-10 text-center text-white py-4 w-full flex items-center justify-center gap-2">
        <p>Copyright © {currentYear} Deejah Strands</p>
      </footer>
    </div>
  );
};

export default AdminLoginPage;
