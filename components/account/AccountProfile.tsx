import { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/hooks/useLocale';
import { toast } from '@/hooks/use-toast';

const AccountProfile = () => {
  const { user, setUser } = useAuth();
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || 'Kuwait',
    address: user?.address || '',
    pinCode: user?.pinCode || '',
  });

  const handleSave = () => {
    const updated = { ...user!, ...form };
    setUser(updated);
    localStorage.setItem('mayar_user', JSON.stringify(updated));
    toast({ title: t('Profile updated', 'تم تحديث الحساب') });
  };

  const fields: { key: keyof typeof form; label: string; type?: string }[] = [
    { key: 'fullName', label: t('Full Name', 'الاسم الكامل') },
    { key: 'email', label: t('Email', 'البريد الإلكتروني'), type: 'email' },
    { key: 'phone', label: t('Phone Number', 'رقم الهاتف'), type: 'tel' },
    { key: 'country', label: t('Country', 'الدولة') },
    { key: 'address', label: t('Default Address', 'العنوان الافتراضي') },
    { key: 'pinCode', label: t('Pin Code', 'الرمز البريدي') },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">{t('Profile Details', 'تفاصيل الحساب')}</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full h-10 px-3 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-brand text-brand-foreground rounded-lg font-medium text-sm hover:bg-brand/90 transition-colors"
        >
          <Save size={16} />
          {t('Save Changes', 'حفظ التعديلات')}
        </button>
      </div>
    </div>
  );
};

export default AccountProfile;
