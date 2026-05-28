"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useCheckout } from '@/context/CheckoutContext';
import { useLocale } from '@/hooks/useLocale';
import { kuwaitAreas } from '@/data/mock/checkout';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const StepAddress = () => {
  const { state, setAddress } = useCheckout();
  const { lang } = useLocale();
  const router = useRouter();
  const isAr = lang === 'ar';
  const t = (en: string, ar: string) => isAr ? ar : en;

  // Prefill from checkout state (already populated from saved address or manual entry)
  const [form, setForm] = useState(() => ({
    area: state.address.area,
    block: state.address.block,
    street: state.address.street,
    building: state.address.building,
    floor: state.address.floor,
    flat: state.address.flat,
    notes: state.address.notes,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    const req = t('Required', 'مطلوب');
    if (!form.area.trim()) e.area = req;
    if (!form.block.trim()) e.block = req;
    if (!form.street.trim()) e.street = req;
    if (!form.building.trim()) e.building = req;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setAddress({
      fullName: state.customer.firstName + ' ' + state.customer.lastName,
      email: state.customer.email,
      phone: state.customer.phone,
      area: form.area.trim(),
      block: form.block.trim(),
      street: form.street.trim(),
      building: form.building.trim(),
      floor: form.floor.trim(),
      flat: form.flat.trim(),
      notes: form.notes.trim(),
    });
    router.push('/checkout/shipping');
  };

  const fieldClass = (k: string) =>
    `w-full h-10 px-3 bg-secondary border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
      errors[k] ? 'border-destructive' : 'border-transparent'
    }`;

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">
        {t('Delivery address details. Contact info is from the previous step.', 'تفاصيل عنوان التوصيل. معلومات الاتصال من الخطوة السابقة.')}
      </p>

      <div>
        <label className="text-xs font-medium text-foreground mb-1 block">{t('Area', 'المنطقة')} *</label>
        <select value={form.area} onChange={e => set('area', e.target.value)} className={fieldClass('area')}>
          <option value="">{t('Select area', 'اختر المنطقة')}</option>
          {kuwaitAreas.map(a => (
            <option key={a.en} value={a.en}>{isAr ? a.ar : a.en}</option>
          ))}
        </select>
        {errors.area && <p className="text-[11px] text-destructive mt-0.5">{errors.area}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{t('Block', 'القطعة')} *</label>
          <input value={form.block} onChange={e => set('block', e.target.value)} className={fieldClass('block')} maxLength={10} />
          {errors.block && <p className="text-[11px] text-destructive mt-0.5">{errors.block}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{t('Street', 'الشارع')} *</label>
          <input value={form.street} onChange={e => set('street', e.target.value)} className={fieldClass('street')} maxLength={100} />
          {errors.street && <p className="text-[11px] text-destructive mt-0.5">{errors.street}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{t('Building', 'المبنى')} *</label>
          <input value={form.building} onChange={e => set('building', e.target.value)} className={fieldClass('building')} maxLength={20} />
          {errors.building && <p className="text-[11px] text-destructive mt-0.5">{errors.building}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{t('Floor', 'الطابق')}</label>
          <input value={form.floor} onChange={e => set('floor', e.target.value)} className={fieldClass('floor')} maxLength={10} />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{t('Flat / Office', 'شقة / مكتب')}</label>
          <input value={form.flat} onChange={e => set('flat', e.target.value)} className={fieldClass('flat')} maxLength={20} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground mb-1 block">{t('Additional Notes', 'ملاحظات إضافية')}</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} maxLength={300}
          className="w-full px-3 py-2 bg-secondary border border-transparent rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder={t('Special delivery instructions...', 'تعليمات توصيل خاصة...')}
        />
      </div>

      <div className="flex gap-3">
        <button onClick={() => router.push('/checkout/details')} className="h-11 px-5 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors flex items-center gap-2 text-sm">
          <ArrowLeft size={16} />
          {t('Back', 'رجوع')}
        </button>
        <button onClick={submit} className="flex-1 h-11 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm">
          {t('Continue to Shipping', 'متابعة إلى الشحن')}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepAddress;
