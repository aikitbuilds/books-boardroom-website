
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Card component is available

const logos = [
  // Placeholder logos - replace with actual SVGs or image paths
  { name: "SolarCorp", src: "placeholder.svg", alt: "SolarCorp Logo" },
  { name: "SunPower Systems", src: "placeholder.svg", alt: "SunPower Systems Logo" },
  { name: "EcoSolar Solutions", src: "placeholder.svg", alt: "EcoSolar Solutions Logo" },
  { name: "BrightFuture Energy", src: "placeholder.svg", alt: "BrightFuture Energy Logo" },
];

const testimonials = [
  {
    quote: "This AI COS transformed our operations. We're closing deals 50% faster!",
    name: "Jane Doe",
    title: "Operations Director, SolarShine Inc.",
    avatar: "placeholder.svg" 
  },
  {
    quote: "The unified dashboard is a game-changer. Finally, full visibility!",
    name: "John Smith",
    title: "CEO, SunPeak Energy",
    avatar: "placeholder.svg"
  }
];

const SocialProofSection = () => {
  return (
    <section className="py-16 bg-background section-animate">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-tech-blue">
          Join the Solar Leaders Already Transforming Their Operations
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Trusted by innovative solar companies to streamline workflows, boost productivity, and accelerate growth.
        </p>
        
        {/* Customer Logos Placeholder */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16">
          {logos.map((logo) => (
            <img key={logo.name} src={logo.src} alt={logo.alt} className="h-10 md:h-12 opacity-60 hover:opacity-100 transition-opacity" />
          ))}
        </div>

        {/* Key Metrics & Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-solar-orange/10 border-solar-orange">
            <CardHeader>
              <CardTitle className="text-solar-orange">Impressive Results, Fast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-solar-orange">40%</p>
                <p className="text-muted-foreground">Faster Proposal Generation</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-solar-orange">15+</p>
                <p className="text-muted-foreground">Hours Saved Weekly Per Team</p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial Carousel Placeholder - simple static for now */}
          <Card className="border-tech-blue">
            <CardHeader>
              <CardTitle className="text-tech-blue">{testimonials[0].name}</CardTitle>
               <p className="text-sm text-muted-foreground">{testimonials[0].title}</p>
            </CardHeader>
            <CardContent>
              <blockquote className="italic text-foreground">"{testimonials[0].quote}"</blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
