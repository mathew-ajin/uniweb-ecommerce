import { useLocale } from '@/hooks/useLocale';
import type { TrackingStep } from '@/types/tracking';
import { Check, Circle, Clock } from 'lucide-react';

interface Props {
  steps: TrackingStep[];
}

const TrackingTimeline = ({ steps }: Props) => {
  const { t } = useLocale();

  const formatTime = (ts?: string) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.id} className="flex gap-4 relative">
            {/* Line */}
            {!isLast && (
              <div
                className={`absolute start-[15px] top-8 w-0.5 h-[calc(100%-8px)] ${
                  step.status === 'completed' ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
            {/* Icon */}
            <div className="flex-shrink-0 relative z-10 mt-0.5">
              {step.status === 'completed' ? (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Check size={14} className="text-primary-foreground" />
                </div>
              ) : step.status === 'active' ? (
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center ring-4 ring-brand/20">
                  <Clock size={14} className="text-brand-foreground" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                  <Circle size={10} className="text-muted-foreground" />
                </div>
              )}
            </div>
            {/* Content */}
            <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-medium ${
                step.status === 'active'
                  ? 'text-brand'
                  : step.status === 'completed'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}>
                {t(step.label)}
              </p>
              {step.timestamp && (
                <p className="text-xs text-muted-foreground mt-0.5">{formatTime(step.timestamp)}</p>
              )}
              {step.note && (
                <p className="text-xs text-muted-foreground mt-1 italic">{t(step.note)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingTimeline;
