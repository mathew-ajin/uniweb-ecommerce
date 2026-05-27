"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api/authService";
import { authPageSettings } from "@/data/mock/siteSettings";
import logoImg from "@/public/assets/company/logo.png";
import signupBg from "@/public/assets/auth-signup-bg.jpg";
import Image from "next/image";

// const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  country?: string;
  pinCode?: string;
  password?: string;
  confirmPassword?: string;
  recaptcha?: string;
}

const SignupPage = () => {
  const { lang } = useLocale();
  const { setUser } = useAuth();
  const router = useRouter();
  const isAr = lang === "ar";
  const settings = authPageSettings.signup;

  const t = (en: string, ar: string) => (isAr ? ar : en);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    country: "",
    pinCode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(!RECAPTCHA_SITE_KEY);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = t("Name is required", "الاسم مطلوب");
    if (!form.phone.trim() || form.phone.length < 8) e.phone = t("Invalid phone number", "رقم هاتف غير صالح");
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t("Invalid email", "بريد إلكتروني غير صالح");
    if (!form.address.trim()) e.address = t("Address is required", "العنوان مطلوب");
    if (!form.country.trim()) e.country = t("Country is required", "الدولة مطلوبة");
    if (!form.pinCode.trim()) e.pinCode = t("Pin code is required", "الرمز البريدي مطلوب");

    // Password rules
    if (!form.password) {
      e.password = t("Password is required", "كلمة المرور مطلوبة");
    } else if (form.password.length < 8) {
      e.password = t("Password must be at least 8 characters", "كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    } else if (!/[a-zA-Z]/.test(form.password)) {
      e.password = t("Password must contain at least one letter", "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل");
    } else if (!/\d/.test(form.password)) {
      e.password = t("Password must contain at least one number", "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
    }

    if (!form.confirmPassword) {
      e.confirmPassword = t("Please confirm your password", "يرجى تأكيد كلمة المرور");
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = t("Passwords do not match", "كلمات المرور غير متطابقة");
    }

    if (RECAPTCHA_SITE_KEY && !recaptchaChecked) {
      e.recaptcha = t("Please complete the reCAPTCHA verification", "يرجى إكمال التحقق من reCAPTCHA");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    const res = await authService.signup({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      address: form.address,
      country: form.country,
      pinCode: form.pinCode,
      password: form.password,
      recaptchaToken: recaptchaChecked ? "verified" : undefined,
    });
    setLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      router.push("/");
    } else {
      setServerError(res.message);
    }
  };

  const fields: {
    key: keyof typeof form;
    label: string;
    labelAr: string;
    type: string;
    placeholder: string;
    dir?: string;
    maxLength?: number;
  }[] = [
    { key: "fullName", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "John Doe", maxLength: 100 },
    {
      key: "phone",
      label: "Phone Number",
      labelAr: "رقم الهاتف",
      type: "tel",
      placeholder: "+965 XXXX XXXX",
      dir: "ltr",
      maxLength: 20,
    },
    {
      key: "email",
      label: "Email",
      labelAr: "البريد الإلكتروني",
      type: "email",
      placeholder: "john@example.com",
      dir: "ltr",
      maxLength: 255,
    },
    {
      key: "address",
      label: "Full Address",
      labelAr: "العنوان الكامل",
      type: "text",
      placeholder: "Block 5, Street 10, Kuwait City",
      maxLength: 300,
    },
    { key: "country", label: "Country", labelAr: "الدولة", type: "text", placeholder: "Kuwait", maxLength: 100 },
    {
      key: "pinCode",
      label: "Pin Code",
      labelAr: "الرمز البريدي",
      type: "text",
      placeholder: "12345",
      dir: "ltr",
      maxLength: 10,
    },
  ];

  return (
    <div className="min-h-screen flex" dir={isAr ? "rtl" : "ltr"}>
      {/* Left image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image src={signupBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <h2 className="font-heading text-3xl xl:text-4xl font-bold text-white drop-shadow-lg mb-3">
            {t(settings.heading.en, settings.heading.ar)}
          </h2>
          <p className="text-white/85 text-lg max-w-md drop-shadow">{t(settings.subheading.en, settings.subheading.ar)}</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary p-4 sm:p-8 py-8">
        <div className="w-full max-w-md">
          {/* Mobile hero banner */}
          <div className="lg:hidden relative rounded-xl overflow-hidden mb-8 h-44">
            <Image src={signupBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
            <h1 className="font-heading text-2xl font-bold text-foreground">{t("Create Account", "إنشاء حساب")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("Join Uniweb Shop", "انضم إلى ميار شوب")}</p>
          </div>

          <div className="bg-card rounded-xl shadow-hero border border-border p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-foreground mb-1">{t(f.label, f.labelAr)}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    dir={f.dir}
                    maxLength={f.maxLength}
                    className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors[f.key] && <p className="text-destructive text-xs mt-0.5">{errors[f.key]}</p>}
                </div>
              ))}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t("Password", "كلمة المرور")}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    maxLength={128}
                    className="w-full h-10 px-3 pe-10 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs mt-0.5">{errors.password}</p>}
                {!errors.password && form.password.length > 0 && form.password.length < 8 && (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {t("Min 8 characters, 1 letter, 1 number", "الحد الأدنى 8 أحرف، حرف واحد، رقم واحد")}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("Confirm Password", "تأكيد كلمة المرور")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    maxLength={128}
                    className="w-full h-10 px-3 pe-10 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-destructive text-xs mt-0.5">{errors.confirmPassword}</p>}
              </div>

              {/* reCAPTCHA placeholder */}
              {RECAPTCHA_SITE_KEY ? (
                <div>
                  <div className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg">
                    <input
                      type="checkbox"
                      checked={recaptchaChecked}
                      onChange={(e) => {
                        setRecaptchaChecked(e.target.checked);
                        setErrors((prev) => ({ ...prev, recaptcha: undefined }));
                      }}
                      className="h-5 w-5 rounded border-border text-brand focus:ring-brand accent-brand"
                    />
                    <span className="text-sm text-muted-foreground">{t("I'm not a robot", "لست روبوتًا")}</span>
                  </div>
                  {errors.recaptcha && <p className="text-destructive text-xs mt-0.5">{errors.recaptcha}</p>}
                </div>
              ) : null}

              {serverError && <p className="text-destructive text-sm">{serverError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand text-brand-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {t("Sign Up", "إنشاء حساب")}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
                <Link href="/login" className="text-brand font-medium hover:underline">
                  {t("Login", "تسجيل الدخول")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
