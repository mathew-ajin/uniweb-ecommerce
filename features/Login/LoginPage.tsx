"use client"
import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api/authService";
import { authPageSettings } from "@/data/mock/siteSettings";
import logoImg from "@/public/assets/company/logo.png";
import loginBg from "@/public/assets/auth-login-bg.jpg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

const LoginPage = () => {
  const { lang } = useLocale();
  const { setUser } = useAuth();
  const router = useRouter();
  const isAr = lang === "ar";
  const settings = authPageSettings.login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(!RECAPTCHA_SITE_KEY);

  const t = (en: string, ar: string) => (isAr ? ar : en);

  const validate = (): string | null => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return t("Please enter a valid email address", "يرجى إدخال بريد إلكتروني صالح");
    }
    if (!password) {
      return t("Password is required", "كلمة المرور مطلوبة");
    }
    if (RECAPTCHA_SITE_KEY && !recaptchaChecked) {
      return t("Please complete the reCAPTCHA verification", "يرجى إكمال التحقق من reCAPTCHA");
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const res = await authService.loginWithEmail({
      email,
      password,
      recaptchaToken: recaptchaChecked ? "verified" : undefined,
    });
    setLoading(false);

    if (res.success && res.user) {
      setUser(res.user);
      router.push("/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex" dir={isAr ? "rtl" : "ltr"}>
      {/* Left image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image src={loginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <h2 className="font-heading text-3xl xl:text-4xl font-bold text-white drop-shadow-lg mb-3">
            {t(settings.heading.en, settings.heading.ar)}
          </h2>
          <p className="text-white/85 text-lg max-w-md drop-shadow">{t(settings.subheading.en, settings.subheading.ar)}</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile hero banner */}
          <div className="lg:hidden relative rounded-xl overflow-hidden mb-8 h-48">
            <Image src={loginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex flex-col justify-end h-full p-5">
              <h2 className="font-heading text-xl font-bold text-white drop-shadow mb-1">
                {t(settings.heading.en, settings.heading.ar)}
              </h2>
              <p className="text-white/80 text-sm drop-shadow">{t(settings.subheading.en, settings.subheading.ar)}</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <Link href="/">
              {/* <Image src={logoImg} alt="Uniweb Shop" className="h-12 mx-auto mb-4" /> */}
              <Image src={logoImg} alt="Uniweb Shop" width={100} height={100} className="mb-4 object-contain mx-auto" />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-foreground">{t("Welcome Back", "مرحباً بعودتك")}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t("Sign in to continue your premium shopping experience", "سجل دخولك لمتابعة تجربة تسوقك المميزة")}
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-hero border border-border p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("Email", "البريد الإلكتروني")}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 ps-10 pe-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                    maxLength={255}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">{t("Password", "كلمة المرور")}</label>
                  <Link href="/forgot-password" className="text-xs text-brand hover:underline">
                    {t("Forgot Password?", "نسيت كلمة المرور؟")}
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 ps-10 pe-10 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* reCAPTCHA placeholder */}
              {RECAPTCHA_SITE_KEY ? (
                <div className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg">
                  <input
                    type="checkbox"
                    checked={recaptchaChecked}
                    onChange={(e) => setRecaptchaChecked(e.target.checked)}
                    className="h-5 w-5 rounded border-border text-brand focus:ring-brand accent-brand"
                  />
                  <span className="text-sm text-muted-foreground">{t("I'm not a robot", "لست روبوتًا")}</span>
                </div>
              ) : null}

              {error && <p className="text-destructive text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand text-brand-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {t("Login", "تسجيل الدخول")}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
                <Link href="/signup" className="text-brand font-medium hover:underline">
                  {t("Sign Up", "إنشاء حساب")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
