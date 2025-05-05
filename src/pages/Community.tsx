
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, Heart, Calendar, Star, MessageSquare, HandShake } from 'lucide-react';

const Community = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Parent Community</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Together we're stronger. Connect with other parents, share experiences, 
            and learn from each other in a supportive environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Support Groups</CardTitle>
              <CardDescription>Connect with parents facing similar challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Join virtual and in-person support groups moderated by experienced 
                parents and professionals.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button>Join a Group</Button>
            </CardFooter>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Discussion Forums</CardTitle>
              <CardDescription>Share advice and ask questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Post questions, share successes, and learn from other parents' 
                experiences in our moderated forums.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button>Browse Forums</Button>
            </CardFooter>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Events & Workshops</CardTitle>
              <CardDescription>Learn and connect through structured events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Attend virtual workshops, webinars, and community events designed 
                for parents of children with special needs.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button>View Calendar</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-xl p-8 mb-16">
          <div className="text-center mb-8">
            <Badge className="mb-4">Our Mission</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              United in Supporting Every Child's Journey
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              At Feed Lovable, we believe that every child deserves the opportunity to thrive.
              Our community brings together parents, professionals, and educators to create
              a network of support that helps children reach their full potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-background rounded-full p-3 mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Compassionate Support</h3>
              <p className="text-sm text-muted-foreground">
                We create a judgment-free space where parents can find emotional support.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-background rounded-full p-3 mb-4">
                <HandShake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Collaborative Approach</h3>
              <p className="text-sm text-muted-foreground">
                We bring together parents, educators, and healthcare providers to collaborate.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-background rounded-full p-3 mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Empowered Families</h3>
              <p className="text-sm text-muted-foreground">
                We equip families with the knowledge and resources they need to advocate.
              </p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="discussions" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="discussions">Popular Discussions</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
            <TabsTrigger value="partners">Community Partners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            <div className="space-y-4">
              {[
                {
                  title: "Tips for communicating with non-verbal children",
                  author: "Maria S.",
                  replies: 24,
                  likes: 42
                },
                {
                  title: "Navigating the IEP process - advice needed",
                  author: "James T.",
                  replies: 18,
                  likes: 31
                },
                {
                  title: "Sensory-friendly activities for the summer",
                  author: "Aisha K.",
                  replies: 35,
                  likes: 56
                }
              ].map((discussion, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{discussion.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                      </Avatar>
                      Posted by {discussion.author}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {discussion.replies} replies
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 mr-1" />
                      {discussion.likes} likes
                    </div>
                    <Button size="sm">Read More</Button>
                  </CardFooter>
                </Card>
              ))}
              <div className="flex justify-center mt-8">
                <Button>View All Discussions</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="success">
            <div className="space-y-6">
              {[
                {
                  title: "My son's speech therapy journey",
                  content: "After 6 months of consistent therapy and the support of this community, my son went from speaking 5 words to full sentences.",
                  author: "Patricia M."
                },
                {
                  title: "How our support group changed everything",
                  content: "Finding parents who understood our challenges gave us the strength to try new approaches that have made a tremendous difference.",
                  author: "Robert & Julie"
                }
              ].map((story, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{story.title}</CardTitle>
                    <CardDescription>Shared by {story.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{story.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Read Full Story</Button>
                  </CardFooter>
                </Card>
              ))}
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-2">Share Your Story</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your journey could inspire and help other families facing similar challenges.
                </p>
                <Button>Submit Your Story</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="partners">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Bright Futures Foundation",
                  description: "Supporting families with educational resources and advocacy services.",
                  logo: "BF"
                },
                {
                  name: "Inclusive Learning Center",
                  description: "Providing specialized educational programs and inclusive classroom training.",
                  logo: "ILC"
                },
                {
                  name: "Family Support Network",
                  description: "Connecting families to resources and offering parent-to-parent mentorship.",
                  logo: "FSN"
                },
                {
                  name: "Child Development Institute",
                  description: "Leading research and evidence-based interventions for child development.",
                  logo: "CDI"
                }
              ].map((partner, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary">{partner.logo}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <CardDescription>{partner.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Interested in becoming a community partner? Join our network of organizations dedicated to supporting children.
              </p>
              <Button>Partner With Us</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connect with parents, professionals, and resources dedicated to helping your child thrive.
            Together, we can make a difference.
          </p>
          <Button size="lg" className="font-medium">
            Sign Up Now
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
