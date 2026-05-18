"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Calendar, Settings, MapPin, Clock, Users, Zap, Shield, Github, Linkedin, Twitter } from 'lucide-react';

const RoleCards = () => {
  const roles = [
    {
      title: 'Operations Manager',
      icon: BarChart3,
      description: 'Monitor system performance with real-time analytics and predictive insights',
      features: [
        'Real-time performance dashboard',
        'Predictive maintenance alerts',
        'System-wide analytics',
        'Resource optimization'
      ],
      color: 'blue-500',
      bgGradient: 'from-blue-100 to-blue-50'
    },
    {
      title: 'Train Scheduler',
      icon: Calendar,
      description: 'AI-powered train scheduling with conflict resolution and route optimization',
      features: [
        'Intelligent schedule planning',
        'Automatic conflict resolution',
        'Route optimization',
        'Capacity management'
      ],
      color: 'purple-500',
      bgGradient: 'from-purple-100 to-purple-50'
    },
    {
      title: 'Maintenance Supervisor',
      icon: Settings,
      description: 'Proactive maintenance planning with AI-driven predictive analytics',
      features: [
        'Predictive maintenance',
        'Resource allocation',
        'Work order management',
        'Equipment tracking'
      ],
      color: 'green-500',
      bgGradient: 'from-green-100 to-green-50'
    },
    {
      title: 'Station Manager',
      icon: MapPin,
      description: 'Comprehensive station operations management and passenger flow optimization',
      features: [
        'Platform scheduling',
        'Passenger flow analysis',
        'Station resource management',
        'Real-time coordination'
      ],
      color: 'yellow-500',
      bgGradient: 'from-yellow-100 to-yellow-50'
    }
  ];

  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-600 border-purple-200">
              <Shield className="h-3 w-3 mr-1" />
              Role-Based Access Control
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Tailored Solutions for Every Role
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI platform adapts to your specific responsibilities, providing personalized 
              dashboards and tools for maximum efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {roles.map((role, index) => (
              <Card 
                key={index} 
                className={`group relative overflow-hidden border-border/50 bg-gradient-to-br ${role.bgGradient} hover:shadow-2xl hover:shadow-${role.color}/20 transition-all duration-500 hover:-translate-y-2`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-${role.color}/10 border border-${role.color}/20`}>
                      <role.icon className={`h-8 w-8 text-${role.color}`} />
                    </div>
                    <Badge variant="outline" className={`text-${role.color} border-${role.color}/30`}>
                      AI-Powered
                    </Badge>
                  </div>
                  <CardTitle className={`text-2xl text-foreground group-hover:text-${role.color} transition-colors`}>
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full bg-${role.color}/60`} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className={`w-full group-hover:bg-${role.color} group-hover:text-white group-hover:border-${role.color} transition-all duration-300`}
                  >
                    Access Dashboard
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-4 p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-foreground">Multi-Role Support</span>
              </div>
              <div className="w-1 h-8 bg-border" />
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-foreground">Real-Time Updates</span>
              </div>
              <div className="w-1 h-8 bg-border" />
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-foreground">AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Footer Section */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sih2025. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://github.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default RoleCards;
