"use client";

type PipelineErrorProps = {
  error: Error;
  reset: () => void;
};

export default function PipelineError({
  error,
  reset,
}: PipelineErrorProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">
        Pipeline error
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
        The pipeline board could not be loaded.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        {error.message || "An unexpected error occurred while loading the board."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
      >
        Try again
      </button>
    </div>
  );
}
