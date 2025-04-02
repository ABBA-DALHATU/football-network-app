import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from 'lucide-react'

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What our users say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from players, scouts, and clubs who have found success with FootNet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Johnson",
              role: "Professional Player",
              team: "Manchester United",
              quote: "FootNet helped me connect with scouts and find my current club. The platform made it easy to showcase my skills and get noticed.",
              avatar: "/placeholder.svg",
              stars: 5,
            },
            {
              name: "Sarah Williams",
              role: "Football Scout",
              team: "Liverpool FC",
              quote: "As a scout, FootNet has revolutionized how I discover talent. The filtering tools and player profiles save me countless hours in the recruitment process.",
              avatar: "/placeholder.svg",
              stars: 5,
            },
            {
              name: "FC Barcelona Youth",
              role: "Football Club",
              team: "Youth Development",
              quote: "We've recruited several promising young players through FootNet. The platform connects us with talent we might never have discovered otherwise.",
              avatar: "/placeholder.svg",
              stars: 5,
            },
          ].map((testimonial, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {Array(testimonial.stars).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative">
                    <Image 
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.team}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
