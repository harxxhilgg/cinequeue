import { MediaBoard } from "@/components/dashboard/media-board";
import { MediaSearch } from "@/components/dashboard/media-search";
import { Film } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="flex h-screen min-h-0 flex-col px-6 pb-6">
      <div className="flex items-center gap-2 absolute left-6 top-6 z-50">
        <Film className="size-7 text-orange-500" />

        <div className="text-2xl font-semibold font-monst tracking-tight mb-auto flex items-center gap-2">
          PlotQ
        </div>
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