import { useLegalDoc } from '@/hooks/useLegalDocs';
import { Skeleton } from '@/components/ui/skeleton';
import { renderMarkdown } from '@/lib/markdown';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ShippingPolicy() {
  const { data: doc, isLoading, error } = useLegalDoc('shipping-policy');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl py-12">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
              <p>Failed to load shipping policy</p>
            </div>
          ) : doc ? (
            <article className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content) }}
              />
            </article>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Shipping policy not found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
