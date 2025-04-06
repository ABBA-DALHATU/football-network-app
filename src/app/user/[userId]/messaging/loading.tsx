import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="pt-4 pb-2 px-4 md:px-0">
        <Skeleton className="h-8 w-32 mb-4" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r flex flex-col">
          <div className="p-4">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col hidden md:flex">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`flex items-end gap-2 max-w-[80%] ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                  {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
                  <Skeleton className={`h-16 ${i % 2 === 0 ? "w-64" : "w-48"} rounded-2xl`} />
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t p-4">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

