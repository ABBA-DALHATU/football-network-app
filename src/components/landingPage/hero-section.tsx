import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Football Graphics */}
      <div className="absolute top-20 right-0 opacity-10 -rotate-12">
        <div className="h-40 w-40 rounded-full border-8 border-primary" />
      </div>
      <div className="absolute bottom-20 left-0 opacity-10 rotate-12">
        <div className="h-60 w-60 rounded-full border-8 border-primary" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Connect, Discover, Succeed in Football
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
              The professional networking platform for players, scouts, and
              clubs to connect, discover opportunities, and achieve success in
              the football world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/select-role">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by 10,000+ users worldwide
              </p>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="relative h-[400px] w-full md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://plus.unsplash.com/premium_photo-1676736592709-8bc1a9b6b163?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="FootNet App"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      P
                    </div>
                    <div>
                      <div className="font-semibold">Player Profile</div>
                      <div className="text-sm text-muted-foreground">
                        Manchester United • Midfielder
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-background rounded-lg p-3 shadow-lg hidden md:block">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div className="text-sm font-medium">New Connection</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-background rounded-lg p-3 shadow-lg hidden md:block">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="text-sm font-medium">Scout Interested</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
