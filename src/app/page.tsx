import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ChevronRight,
  Download,
  MessageSquare,
  Search,
  Shield,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { HeroSection } from "@/components/landingPage/hero-section";
import { FeatureShowcase } from "@/components/landingPage/feature-showcase";
import { Testimonials } from "@/components/landingPage/testimonials";
import { Footer } from "@/components/landingPage/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col px-4">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
            <span className="text-xl font-bold">FootNet</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in">
              <Button variant="ghost">Log in</Button>
            </Link>
            {/* /auth/sign-in */}
            <Link href="/auth/sign-up">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Trusted By Section */}
        <section className="py-12 border-y bg-muted/50">
          <div className="container">
            <h2 className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
              Trusted by football professionals worldwide
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {[
                "Premier League",
                "La Liga",
                "Bundesliga",
                "Serie A",
                "Ligue 1",
              ].map((league) => (
                <div
                  key={league}
                  className="text-lg font-semibold text-muted-foreground"
                >
                  {league}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to succeed in football
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                FootNet provides all the tools players, scouts, and clubs need
                to connect, communicate, and collaborate in the world of
                football.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Connect",
                  description:
                    "Build your professional network with players, scouts, and clubs from around the world.",
                  icon: Users,
                  color: "bg-blue-500",
                },
                {
                  title: "Discover",
                  description:
                    "Find new opportunities, talent, or teams with our advanced search and recommendation system.",
                  icon: Search,
                  color: "bg-purple-500",
                },
                {
                  title: "Communicate",
                  description:
                    "Message directly with connections to discuss opportunities, arrange trials, or negotiate deals.",
                  icon: MessageSquare,
                  color: "bg-emerald-500",
                },
                {
                  title: "Showcase",
                  description:
                    "Highlight your skills, achievements, and statistics with a professional profile.",
                  icon: Star,
                  color: "bg-amber-500",
                },
                {
                  title: "Analyze",
                  description:
                    "Track performance metrics and get insights to improve your game or team.",
                  icon: Zap,
                  color: "bg-red-500",
                },
                {
                  title: "Succeed",
                  description:
                    "Take your football career or organization to the next level with FootNet's powerful tools.",
                  icon: Trophy,
                  color: "bg-indigo-500",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-none shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white mb-4`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Simple steps to get started
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                FootNet makes it easy to join the football community and start
                connecting with professionals worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Create your profile",
                  description:
                    "Sign up and select your role as a player, scout, or club. Complete your profile with your details and experience.",
                },
                {
                  step: "02",
                  title: "Build your network",
                  description:
                    "Connect with other football professionals, follow teams, and join communities relevant to your interests.",
                },
                {
                  step: "03",
                  title: "Discover opportunities",
                  description:
                    "Explore job postings, talent searches, or team openings based on your role and preferences.",
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-4xl font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                      <ChevronRight className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/auth/sign-in">
                <Button size="lg" className="mt-4">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* For Everyone Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4">For Everyone</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Tailored for all football professionals
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you're a player, scout, or club, FootNet has features
                designed specifically for your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "For Players",
                  description:
                    "Showcase your skills, connect with scouts and clubs, and find new opportunities to advance your career.",
                  features: [
                    "Professional profile with stats and highlights",
                    "Direct messaging with scouts and clubs",
                    "Job and trial opportunity alerts",
                    "Performance tracking and analysis",
                  ],
                  icon: Shield,
                  color: "from-blue-500 to-blue-600",
                  buttonText: "Join as a Player",
                },
                {
                  title: "For Scouts",
                  description:
                    "Discover talented players, connect with clubs, and streamline your recruitment process.",
                  features: [
                    "Advanced player search and filtering",
                    "Talent tracking and watchlists",
                    "Direct communication with players",
                    "Collaboration tools for recruitment teams",
                  ],
                  icon: Search,
                  color: "from-purple-500 to-purple-600",
                  buttonText: "Join as a Scout",
                },
                {
                  title: "For Clubs",
                  description:
                    "Find the right players for your team, connect with scouts, and manage your recruitment efficiently.",
                  features: [
                    "Team management dashboard",
                    "Player and scout discovery",
                    "Job and trial posting tools",
                    "Team performance analytics",
                  ],
                  icon: Users,
                  color: "from-emerald-500 to-emerald-600",
                  buttonText: "Join as a Club",
                },
              ].map((role, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-none shadow-md"
                >
                  <div className={`h-2 bg-gradient-to-r ${role.color}`} />
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full bg-gradient-to-br ${role.color} text-white`}
                      >
                        <role.icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{role.title}</CardTitle>
                    </div>
                    <CardDescription className="pt-2">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {role.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/auth/sign-in" className="w-full">
                      <Button className="w-full">{role.buttonText}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to elevate your football career?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of football professionals already using FootNet
                to connect, discover opportunities, and achieve their goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/sign-in">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Sign Up Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary-foreground/20 hover:bg-primary-foreground/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-primary bg-white"
                    />
                  ))}
                </div>
                <p className="text-sm opacity-90">
                  Join 10,000+ users worldwide
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Download Section */}
        <section className="py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <Badge className="mb-4">Mobile App</Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Take FootNet with you everywhere
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  Download our mobile app to stay connected with the football
                  community, receive instant notifications, and manage your
                  profile on the go.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    App Store
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Google Play
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative h-[400px] w-[200px] rounded-3xl border-8 border-foreground/10 shadow-xl">
                  <div className="absolute inset-0 bg-muted rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=600&width=300"
                      alt="FootNet mobile app"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
