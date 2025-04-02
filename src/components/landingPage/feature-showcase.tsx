import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from 'lucide-react'

export function FeatureShowcase() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="mb-4">Powerful Platform</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Designed for the football community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our key features that help players, scouts, and clubs connect and collaborate.
          </p>
        </div>
        
        <Tabs defaultValue="networking" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="networking">Networking</TabsTrigger>
              <TabsTrigger value="discovery">Discovery</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="networking" className="mt-0">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Build your professional football network</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with players, scouts, and clubs worldwide to expand your professional network 
                  and discover new opportunities in the football industry.
                </p>
                <ul className="space-y-3">
                  {[
                    "Connect with professionals across the football industry",
                    "Build relationships with players, scouts, and clubs",
                    "Message directly with your connections",
                    "Grow your network with personalized recommendations",
                    "Share updates and engage with your community"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-lg border">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    alt="Networking features" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="discovery" className="mt-0">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Discover opportunities and talent</h3>
                <p className="text-muted-foreground mb-6">
                  Find the perfect match whether you're a player looking for a club, a scout searching 
                  for talent, or a club recruiting new team members.
                </p>
                <ul className="space-y-3">
                  {[
                    "Advanced search filters to find exactly what you need",
                    "Personalized recommendations based on your profile",
                    "Job board for clubs posting opportunities",
                    "Talent showcase for players to highlight their skills",
                    "Location-based discovery to find nearby opportunities"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-lg border">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    alt="Discovery features" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Track performance and progress</h3>
                <p className="text-muted-foreground mb-6">
                  Analyze performance metrics, track career progress, and gain insights to help 
                  you make data-driven decisions for your football career or organization.
                </p>
                <ul className="space-y-3">
                  {[
                    "Performance dashboards with key metrics and stats",
                    "Career progression tracking for players",
                    "Recruitment analytics for scouts and clubs",
                    "Comparison tools to benchmark against peers",
                    "Custom reports and data visualization"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-lg border">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    alt="Analytics features" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
