import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, ShieldCheck, ArrowRight, ArrowLeft, Smartphone,
  RotateCcw, CheckCircle2, Lock, Mail, Sparkles, HelpCircle,
  Eye, EyeOff
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext.jsx";
import authClient from "../../services/authClient.js";
import Logo from "../../components/common/Logo.jsx";

const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

const getErrorMessage = (err) => {
  const errorDetail = err?.response?.data?.error;
  if (errorDetail?.message) return errorDetail.message;
  const msg = err?.response?.data?.message;
  if (msg) return msg;
  if (typeof err?.response?.data === "string") return err.response.data;
  if (!err?.response && (err?.code === "ERR_NETWORK" || err?.message?.includes("Network Error"))) {
    return "Central Auth service is currently unreachable. Please try again shortly.";
  }
  return err?.message || "Something went wrong.";
};

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState("phone");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [loginMode, setLoginMode] = useState("password");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const handleContactChange = (e) => {
    const raw = e.target.value;
    const hasNonDigit = /[^0-9]/.test(raw);

    let normalized = "";
    if (hasNonDigit) {
      normalized = raw.replace(/[^a-zA-Z0-9._%+-@]/g, "");
    } else {
      normalized = raw.slice(0, 10);
    }

    setContact(normalized);
    setError("");
  };

  const validateContactInput = (inputVal) => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      return "Please enter your mobile number or email address.";
    }

    const isEmail = trimmed.includes("@") || /[a-zA-Z]/.test(trimmed);
    if (isEmail) {
      if (!isValidEmail(trimmed)) {
        return "Please enter a valid email format (e.g. name@gmail.com).";
      }
    } else {
      if (!/^\d{10}$/.test(trimmed)) {
        return "Please enter a valid 10-digit mobile number.";
      }
    }
    return null;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateContactInput(contact);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your account password.");
      return;
    }

    const isEmail = contact.includes("@");
    if (!isEmail) {
      setError("Central Auth login requires your registered email address.");
      return;
    }

    setIsLoggingIn(true);

    try {
      await login({
        email: contact.trim(),
        password,
      });

      const redirectTarget = new URLSearchParams(window.location.search).get("redirect") || "/";
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateContactInput(contact);
    if (validationError) {
      setError(validationError);
      return;
    }

    const isEmail = contact.includes("@") || /[a-zA-Z]/.test(contact);
    if (isEmail) {
      setError("Central Auth phone verification requires a valid mobile number.");
      return;
    }

    const formattedPhone = contact.trim().startsWith("+")
      ? contact.trim()
      : `+91${contact.trim()}`;

    setIsSendingOtp(true);

    try {
      const res = await authClient.sendOtp({
        phone: formattedPhone,
        accountType: "CUSTOMER",
        purpose: "PHONE_VERIFICATION",
      });

      if (res?.challengeId) {
        setChallengeId(res.challengeId);
      }
      setStep("otp");
      setTimer(res?.cooldownSeconds || 30);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index, val) => {
    if (val && !/^\d$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    setError("");

    if (val && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      if (el) el.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const entered = otp.join("");
    if (entered.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    const formattedPhone = contact.trim().startsWith("+")
      ? contact.trim()
      : `+91${contact.trim()}`;

    setIsVerifyingOtp(true);

    try {
      const res = await authClient.verifyOtp({
        challengeId,
        otp: entered,
        phone: formattedPhone,
        accountType: "CUSTOMER",
        purpose: "PHONE_VERIFICATION",
      });

      if (res?.verified || res?.success) {
        setError("");
        setStep("phone");
        setLoginMode("password");
        setError("Phone verified successfully! Please enter your password to sign in.");
      } else {
        setError("OTP verification could not be completed.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isSendingOtp) return;
    setError("");
    const formattedPhone = contact.trim().startsWith("+")
      ? contact.trim()
      : `+91${contact.trim()}`;

    setIsSendingOtp(true);

    try {
      const res = await authClient.sendOtp({
        phone: formattedPhone,
        accountType: "CUSTOMER",
        purpose: "PHONE_VERIFICATION",
      });
      if (res?.challengeId) {
        setChallengeId(res.challengeId);
      }
      setTimer(res?.cooldownSeconds || 30);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#111925] flex flex-col justify-between font-sans overflow-x-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Top Header */}
      <header className="bg-white border-b border-[#ECEEF2] py-3.5 sm:py-4 px-4 sm:px-6">
        <div className="max-w-[1216px] mx-auto flex items-center justify-between">
          <Logo />

          <Link
            to="/categories"
            className="text-[11px] sm:text-xs font-bold text-[#111925] bg-[#F4F5F8] hover:bg-[#ECEEF2] border border-[#ECEEF2] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      </header>

      {/* CENTER LOGIN CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
        <div className="max-w-md w-full bg-white border border-[#ECEEF2] rounded-3xl p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6 text-left relative overflow-hidden">
          
          {/* Top Pill Badge */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#111925] bg-[#FFF8E1] px-3.5 py-1.5 rounded-full border border-[#FEC201]/40 mb-1">
              <ShieldCheck size={13} className="text-[#FEC201]" /> Secure Customer Portal
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111925]">
              Welcome Back to FillCarts
            </h1>
            <p className="text-xs text-[#6B7280] font-medium">
              Log in to manage orders, daily subscriptions & saved addresses.
            </p>
          </div>

          {/* Login Method Tabs */}
          {step === "phone" && (
            <div className="grid grid-cols-2 bg-[#F4F5F8] border border-[#ECEEF2] p-1 rounded-full text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => { setLoginMode("otp"); setError(""); }}
                className={`py-2 rounded-full transition-all cursor-pointer ${
                  loginMode === "otp"
                    ? "bg-[#FEC201] text-[#111925] shadow-xs font-extrabold"
                    : "text-[#6B7280] hover:text-[#111925]"
                }`}
              >
                OTP Verification
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode("password"); setError(""); }}
                className={`py-2 rounded-full transition-all cursor-pointer ${
                  loginMode === "password"
                    ? "bg-[#FEC201] text-[#111925] shadow-xs font-extrabold"
                    : "text-[#6B7280] hover:text-[#111925]"
                }`}
              >
                Password Login
              </button>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <span className="shrink-0 font-black">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: OTP EMAIL / PHONE INPUT */}
          {step === "phone" && loginMode === "otp" && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111925] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <Phone size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={contact}
                    onChange={handleContactChange}
                    className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full pl-10 pr-4 py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full bg-[#FEC201] hover:bg-[#F5B800] disabled:opacity-50 disabled:cursor-not-allowed text-[#111925] font-extrabold text-xs py-3.5 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isSendingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#111925] border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Get Verification OTP</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 1: PASSWORD LOGIN WITH VISIBILITY TOGGLE */}
          {step === "phone" && loginMode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111925] mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="Enter name@email.com"
                    value={contact}
                    onChange={handleContactChange}
                    className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full pl-10 pr-4 py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111925] mb-1.5">
                  Account Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full bg-[#F4F5F8] border border-[#ECEEF2] rounded-full pl-10 pr-10 py-3 text-xs font-semibold text-[#111925] focus:outline-none focus:border-[#FEC201] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#FEC201] hover:bg-[#F5B800] disabled:opacity-50 disabled:cursor-not-allowed text-[#111925] font-extrabold text-xs py-3.5 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#111925] border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login with Password</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* GOOGLE SIGN-IN BUTTON */}
          {step === "phone" && (
            <div className="space-y-4">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#ECEEF2]"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-[#ECEEF2]"></div>
              </div>

              <div className="w-full flex justify-center" title="Coming soon">
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="w-full max-w-[260px] py-2.5 px-4 rounded-full border border-[#ECEEF2] bg-[#F4F5F8] text-slate-400 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-75 shadow-xs"
                >
                  <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google (Coming soon)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-[#FFF8E1] text-[#111925] rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-base font-extrabold text-[#111925]">Enter 6-Digit OTP</h3>
                <p className="text-xs text-[#6B7280]">
                  Sent to <span className="font-bold text-[#111925]">{contact}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && idx > 0) {
                        const prev = document.getElementById(`otp-${idx - 1}`);
                        if (prev) prev.focus();
                      }
                    }}
                    className="w-11 h-12 text-center text-lg font-black bg-[#F4F5F8] border border-[#ECEEF2] rounded-xl focus:outline-none focus:border-[#FEC201] transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp || otp.join("").length < 6}
                className="w-full bg-[#FEC201] hover:bg-[#F5B800] disabled:opacity-50 disabled:cursor-not-allowed text-[#111925] font-extrabold text-xs py-3.5 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isVerifyingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#111925] border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <CheckCircle2 size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setError(""); }}
                  className="text-[#6B7280] hover:text-[#111925] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} /> Change Contact
                </button>

                {timer > 0 ? (
                  <span className="text-slate-400 font-bold">Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isSendingOtp}
                    className="text-[#111925] font-extrabold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <RotateCcw size={12} /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Registration Link */}
          <div className="pt-2 border-t border-[#ECEEF2] text-center">
            <p className="text-xs text-[#6B7280] font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#111925] font-extrabold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="py-4 text-center text-xs text-[#6B7280] border-t border-[#ECEEF2]">
        © {new Date().getFullYear()} FillCarts. Safe & Encrypted Customer Gateway.
      </footer>
    </div>
  );
}
