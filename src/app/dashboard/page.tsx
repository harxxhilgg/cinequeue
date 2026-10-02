import { MediaBoard } from "@/components/dashboard/media-board";
import { MediaSearch } from "@/components/dashboard/media-search";

export default function DashboardPage() {
  return (
    <main className="flex h-screen min-h-0 flex-col px-6 pb-6">
      <div className="absolute left-6 top-6 z-50">
        <h2 className="text-3xl font-monst font-normal">PlotQ</h2>
      </div>

      {/* Search */}
      <div className="flex shrink-0 justify-center pt-30">
        <div className="w-full max-w-175">
          <MediaSearch />
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 min-h-0 flex-1">
        <MediaBoard />
      </div>
    </main>
  );
}