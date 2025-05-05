
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessStories = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mb-6 hover:bg-muted" 
            asChild
          >
            <Link to="/resources">
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Success Stories</h1>
            <p className="text-muted-foreground mt-2">
              Inspiring individuals who have thrived with neurodevelopmental differences
            </p>
          </div>
          
          <Tabs defaultValue="adhd" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="adhd">ADHD</TabsTrigger>
              <TabsTrigger value="asd">Autism Spectrum</TabsTrigger>
              <TabsTrigger value="dyslexia">Dyslexia</TabsTrigger>
            </TabsList>
            
            <TabsContent value="adhd" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inspiring Individuals with ADHD</CardTitle>
                  <CardDescription>Their different way of thinking became their greatest advantage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Michael Phelps" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Michael Phelps</h3>
                        <p className="text-sm text-muted-foreground">Olympic Swimmer, 28 Olympic Medals</p>
                        <p className="mt-2">
                          Diagnosed with ADHD at age 9, Phelps channeled his tremendous energy into swimming. 
                          The structured routine and physical outlet helped him manage his symptoms while his 
                          hyperfocus helped him excel in training. His coach worked with his natural energy 
                          and need for movement rather than against it.
                        </p>
                        <p className="mt-2">
                          "I think the biggest thing for me, once I found that it was okay to talk to somebody 
                          and seek help, I think that's something that has changed my life forever."
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Simone Biles" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Simone Biles</h3>
                        <p className="text-sm text-muted-foreground">Olympic Gymnast, Most Decorated Gymnast in History</p>
                        <p className="mt-2">
                          Diagnosed with ADHD as a child, Biles has been open about taking medication to manage her 
                          symptoms. Her incredible focus, energy, and ability to innovate complex skills has revolutionized 
                          the sport of gymnastics. She demonstrates how ADHD traits can become advantages in the right environment.
                        </p>
                        <p className="mt-2">
                          "Having ADHD, and taking medication for it is nothing to be ashamed of, nothing that I'm afraid to 
                          let people know."
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Richard Branson" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Richard Branson</h3>
                        <p className="text-sm text-muted-foreground">Entrepreneur, Founder of Virgin Group</p>
                        <p className="mt-2">
                          Branson struggled in school due to undiagnosed ADHD and dyslexia. He credits his entrepreneurial 
                          success to his "outside the box" thinking and ability to hyperfocus on ideas that excite him. 
                          His impulsivity became a strength in business risk-taking, and his energy drives innovation.
                        </p>
                        <p className="mt-2">
                          "My ADHD and dyslexia have definitely helped me – they gave me the ability to think differently 
                          and solve problems by looking at them from a unique perspective."
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Emma Watson" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Emma Watson</h3>
                        <p className="text-sm text-muted-foreground">Actress, UN Ambassador</p>
                        <p className="mt-2">
                          The "Harry Potter" actress has spoken about having ADHD and how she developed coping strategies 
                          that helped her excel both on set and academically. Her ability to channel energy into intense focus 
                          helped her memorize scripts while balancing her career with her studies at Brown University.
                        </p>
                        <p className="mt-2">
                          "I've had to develop really good organizational skills because I'm not naturally organized. But I've 
                          found ways to make it work for me."
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">ADHD Traits as Professional Strengths</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Hyperfocus:</strong> The ability to become deeply absorbed in interesting tasks can lead to 
                        innovation and problem-solving breakthroughs
                      </li>
                      <li>
                        <strong>High energy:</strong> When channeled effectively, can result in exceptional productivity and passion
                      </li>
                      <li>
                        <strong>Divergent thinking:</strong> "Outside the box" thinking often leads to creative solutions and innovation
                      </li>
                      <li>
                        <strong>Risk-taking:</strong> Less fear of failure can lead to entrepreneurial success
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="asd" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inspiring Individuals with Autism</CardTitle>
                  <CardDescription>Their different way of thinking became their greatest advantage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Temple Grandin" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Dr. Temple Grandin</h3>
                        <p className="text-sm text-muted-foreground">Professor, Author, and Animal Science Innovator</p>
                        <p className="mt-2">
                          Non-verbal until age four, Grandin went on to revolutionize the livestock industry with her 
                          humane handling systems, designed using her visual thinking abilities and deep understanding 
                          of animal behavior. Her autism allowed her to "think in pictures" and notice details others missed.
                        </p>
                        <p className="mt-2">
                          "I am different, not less. The world needs all types of minds."
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Anthony Hopkins" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Sir Anthony Hopkins</h3>
                        <p className="text-sm text-muted-foreground">Academy Award-winning Actor</p>
                        <p className="mt-2">
                          Diagnosed with Asperger's late in life, Hopkins credits his autism with giving him the ability 
                          to notice details and patterns in human behavior that informed his acting. His exceptional 
                          memory allowed him to memorize scripts quickly, and his intense focus helped him create memorable characters.
                        </p>
                        <p className="mt-2">
                          "I don't waste energy thinking about the past or worrying about the future. I focus on the present moment."
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Greta Thunberg" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Greta Thunberg</h3>
                        <p className="text-sm text-muted-foreground">Climate Activist</p>
                        <p className="mt-2">
                          Thunberg has described her Asperger's syndrome as a "superpower" that helps her cut through 
                          social conventions and speak directly about climate issues. Her intense focus on environmental 
                          data and her unwillingness to engage in social niceties when discussing urgent issues has made 
                          her an effective advocate.
                        </p>
                        <p className="mt-2">
                          "I see the world somewhat differently, from another perspective... I have a special interest. 
                          It's very common that people on the autism spectrum have a special interest."
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Dan Aykroyd" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Dan Aykroyd</h3>
                        <p className="text-sm text-muted-foreground">Actor, Comedian, Screenwriter</p>
                        <p className="mt-2">
                          The "Ghostbusters" star has spoken about how his Asperger's syndrome and his special interest 
                          in ghosts and law enforcement actually inspired the creation of the iconic film. His ability 
                          to focus intensely on specific interests fueled his creative work.
                        </p>
                        <p className="mt-2">
                          "I was obsessed with ghosts and law enforcement, which led to the creation of 'Ghostbusters.' 
                          If I didn't have Asperger's, I wouldn't have been so obsessed with ghosts."
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Autistic Traits as Professional Strengths</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Pattern recognition:</strong> Exceptional ability to identify systems and patterns that 
                        others miss, valuable in science, technology, and art
                      </li>
                      <li>
                        <strong>Attention to detail:</strong> Noticing fine details leads to excellence in quality control, 
                        programming, and analytical fields
                      </li>
                      <li>
                        <strong>Honesty and directness:</strong> Clear communication without hidden agendas can be refreshing 
                        and valuable in many contexts
                      </li>
                      <li>
                        <strong>Special interests:</strong> Deep knowledge in specific areas often leads to innovation and expertise
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dyslexia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inspiring Individuals with Dyslexia</CardTitle>
                  <CardDescription>Their different way of thinking became their greatest advantage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Steven Spielberg" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Steven Spielberg</h3>
                        <p className="text-sm text-muted-foreground">Film Director, Producer</p>
                        <p className="mt-2">
                          The legendary filmmaker wasn't diagnosed with dyslexia until his 60s. His reading difficulties 
                          led to bullying in school, but his visual thinking and storytelling abilities became his strengths. 
                          His dyslexic thinking has contributed to his exceptional visual storytelling and creativity.
                        </p>
                        <p className="mt-2">
                          "I never felt like a victim. Movies really helped me... kind of saved me from shame, from guilt... 
                          making movies was my great escape."
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Octavia Spencer" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Octavia Spencer</h3>
                        <p className="text-sm text-muted-foreground">Academy Award-winning Actress</p>
                        <p className="mt-2">
                          Spencer has spoken about how dyslexia shaped her early years and acting career. She developed 
                          incredible memorization techniques and a strong ability to understand character emotions and 
                          motivations, which has contributed to her powerful performances.
                        </p>
                        <p className="mt-2">
                          "I was dyslexic, so I had to learn how to focus and concentrate and learn differently from other people. 
                          That helped prepare me for acting because I approach it from a different angle."
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Richard Branson" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Richard Branson</h3>
                        <p className="text-sm text-muted-foreground">Entrepreneur, Founder of Virgin Group</p>
                        <p className="mt-2">
                          Branson left school at 16 due to academic struggles from dyslexia. His big-picture thinking and 
                          problem-solving abilities became his strengths in business. He developed exceptional delegation 
                          skills and focuses on clear, simple communication in all his companies.
                        </p>
                        <p className="mt-2">
                          "Dyslexia shaped my—and Virgin's—communication style. I love simplicity and hate waffle."
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img src="/placeholder.svg" alt="Keira Knightley" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">Keira Knightley</h3>
                        <p className="text-sm text-muted-foreground">Actress</p>
                        <p className="mt-2">
                          Diagnosed with dyslexia at age six, Knightley used her love of acting as motivation to improve her 
                          reading. She would only be allowed to act if she maintained her grades, which pushed her to develop 
                          effective strategies. Her strong visual memory helps her excel at script memorization.
                        </p>
                        <p className="mt-2">
                          "I was diagnosed very young, so I had to work twice as hard to keep up... but actually, I think being 
                          dyslexic helped with my acting, because it meant that I look at the script differently."
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Dyslexic Traits as Professional Strengths</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Visual-spatial reasoning:</strong> Strong 3D thinking abilities valuable in architecture, engineering, 
                        art, and design
                      </li>
                      <li>
                        <strong>Big-picture thinking:</strong> Seeing connections and patterns between concepts that others miss
                      </li>
                      <li>
                        <strong>Problem-solving creativity:</strong> Finding novel solutions and approaches to challenges
                      </li>
                      <li>
                        <strong>Narrative thinking:</strong> Understanding stories and contexts in powerful ways, valuable in 
                        communications, marketing, and entertainment
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              These stories demonstrate that neurodevelopmental differences can become strengths when 
              properly understood and supported. With the right environment and strategies, children can 
              not just overcome challenges but thrive because of their unique cognitive profiles.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessStories;
