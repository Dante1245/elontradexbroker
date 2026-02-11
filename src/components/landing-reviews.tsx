
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Vitalik B.",
    avatar: "VB",
    review: "ElonTradeX made it ridiculously easy to get into crypto. The interface is clean and the fees are transparent. Two thumbs up!",
    imageSeed: "150?u=vitalik",
    rating: 5,
  },
  {
    name: "Satoshi N.",
    avatar: "SN",
    review: "As someone who values security above all, ElonTradeX's multi-layered protection gives me peace of mind. A truly decentralized experience.",
    imageSeed: "150?u=satoshi",
    rating: 5,
  },
  {
    name: "Michael S.",
    avatar: "MS",
    review: "The analytics tools are top-notch. I can track my portfolio and market trends with incredible detail. It's a game-changer for serious traders.",
    imageSeed: "150?u=michael",
    rating: 4,
  },
  {
    name: "Cathie W.",
    avatar: "CW",
    review: "ElonTradeX is disrupting the digital asset space. Their innovative features and commitment to user experience sets a new industry standard.",
    imageSeed: "150?u=cathie",
    rating: 5,
  },
  {
    name: "Gavin A.",
    avatar: "GA",
    review: "I've tried many exchanges, but the speed and reliability of ElonTradeX are unmatched. My orders execute instantly, which is crucial in a volatile market.",
    imageSeed: "150?u=gavin",
    rating: 4,
  },
   {
    name: "Alex G.",
    avatar: "AG",
    review: "The mobile app is fantastic! It has all the features of the desktop site, allowing me to manage my assets on the go without any compromises.",
    imageSeed: "150?u=alex",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-yellow-400 mt-1">
      {[...Array(5)].map((_, i) => (<Star key={i} className={cn("w-4 h-4 fill-current", i < rating ? "text-yellow-400" : "text-gray-300")} />))}
    </div>
  )
}
export function LandingReviews() {
  return (
    <section className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            What Our Users Are Saying
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            We're trusted by traders worldwide. Here's why.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/${review.imageSeed}`} alt={`${review.name}'s avatar`} />
                    <AvatarFallback>{review.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{review.name}</CardTitle>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">"{review.review}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
