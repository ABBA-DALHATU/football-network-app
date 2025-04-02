import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto w-full pb-10">
      <div className="pt-4 pb-2">
        <Skeleton className="h-8 w-32 mb-4" />
      </div>

      {/* Create Post Card Skeleton */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-10 w-full mb-2 rounded-xl" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-sm overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              {i % 2 === 0 && (
                <Skeleton className="h-[200px] w-full rounded-xl" />
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="w-full">
                <div className="flex justify-between w-full mb-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Separator className="my-2" />
                <div className="flex gap-2 w-full pt-2">
                  <Skeleton className="h-8 flex-1 rounded-full" />
                  <Skeleton className="h-8 flex-1 rounded-full" />
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
