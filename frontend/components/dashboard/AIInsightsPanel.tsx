import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Sparkles, TrendingUp, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Insights } from "@/types/chat";
import LoadingSpinner from "./LoadingSpinner";

interface AIInsightsPanelProps {
  conversationId: string;
  onClose: () => void;
}

// Mock AI insights data

const AIInsightsPanel = ({ conversationId, onClose }: AIInsightsPanelProps) => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchInsights = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await fetch(
        `http://localhost:3001/api/insights/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setInsights(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching insights:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    console.log(insights);
  }, []);
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-success text-success-foreground";
      case "negative":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-warning text-warning-foreground";
    }
  };

  return (
    <div className="flex flex-col h-lvh bg-black/60 backdrop-blur-lg border-l border-purple-600/20">
      {/* Header */}
      <div className="p-4 border-b border-purple-600/20 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-r from-purple-500 to-pink-500 rounded-lg p-1.5">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-semibold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-400">
              AI Insights
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-black/40 via-transparent to-black/40">
        {/* Sentiment */}
        <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-white">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Badge
                className={`px-3 py-1 text-sm font-medium`}
              >
                {insights?.sentiment
                  ? insights.sentiment.charAt(0).toUpperCase() +
                    insights.sentiment.slice(1)
                  : "Loading..."}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Conversation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">
                {insights?.summary}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-white">
              <Tag className="h-4 w-4 text-purple-400" />
              Key Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="flex flex-wrap gap-2">
                {insights?.tags?.map((tag: string, index: number) => (
                  // (جوه الـ Card بتاع Key Topics)
                  <Badge
                    key={index}
                    // 1. 👈 امسح variant="secondary" من هنا
                    className="bg-purple-500/10 text-white border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
