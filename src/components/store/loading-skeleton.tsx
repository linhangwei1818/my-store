export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-8 w-48 bg-stone-200 rounded-lg mb-6" />
      <div className="h-4 w-96 bg-stone-100 rounded mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-(--border) overflow-hidden">
            <div className="aspect-square bg-stone-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-stone-100 rounded" />
              <div className="h-4 w-1/3 bg-stone-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-64 bg-stone-200 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-square bg-stone-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-stone-200 rounded" />
          <div className="h-8 w-3/4 bg-stone-200 rounded" />
          <div className="h-4 w-full bg-stone-100 rounded" />
          <div className="h-4 w-2/3 bg-stone-100 rounded" />
          <div className="h-10 w-32 bg-stone-200 rounded mt-4" />
          <div className="h-12 w-full bg-stone-200 rounded-lg mt-6" />
        </div>
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[50vh] md:h-[75vh] min-h-[400px] max-h-[700px] bg-stone-300" />
      {/* Category skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="h-4 w-32 bg-stone-200 rounded mx-auto mb-3" />
          <div className="h-8 w-64 bg-stone-200 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-(--border) overflow-hidden">
              <div className="aspect-[4/3] bg-stone-200" />
              <div className="p-4 space-y-2 text-center">
                <div className="h-5 w-24 bg-stone-200 rounded mx-auto" />
                <div className="h-3 w-16 bg-stone-100 rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Featured skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="h-4 w-32 bg-stone-200 rounded mb-3" />
          <div className="h-8 w-48 bg-stone-200 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-(--border) overflow-hidden">
              <div className="aspect-square bg-stone-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-stone-100 rounded" />
                <div className="h-4 w-1/3 bg-stone-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
