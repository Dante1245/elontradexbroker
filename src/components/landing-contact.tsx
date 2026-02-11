import { Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';

export function LandingContact() {
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            We are here to help and answer any question you might have.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-6">
                <Image 
                  src="https://images.unsplash.com/photo-1663008519747-9da38bbfd132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxlbG9uJTIwbXVza3xlbnwwfHx8fDE3NTU1NDg2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Founder"
                  width={80}
                  height={80}
                  className='rounded-full object-cover'
                  data-ai-hint="person portrait"
                  />
                <div>
                    <h3 className="text-2xl font-bold">Visionary Founder</h3>
                    <p className="text-primary font-medium">Founder</p>
                    <p className="mt-2 text-muted-foreground">
                        The driving force behind ElonTradeX, our founder's vision is to create a decentralized, transparent, and accessible financial future for everyone. Their leadership guides our mission to innovate and push the boundaries of what's possible in the crypto space.
                    </p>
                </div>
            </div>
             <Card className="bg-muted/30">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Phone Number</h4>
                            <a href="tel:+12096501913" className="text-muted-foreground hover:text-primary transition-colors">+1 209-650-1913</a>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Email Address</h4>
                            <a href="mailto:support@elontradex.live" className="text-muted-foreground hover:text-primary transition-colors">support@elontradex.live</a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
