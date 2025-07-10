import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Activity,
  BarChart3,
  Zap,
  Target,
  Shield,
  Brain,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms detect patterns with high accuracy",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Real-Time Detection",
      description:
        "Live pattern recognition across multiple timeframes and trading pairs",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Pattern Categories",
      description:
        "Chart, Candle, Volume, Price Action, Harmonic, and Statistical patterns",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Interactive Charts",
      description:
        "Professional candlestick charts with pattern overlays and annotations",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Assessment",
      description:
        "Pattern strength indicators and success probability analysis",
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/30",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description:
        "Optimized for speed with real-time updates and minimal latency",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
  ];

  const stats = [
    {
      label: "Patterns Detected",
      value: "50M+",
      icon: <Target className="h-5 w-5" />,
    },
    {
      label: "Active Traders",
      value: "25K+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Trading Pairs",
      value: "500+",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      label: "Accuracy Rate",
      value: "94%",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  const benefits = [
    "Advanced pattern recognition algorithms",
    "Real-time market data integration",
    "Professional trading interface",
    "Multiple timeframe analysis",
    "Pattern strength scoring",
    "Risk assessment tools",
    "Chart annotation system",
    "Export and sharing capabilities",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10 blur-3xl" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/20 rounded-2xl">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Crypto Pattern Analyzer
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered platform for detecting and analyzing
              cryptocurrency chart patterns. Make informed trading decisions
              with professional-grade pattern recognition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
                onClick={() => navigate("/auth")}
              >
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border/50 hover:bg-muted/50 px-8 py-3 text-lg"
                onClick={() => navigate("/dashboard")}
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="trading-card text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Powerful Features for Professional Traders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to identify, analyze, and act on chart patterns
            with confidence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="trading-card hover:scale-105 transition-transform duration-200"
            >
              <CardHeader>
                <div
                  className={`p-3 rounded-lg w-fit ${feature.bgColor} border ${feature.borderColor}`}
                >
                  <div className={feature.color}>{feature.icon}</div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground">
              Built by traders, for traders. Our platform combines cutting-edge
              technology with practical trading insights to give you the edge
              you need.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur-2xl" />
            <Card className="trading-card p-8 relative">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Live Pattern Detection
                    </h3>
                    <p className="text-muted-foreground">
                      Real-time analysis across all major pairs
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Pattern Accuracy
                    </span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      94%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Detection Speed
                    </span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      &lt;100ms
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Success Rate
                    </span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      87%
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 rounded-2xl blur-3xl" />
          <Card className="trading-card p-12 text-center relative">
            <div className="space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Elevate Your Trading?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of traders who trust our platform for pattern
                analysis. Start your journey to more informed trading decisions
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
                  onClick={() => navigate("/auth")}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border/50 hover:bg-muted/50 px-8 py-3 text-lg"
                  onClick={() => navigate("/dashboard")}
                >
                  Continue as Guest
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">Pattern Analyzer</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Pattern Analyzer. Built for professional traders.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
