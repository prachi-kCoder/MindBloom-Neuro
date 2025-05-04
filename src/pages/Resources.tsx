
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Brain, LightbulbOff, FileText, Layers } from 'lucide-react';

const Resources = () => {
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Educational Resources</h1>
            <p className="text-muted-foreground mt-2">
              Structured resources to empower parents with actionable knowledge about neurodevelopmental disorders
            </p>
          </div>

          <Tabs defaultValue="myths" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="myths">Myth-Busting & Facts</TabsTrigger>
              <TabsTrigger value="strategies">Management Strategies</TabsTrigger>
              <TabsTrigger value="strengths">Strengths & Abilities</TabsTrigger>
              <TabsTrigger value="resources">Tools & Support</TabsTrigger>
            </TabsList>
            
            {/* Myths and Facts Tab */}
            <TabsContent value="myths" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <LightbulbOff className="h-5 w-5 text-primary" />
                    <CardTitle>Common Myths & Evidence-Based Facts</CardTitle>
                  </div>
                  <CardDescription>
                    Separating misconceptions from scientific evidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="adhd-myths">
                      <AccordionTrigger className="text-lg font-medium">ADHD</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="border-l-4 border-destructive pl-4 py-2">
                          <p className="font-semibold">Myth: "ADHD is just laziness."</p>
                          <p className="text-muted-foreground">Many assume children with ADHD simply lack discipline or effort.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <p className="font-semibold">Fact:</p>
                          <p>ADHD is a neurochemical imbalance affecting executive function. Research shows that appropriate medication combined with behavioral therapy improves focus by 40-60% in most children.</p>
                        </div>
                        
                        <div className="border-l-4 border-destructive pl-4 py-2">
                          <p className="font-semibold">Myth: "ADHD is overdiagnosed."</p>
                          <p className="text-muted-foreground">There's a common belief that normal childhood behavior is pathologized.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <p className="font-semibold">Fact:</p>
                          <p>Studies show that when proper diagnostic protocols are followed, ADHD identification is consistent across different populations. The increase in diagnoses reflects better awareness and improved screening.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="asd-myths">
                      <AccordionTrigger className="text-lg font-medium">Autism Spectrum</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="border-l-4 border-destructive pl-4 py-2">
                          <p className="font-semibold">Myth: "Autistic children lack empathy."</p>
                          <p className="text-muted-foreground">A persistent misconception is that children with autism cannot understand others' feelings.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <p className="font-semibold">Fact:</p>
                          <p>Many children with autism experience and express empathy differently. While they may struggle with social cues, they often show empathy through concrete actions, like sharing toys or comforting others when visibly upset.</p>
                        </div>
                        
                        <div className="border-l-4 border-destructive pl-4 py-2">
                          <p className="font-semibold">Myth: "Autism is caused by parenting styles."</p>
                          <p className="text-muted-foreground">Historically, autism was wrongly attributed to cold parenting.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <p className="font-semibold">Fact:</p>
                          <p>Autism has strong genetic components. Research shows that autism is primarily influenced by genetic factors and early brain development, not by parenting approaches.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="dyslexia-myths">
                      <AccordionTrigger className="text-lg font-medium">Dyslexia</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="border-l-4 border-destructive pl-4 py-2">
                          <p className="font-semibold">Myth: "Dyslexics can't read."</p>
                          <p className="text-muted-foreground">Many believe dyslexia prevents reading acquisition altogether.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <p className="font-semibold">Fact:</p>
                          <p>With structured literacy programs specifically designed for dyslexia, approximately 90% of children can achieve grade-level reading proficiency. These approaches focus on explicit phonics instruction and multisensory learning.</p>
                        </div>
                        
                        <div className="border-l-4 border-destructive pl-4 py-2">
                          <p className="font-semibold">Myth: "Dyslexia is just seeing letters backward."</p>
                          <p className="text-muted-foreground">The common belief is that dyslexia is primarily a visual processing issue.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <p className="font-semibold">Fact:</p>
                          <p>Dyslexia is fundamentally a phonological processing deficit affecting how the brain processes the sounds of language. Letter reversals are just one potential symptom and often occur in typically developing young readers as well.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Management Strategies Tab */}
            <TabsContent value="strategies" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>Practical Management Strategies</CardTitle>
                  </div>
                  <CardDescription>
                    Evidence-based approaches for daily life and learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-4">Daily Routines</h3>
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border p-2 text-left">Disorder</th>
                          <th className="border p-2 text-left">Strategy</th>
                          <th className="border p-2 text-left">Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">ADHD</td>
                          <td className="border p-2">Time-blocking with visual timers</td>
                          <td className="border p-2">"20-min homework → 5-min dance break"</td>
                        </tr>
                        <tr>
                          <td className="border p-2">ASD</td>
                          <td className="border p-2">Sensory-friendly zones</td>
                          <td className="border p-2">Weighted blankets, noise-canceling headphones</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Dyslexia</td>
                          <td className="border p-2">Multisensory learning</td>
                          <td className="border p-2">Tracing letters in sand while sounding them out</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-4">Learning Supports</h3>
                  
                  <Accordion type="multiple" className="w-full mb-6">
                    <AccordionItem value="adhd-learning">
                      <AccordionTrigger>ADHD Learning Strategies</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <p>• Gamify chores (e.g., "Beat the clock" tidying)</p>
                        <p>• Use speech-to-text apps for writing tasks</p>
                        <p>• Break assignments into smaller chunks with rewards</p>
                        <p>• Allow fidget tools during listening activities</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="asd-learning">
                      <AccordionTrigger>ASD Learning Strategies</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <p>• Social stories with pictograms to explain emotions</p>
                        <p>• Transition warnings (e.g., "10 minutes until dinner")</p>
                        <p>• Visual schedules for daily routines</p>
                        <p>• Clear, concrete language without idioms</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="dyslexia-learning">
                      <AccordionTrigger>Dyslexia Learning Strategies</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <p>• Colored overlays for text readability</p>
                        <p>• Audiobook pairings with physical books</p>
                        <p>• Text-to-speech software for assignments</p>
                        <p>• Extra time for reading tasks and tests</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <h3 className="font-semibold text-lg mb-4">Emotional Resilience Building</h3>
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Parent Scripts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      <p>• For meltdowns: "Let's breathe together first"</p>
                      <p>• After setbacks: "Mistakes help our brains grow"</p>
                      <p>• For frustration: "This is hard right now, but you're working through it"</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Child-Friendly Explanations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      <p>• ADHD: "Your brain has a racecar engine – we just need better brakes!"</p>
                      <p>• ASD: "Your brain notices details others miss, like having super-vision"</p>
                      <p>• Dyslexia: "You see words like puzzle pieces – we'll find your solving style"</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Strengths Tab */}
            <TabsContent value="strengths" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <CardTitle>Neurodiversity Strength Mapping</CardTitle>
                  </div>
                  <CardDescription>
                    Harnessing unique cognitive profiles as advantages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">Each neurodevelopmental difference brings its own set of strengths. Understanding and nurturing these abilities helps children develop confidence and find their path.</p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ADHD Strengths</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Hyperfocus:</span> Intense concentration on interests</p>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Creativity:</span> Novel problem-solving approaches</p>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Energy:</span> Enthusiasm and dynamic thinking</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ASD Strengths</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Pattern recognition:</span> Identifying complex systems</p>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Attention to detail:</span> Noticing subtleties</p>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Logical thinking:</span> Systematic approaches</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Dyslexia Strengths</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">3D spatial reasoning:</span> Visual-spatial talents</p>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Big picture thinking:</span> Connecting concepts</p>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <p><span className="font-medium">Narrative thinking:</span> Storytelling abilities</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-4">Career Pathways</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">ADHD: Channel energy into:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Entrepreneurship</li>
                        <li>Creative arts and design</li>
                        <li>Emergency services</li>
                        <li>Sports and physical training</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">ASD: Foster talents in:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Computer programming and technology</li>
                        <li>Mathematics and engineering</li>
                        <li>Music and systematic fields</li>
                        <li>Research and analytics</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Dyslexia: Encourage paths in:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Architecture and design</li>
                        <li>Engineering and construction</li>
                        <li>Storytelling and communications</li>
                        <li>Entrepreneurship and innovation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Community & Tools</CardTitle>
                  </div>
                  <CardDescription>
                    Apps, support networks, and professional resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-4">Recommended Apps</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">ADHD Tools</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <p>• <strong>Goally</strong> - Routine management</p>
                        <p>• <strong>Focus@Will</strong> - Concentration music</p>
                        <p>• <strong>Forest</strong> - Focus timer app</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">ASD Support</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <p>• <strong>Visual Schedule Planner</strong> - Daily routines</p>
                        <p>• <strong>Touch Chat</strong> - AAC communication</p>
                        <p>• <strong>Calm Counter</strong> - Emotional regulation</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Dyslexia Aids</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <p>• <strong>Dyslexia Quest</strong> - Literacy games</p>
                        <p>• <strong>Voice Dream Reader</strong> - Text-to-speech</p>
                        <p>• <strong>ModMath</strong> - Math notation tool</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-4">Support Networks</h3>
                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="font-medium">ADHD Resources:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>CHADD - Children and Adults with ADHD (support groups and forums)</li>
                        <li>ADDitude Magazine - Online articles and webinars</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Autism Resources:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Autism Society - Local chapters and support</li>
                        <li>AANE - Asperger/Autism Network resources</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Dyslexia Resources:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>International Dyslexia Association - Research and advocacy</li>
                        <li>British Dyslexia Association - Webinars and guides</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-4">Professional Collaboration Guide</h3>
                  
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Therapies to Request</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <p>• <strong>Occupational Therapy:</strong> For sensory integration (ASD/ADHD)</p>
                      <p>• <strong>Speech Language Therapy:</strong> For communication challenges</p>
                      <p>• <strong>Orton-Gillingham:</strong> For dyslexia literacy gains</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">School Advocacy</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="mb-2">Push for IEP/504 plans with:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Extended test time</li>
                        <li>Oral exam options</li>
                        <li>Movement breaks</li>
                        <li>Preferential seating</li>
                        <li>Note-taking assistance</li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              By framing differences as unique brain wiring with proven management strategies,
              parents gain agency while celebrating their child's potential.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              We recommend regular progress tracking (e.g., monthly "skill wins" journals)
              to reinforce growth over deficits.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
