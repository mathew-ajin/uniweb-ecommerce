import { useLocale } from '@/hooks/useLocale';
import type { ProductItem } from '@/types/product';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductTabsProps {
  product: ProductItem;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const { t, lang } = useLocale();

  return (
    <div className="border-t border-border pt-8">
      <Accordion type="single" collapsible defaultValue="description" className="space-y-2">
        <AccordionItem value="description" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium">
            {lang === 'ar' ? 'الوصف' : 'Description'}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
            {t(product.fullDescription)}
          </AccordionContent>
        </AccordionItem>

        {product.specifications && product.specifications.length > 0 && (
          <AccordionItem value="specifications" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              {lang === 'ar' ? 'المواصفات' : 'Specifications'}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <dl className="space-y-2">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex gap-4 text-sm">
                    <dt className="text-muted-foreground w-32 flex-shrink-0">{t(spec.label)}</dt>
                    <dd className="text-foreground">{t(spec.value)}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        )}

        {product.shippingInfo && (
          <AccordionItem value="shipping" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              {lang === 'ar' ? 'الشحن والإرجاع' : 'Shipping & Returns'}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 space-y-2">
              <p>{t(product.shippingInfo)}</p>
              {product.returnInfo && <p>{t(product.returnInfo)}</p>}
            </AccordionContent>
          </AccordionItem>
        )}

        {product.careInstructions && product.careInstructions.length > 0 && (
          <AccordionItem value="care" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium">
              {lang === 'ar' ? 'تعليمات العناية' : 'Care Instructions'}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-1.5">
                {product.careInstructions.map((inst, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-brand flex-shrink-0" />
                    {t(inst)}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ProductTabs;
