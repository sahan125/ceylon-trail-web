"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please verify your credentials.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Hard redirect to /admin to ensure middleware and cookies sync immediately
      window.location.href = "/admin";
    } catch (err: any) {
      console.error("Login request error:", err);
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08101E] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Website Return link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Lankatrails.lk</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white shadow-xl shadow-orange-600/10 mb-2">
              <Image
                src="/images/logo.png"
                alt="Lankatrails"
                width={90}
                height={60}
                priority
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Lankatrails.lk
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-sm border border-orange-500/30">
                Staff Only
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
              Airport Dispatch &amp; Reservation Desk Portal
            </p>
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-[11px]">
            <KeyRound className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Restricted area. Authorized administrative personnel only.</span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span className="font-bold block">Access Denied</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authentication verified. Redirecting to workspace...</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-300"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@ceylontrail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-white placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-white placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#C2410C] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-600/30 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate &amp; Enter Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              Lankatrails.lk Management System • Protected by HTTP-only Session Security
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
