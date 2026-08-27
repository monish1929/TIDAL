"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Waves, Shield, ArrowRight, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSelector } from "@/components/language-selector";
import {
  saveUserProfile,
  setStoredLanguage,
  getStoredLanguage,
  findRegisteredAccount,
} from "@/lib/storage";
import { LanguageCode, UserRole } from "@/types/user";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(getStoredLanguage());

  // Form State
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Field-level error messages
  const [errors, setErrors] = useState<{
    name?: string;
    identifier?: string;
    password?: string;
  }>({});

  const handleLanguageChange = (newLang: LanguageCode) => {
    setCurrentLanguage(newLang);
    setStoredLanguage(newLang);
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; identifier?: string; password?: string } = {};

    if (mode === "signup" && !name.trim()) {
      newErrors.name = "This field is required";
    }

    if (!identifier.trim()) {
      newErrors.identifier = "This field is required";
    }

    if (!password.trim()) {
      newErrors.password = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const normalizedEmail = identifier.trim().toLowerCase();
    const existingAccount = findRegisteredAccount(normalizedEmail);

    // Debug log per requirement to trace login decision
    console.log("[TIDAL Auth Debug]", {
      email: normalizedEmail,
      matchedProfile: existingAccount || null,
      roleFound: existingAccount?.role || null,
      targetRoute: existingAccount && existingAccount.role ? "/dashboard" : "/onboarding",
    });

    if (mode === "signup") {
      // New user signup -> save active session with role unset, route to /onboarding
      saveUserProfile({
        name: name.trim(),
        identifier: normalizedEmail,
        role: undefined as unknown as UserRole, // intentionally unset to trigger onboarding
        languagePreference: currentLanguage,
        isAuthenticated: true,
      });
      router.push("/onboarding");
    } else {
      // Returning user login
      if (existingAccount && existingAccount.role) {
        // Role already exists for this account -> restore session & route straight to /dashboard
        saveUserProfile({
          ...existingAccount,
          isAuthenticated: true,
        });
        router.push("/dashboard");
      } else {
        // Account exists without role or is first-time login -> route to /onboarding
        saveUserProfile({
          name: existingAccount?.name || normalizedEmail.split("@")[0] || "Marine User",
          identifier: normalizedEmail,
          languagePreference: currentLanguage,
          isAuthenticated: true,
        });
        router.push("/onboarding");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Header bar with Language selector */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-dark-text text-base">TIDAL</span>
            <span className="text-[11px] font-normal text-dark-muted ml-2 hidden sm:inline-block">
              Marine Decision Copilot
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-muted hidden md:inline">Language:</span>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-[420px] mx-auto my-auto py-8">
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-card">
          {/* Card Title & Subtitle */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-dark-text tracking-tight">
              {mode === "login" ? "Sign in to TIDAL" : "Create your TIDAL account"}
            </h1>
            <p className="text-xs text-dark-muted mt-1.5 leading-relaxed">
              {mode === "login"
                ? "Access oceanographic intelligence, PFZ advisories, and risk reasoning."
                : "Join the collaborative decision intelligence platform for marine operations."}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-gray-100/80 rounded-lg mb-6 border border-gray-200/60">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrors({});
              }}
              className={`text-xs py-2 rounded-md font-medium transition-all ${
                mode === "login"
                  ? "bg-white text-dark-text shadow-subtle font-semibold"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrors({});
              }}
              className={`text-xs py-2 rounded-md font-medium transition-all ${
                mode === "signup"
                  ? "bg-white text-dark-text shadow-subtle font-semibold"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-dark-text">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-dark-muted absolute left-3 top-3" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Enter your full name"
                    className={`pl-9 ${errors.name ? "border-rose-300 focus-visible:ring-rose-400" : ""}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-dark-text">
                Email or Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-dark-muted absolute left-3 top-3" />
                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  placeholder="name@example.com or +91..."
                  className={`pl-9 ${errors.identifier ? "border-rose-300 focus-visible:ring-rose-400" : ""}`}
                />
              </div>
              {errors.identifier && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.identifier}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-dark-text">
                  Password <span className="text-rose-500">*</span>
                </label>
                {mode === "login" && (
                  <span className="text-[11px] text-dark-muted hover:text-primary cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-dark-muted absolute left-3 top-3" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`pl-9 ${errors.password ? "border-rose-300 focus-visible:ring-rose-400" : ""}`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2 h-10 gap-2 font-medium">
              <span>{mode === "login" ? "Sign In to Platform" : "Continue to Preferences"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Privacy & Auth Note */}
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-dark-muted text-center">
            <Shield className="w-3.5 h-3.5 text-dark-light shrink-0" />
            <span>Secure marine decision intelligence infrastructure</span>
          </div>
        </div>
      </main>


    </div>
  );
}
