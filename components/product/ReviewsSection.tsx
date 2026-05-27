import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { ReviewItem } from '@/types/product';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  rating: number;
  reviewCount: number;
}

const ReviewsSection = ({ reviews, rating, reviewCount }: ReviewsSectionProps) => {
  const { lang } = useLocale();

  // Rating distribution (mock)
  const distribution = [
    { stars: 5, pct: 65 },
    { stars: 4, pct: 22 },
    { stars: 3, pct: 8 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">
        {lang === 'ar' ? 'التقييمات والمراجعات' : 'Ratings & Reviews'}
      </h2>

      <div className="grid md:grid-cols-[240px_1fr] gap-8 mb-8">
        {/* Summary */}
        <div className="text-center md:text-start">
          <div className="text-4xl font-bold text-foreground mb-1">{rating.toFixed(1)}</div>
          <div className="flex items-center justify-center md:justify-start gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={14} className={s <= Math.round(rating) ? 'fill-brand text-brand' : 'text-border'} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{reviewCount} {lang === 'ar' ? 'تقييم' : 'reviews'}</p>
        </div>

        {/* Distribution bars */}
        <div className="space-y-2">
          {distribution.map(d => (
            <div key={d.stars} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6">{d.stars}★</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-8">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground">{review.userName}</span>
                      {review.verified && (
                        <CheckCircle size={12} className="text-brand" />
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={11} className={s <= review.rating ? 'fill-brand text-brand' : 'text-border'} />
                  ))}
                </div>
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">{review.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp size={12} /> {lang === 'ar' ? 'مفيد' : 'Helpful'} ({review.helpfulCount})
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          {lang === 'ar' ? 'لا توجد مراجعات بعد' : 'No reviews yet'}
        </p>
      )}

      <button className="mt-6 w-full h-10 border border-border rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors">
        {lang === 'ar' ? 'اكتب مراجعة' : 'Write a Review'}
      </button>
    </section>
  );
};

export default ReviewsSection;
