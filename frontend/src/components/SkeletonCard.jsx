export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      {/* Image skeleton */}
      <div className="skeleton w-full h-44" />

      <div className="p-3 space-y-2">
        {/* Title skeleton */}
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />

        {/* Price skeleton */}
        <div className="skeleton h-5 w-2/5 rounded mt-1" />

        {/* Rating skeleton */}
        <div className="flex gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-3 w-3 rounded-full" />
          ))}
          <div className="skeleton h-3 w-8 rounded ml-1" />
        </div>

        {/* Location skeleton */}
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
