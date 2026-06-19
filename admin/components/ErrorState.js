'use client';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10 px-5 py-4 text-red-800 dark:text-red-300 font-sans shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold font-serif text-base text-red-900 dark:text-red-200">{title}</p>
          {message && <p className="mt-1 text-sm text-red-700 dark:text-red-400">{message}</p>}
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="self-start btn-primary bg-red-600 hover:bg-red-700 text-white text-sm font-serif px-4 py-2 shadow-sm transition sm:self-auto"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
