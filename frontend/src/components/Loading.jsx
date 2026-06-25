import React from 'react';

export const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} animate-spin rounded-full border-slate-200 border-t-primary-600`}></div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      {/* Image Skeleton */}
      <div className="h-48 w-full animate-pulse rounded-xl bg-slate-200"></div>
      
      {/* Title & Badge Skeleton */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200"></div>
        <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200"></div>
      </div>

      {/* Info Skeletons */}
      <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200"></div>

      {/* Specs Skeletons */}
      <div className="mt-6 flex gap-4 border-t border-slate-50 pt-4">
        <div className="h-4 w-12 animate-pulse rounded bg-slate-200"></div>
        <div className="h-4 w-12 animate-pulse rounded bg-slate-200"></div>
        <div className="h-4 w-12 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

const Loading = () => {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="md" />
    </div>
  );
};

export default Loading;
