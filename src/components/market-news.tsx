
"use client";

import Image from "next/image";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import type { CryptoNewsArticle } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";


function timeAgo(timestamp: number): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - (timestamp * 1000)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + "y ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + "mo ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m ago";
    }
    return Math.floor(seconds) + "s ago";
}


export function MarketNews({ refreshKey }: { refreshKey: number }) {
    const [news, setNews] = useState<CryptoNewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://min-api.cryptocompare.com/data/v2/news/?lang=EN&lTs=${Math.floor(Date.now() / 1000)}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.Message || `API Error: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.Type !== 100 || !Array.isArray(data.Data)) {
                 throw new Error(data.Message || "Failed to fetch news from API due to an invalid response format.");
            }
            setNews(data.Data.slice(0, 12));
        } catch (err: any) {
            setError(err.message);
            console.error("Failed to fetch news:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews, refreshKey]);

    if (loading) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
              {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="flex flex-col">
                      <Skeleton className="aspect-video w-full" />
                      <CardHeader className="flex flex-col flex-1 p-4">
                          <Skeleton className="h-4 w-5/6 mb-2" />
                          <Skeleton className="h-4 w-4/6" />
                           <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground mt-auto">
                             <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-4 w-1/4" />
                          </div>
                      </CardHeader>
                  </Card>
              ))}
          </div>
      );
    }


    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-destructive dark:text-red-400 bg-card rounded-lg border border-destructive/50">
                <AlertTriangle className="h-12 w-12 mb-4" />
                <p className="text-xl font-semibold mb-2">Failed to Load News</p>
                <p className="text-sm text-center text-muted-foreground max-w-sm">{error}</p>
                <Button onClick={fetchNews} variant="outline" className="mt-4">Try Again</Button>
            </div>
        );
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
        {news.map((article) => (
        <a href={article.url} target="_blank" rel="noopener noreferrer" key={article.id} className="block hover:opacity-80 transition-opacity">
            <Card className="overflow-hidden h-full flex flex-col">
                <div className="aspect-video relative">
                    <Image 
                        src={article.imageurl} 
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                </div>
                <CardHeader className="flex-1 p-4">
                    <CardTitle className="text-base leading-tight mb-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center justify-between pt-2 text-xs mt-auto">
                        <span>{article.source_info.name}</span>
                        <span>{timeAgo(article.published_on)}</span>
                    </CardDescription>
                </CardHeader>
            </Card>
        </a>))
        }
    </div>
  );
}
