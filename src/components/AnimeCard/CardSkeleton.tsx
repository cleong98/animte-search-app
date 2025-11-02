export function CardSkeleton() {
  return (
    <div className="card-wrapper">
      <div className="card-image-skeleton-container bg-base-200">
        <div className="skeleton h-full w-full"></div>
      </div>
      <div className="card-info-skeleton-container">
        <div className="skeleton h-4 w-3/4 mb-2"></div>
        <div className="skeleton h-3 w-1/2"></div>
      </div>
    </div>
  );
}
