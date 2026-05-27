import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useCheckout } from '@/context/CheckoutContext';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { User, ArrowRight, MapPin, Check } from 'lucide-react';

const StepDetails = () => {
  const { state, setCustomer, savedAddresses, applySavedAddress } = useCheckout();
  const { isLoggedIn } = useAuth();
  const { lang } = useLocale();
  const router = useRouter();
  const isAr = lang === 'ar';
  const t = (en: string, ar: string) => isAr ? ar : en;

  const [form, setForm] = useState(() => ({ ...state.customer }));
  const [selAddrId, setSelAddrId] = useState<string>(state.selectedAddressId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSelectAddress = (addr: typeof savedAddresses[0]) => {
    setSelAddrId(addr.id);
    setForm({
      firstName: addr.firstName,
      lastName: addr.lastName,
      email: addr.email,
      phone: addr.phone,
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = t('Required', 'مطلوب');
    if (!form.lastName.trim()) e.lastName = t('Required', 'مطلوب');
    if (!form.email.trim()) e.email = t('Please enter your email address', 'يرجى إدخال بريدك الإلكتروني');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('Invalid email', 'بريد غير صالح');
    if (!form.phone.trim()) e.phone = t('Please enter your phone number', 'يرجى إدخال رقم هاتفك');
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone.replace(/\s/g, ''))) e.phone = t('Invalid phone', 'رقم غير صالح');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setCustomer({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    // If a saved address was selected, apply it fully (updates address fields too)
    if (isLoggedIn && selAddrId) {
      const selected = savedAddresses.find(a => a.id === selAddrId);
      if (selected) applySavedAddress(selected);
      // Override contact with potentially edited form values
      setCustomer({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
    }
    router.push('/checkout/address');
  };

  const fieldClass = (k: string) =>
    `w-full h-10 px-3 bg-secondary border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
      errors[k] ? 'border-destructive' : 'border-transparent'
    }`;

  return (
    <div className="space-y-6">
      {!isLoggedIn && (
        <div className="flex items-center gap-2 text-muted-foreground text-xs bg-secondary/60 px-3 py-2 rounded-md">
          <User size={14} />
          {t('Guest checkout — no account required', 'الدفع كضيف — لا يتطلب حساب')}
        </div>
      )}

      {/* Saved Addresses — logged-in only */}
      {isLoggedIn && savedAddresses.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {t('Select a saved address', 'اختر عنواناً محفوظاً')}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {savedAddresses.map(addr => {
              const active = selAddrId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleSelectAddress(addr)}
                  className={`w-full text-start p-3.5 rounded-lg border-2 transition-colors relative ${
                    active ? 'border-brand bg-brand/5' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  {active && (
                    <span className="absolute top-2.5 end-2.5 w-5 h-5 rounded-full bg-brand text-brand-foreground flex items-center justify-center">
                      <Check size={12} />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-medium bg-brand/10 text-brand px-1.5 py-0.5 rounded">
                        {t('Default', 'افتراضي')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground font-medium">{addr.firstName} {addr.lastName}</p>
                  <p className="text-xs text-muted-foreground">{addr.phone}</p>
                  <p className="text-xs text-muted-foreground">{addr.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {addr.building}, {addr.street}, {t('Block', 'قطعة')} {addr.block}, {addr.area}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact Details */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{t('First Name', 'الاسم الأول')} *</label>
          <input value={form.firstName} onChange={e => set('firstName', e.target.value)} className={fieldClass('firstName')} placeholder={t('John', 'محمد')} maxLength={50} />
          {errors.firstName && <p className="text-[11px] text-destructive mt-0.5">{errors.firstName}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{t('Last Name', 'الاسم الأخير')} *</label>
          <input value={form.lastName} onChange={e => set('lastName', e.target.value)} className={fieldClass('lastName')} placeholder={t('Doe', 'العلي')} maxLength={50} />
          {errors.lastName && <p className="text-[11px] text-destructive mt-0.5">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground mb-1 block">{t('Email', 'البريد الإلكتروني')} *</label>
        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={fieldClass('email')} placeholder="email@example.com" maxLength={100} />
        {errors.email && <p className="text-[11px] text-destructive mt-0.5">{errors.email}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-foreground mb-1 block">{t('Phone', 'رقم الهاتف')} *</label>
        <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={fieldClass('phone')} placeholder="+965 XXXX XXXX" maxLength={20} />
        {errors.phone && <p className="text-[11px] text-destructive mt-0.5">{errors.phone}</p>}
      </div>

      <button onClick={submit} className="w-full h-11 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm">
        {t('Continue to Address', 'متابعة إلى العنوان')}
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default StepDetails;
