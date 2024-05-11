export function CardSkeleton() {
  return (
    <div class="space-y-5 relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent isolate overflow-hidden shadow-black/60 before:border-t before:border-white">
      <div class="h-[60vh] md:h-[75vh] rounded-lg bg-[#000]"></div>
      <div class="space-y-3">
        <div class="h-3 w-4/5 rounded-lg bg-[#000]"></div>
        <div class="h-3 w-2/5 rounded-lg bg-[#000]"></div>
      </div>
    </div>
  );
}
