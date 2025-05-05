
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ASDResourcesProps {
  audience: 'parent' | 'child';
}

const ASDResources: React.FC<ASDResourcesProps> = ({ audience }) => {
  if (audience === 'parent') {
    return <ASDParentResources />;
  } else {
    return <ASDChildResources />;
  }
};

const ASDParentResources = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Understanding Autism Spectrum Disorder</CardTitle>
          <CardDescription>Foundational knowledge for parents and teachers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p>
              <strong>Autism Spectrum Disorder (ASD)</strong> is a neurodevelopmental condition characterized 
              by differences in social communication and interaction, along with restricted or repetitive 
              patterns of behavior, interests, or activities. The term "spectrum" reflects the wide variation 
              in challenges and strengths possessed by each person with autism.
            </p>
            
            <h3 className="text-lg font-semibold mt-4">The Autistic Brain</h3>
            <p>
              Research shows the autistic brain processes information differently. Many individuals with 
              autism have enhanced abilities in pattern recognition, attention to detail, and logical thinking, 
              while often experiencing challenges with social information processing, sensory integration, 
              and executive functioning.
            </p>
          </div>

          <div className="my-6 p-4 bg-muted rounded-lg border">
            <h4 className="font-semibold text-center mb-2">Important Perspective</h4>
            <p className="italic text-center">
              "If you've met one person with autism, you've met one person with autism." 
              — Dr. Stephen Shore, autistic professor and autism advocate
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Myths vs. Facts</CardTitle>
          <CardDescription>Separating misconceptions from evidence-based understanding</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="myth-1">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">Myth</span>
                  <span>"Autistic children lack empathy and don't form attachments."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    Many children with autism experience and express empathy differently. 
                    Research demonstrates that while they may struggle with interpreting social cues, 
                    they often show empathy through concrete actions, like sharing toys or comforting 
                    others when visibly upset. Many autistic individuals report feeling emotions intensely, 
                    sometimes even experiencing empathic overload.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="myth-2">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">Myth</span>
                  <span>"Autism is caused by parenting styles or vaccines."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    Autism has strong genetic components, with heritability estimated at 80%. 
                    Multiple large-scale studies involving millions of children have found no link between vaccines 
                    and autism. Research shows that autism is primarily influenced by genetic factors and 
                    early brain development, not by parenting approaches.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="myth-3">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">Myth</span>
                  <span>"All people with autism have extraordinary talents or savant abilities."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    While some individuals with autism do have exceptional abilities in specific areas 
                    (approximately 10%), the majority do not have savant skills. Every autistic person has 
                    their own unique pattern of strengths and challenges. Many excel in pattern recognition, 
                    attention to detail, logical thinking, and specialized knowledge in their areas of interest.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practical Management Strategies</CardTitle>
          <CardDescription>Evidence-based approaches for daily life and learning</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="communication" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="sensory">Sensory Support</TabsTrigger>
              <TabsTrigger value="routines">Routines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="communication" className="space-y-4">
              <h3 className="font-semibold text-lg">Supporting Communication</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Visual supports:</strong> Use pictures, written schedules, and social stories 
                  to supplement verbal information
                </li>
                <li>
                  <strong>Clear, concrete language:</strong> Avoid idioms, sarcasm, and abstract expressions 
                  which can be confusing
                </li>
                <li>
                  <strong>Processing time:</strong> Allow extra time for responses, as processing language 
                  may take longer
                </li>
              </ul>

              <h3 className="font-semibold text-lg mt-4">Social Understanding</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Explicitly teach social rules</strong> that neurotypical children might learn implicitly
                </li>
                <li>
                  <strong>Social narratives:</strong> Create simple stories describing social situations 
                  and expected behaviors
                </li>
                <li>
                  <strong>Role play:</strong> Practice conversations and interactions in a structured, supportive setting
                </li>
              </ul>

              <div className="p-4 bg-muted rounded-lg mt-4">
                <h4 className="font-semibold">Example Visual Schedule:</h4>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  <div className="p-2 border rounded text-center text-sm">
                    <p className="text-xs">7:00 AM</p>
                    <p>Wake Up</p>
                  </div>
                  <div className="p-2 border rounded text-center text-sm">
                    <p className="text-xs">7:30 AM</p>
                    <p>Breakfast</p>
                  </div>
                  <div className="p-2 border rounded text-center text-sm">
                    <p className="text-xs">8:00 AM</p>
                    <p>Get Dressed</p>
                  </div>
                  <div className="p-2 border rounded text-center text-sm">
                    <p className="text-xs">8:30 AM</p>
                    <p>Brush Teeth</p>
                  </div>
                  <div className="p-2 border rounded text-center text-sm">
                    <p className="text-xs">8:45 AM</p>
                    <p>School Bus</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sensory" className="space-y-4">
              <h3 className="font-semibold text-lg">Sensory Sensitivities</h3>
              <p>
                Many children with autism process sensory information differently, experiencing either heightened 
                sensitivity (hypersensitivity) or reduced sensitivity (hyposensitivity) to various stimuli.
              </p>
              
              <h4 className="font-medium mt-4">Creating Sensory-Friendly Environments:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Auditory:</strong> Noise-canceling headphones, quiet spaces, warning before loud noises
                </li>
                <li>
                  <strong>Visual:</strong> Reduce fluorescent lighting, provide sunglasses, minimize visual clutter
                </li>
                <li>
                  <strong>Tactile:</strong> Respect preferences for clothing textures, seating materials
                </li>
              </ul>

              <h4 className="font-medium mt-4">Sensory Tools:</h4>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="p-3 border rounded">
                  <h5 className="font-medium">For Calming</h5>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Weighted blankets</li>
                    <li>Compression vests</li>
                    <li>Fidget toys</li>
                    <li>White noise machines</li>
                  </ul>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-medium">For Alerting/Regulation</h5>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Chewy tubes or necklaces</li>
                    <li>Therapy swings</li>
                    <li>Vibrating pillows</li>
                    <li>Textured sensory balls</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="routines" className="space-y-4">
              <h3 className="font-semibold text-lg">Predictability & Transitions</h3>
              <p>
                Many autistic children thrive with predictable routines and can find unexpected changes 
                distressing. Structured routines help reduce anxiety and increase independence.
              </p>
              
              <h4 className="font-medium mt-4">Establishing Supportive Routines:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Visual schedules:</strong> Create pictorial or written daily schedules
                </li>
                <li>
                  <strong>Transition warnings:</strong> Give advance notice before changing activities ("5 minutes until dinner")
                </li>
                <li>
                  <strong>First-Then boards:</strong> Visual reminders showing "First we do this, then we do that"
                </li>
                <li>
                  <strong>Choice boards:</strong> Provide structured choices within routines
                </li>
              </ul>

              <div className="p-4 bg-muted rounded-lg mt-4">
                <h4 className="font-semibold">Managing Changes:</h4>
                <p className="mt-2">
                  When routines must change, consider these approaches:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Use social stories to explain changes in advance when possible</li>
                  <li>Create a visual schedule for the new routine</li>
                  <li>Use familiar objects or activities as "anchors" during transitions</li>
                  <li>Allow extra time for processing and adjustment</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strengths of the Autistic Brain</CardTitle>
          <CardDescription>Harnessing unique abilities as advantages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Pattern Recognition</h3>
              <p>
                Many autistic individuals excel at identifying patterns, systems, and details that others miss. 
                This can translate to strengths in mathematics, programming, music, and other rule-based domains.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Detail-Oriented Focus</h3>
              <p>
                The ability to notice and remember small details can be valuable in many fields, 
                from quality control to research to artistic endeavors.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Logical Thinking</h3>
              <p>
                Many autistic individuals approach problems with systematic, logical thinking that 
                can cut through emotional or social biases to find effective solutions.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Notable Individuals on the Spectrum</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Temple Grandin</h4>
                <p className="text-sm text-muted-foreground">Professor, author, and animal science innovator</p>
                <p className="mt-2">
                  Used her visual thinking style and understanding of animal behavior to revolutionize 
                  livestock handling facilities and advocate for autism awareness.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Anthony Hopkins</h4>
                <p className="text-sm text-muted-foreground">Award-winning actor</p>
                <p className="mt-2">
                  Has spoken about his Asperger's diagnosis and how it helped his acting career through 
                  his attention to detail and ability to notice subtle patterns in behavior.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ASDChildResources = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Unique Brain</CardTitle>
          <CardDescription>Understanding how your brain works</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/10 p-6 rounded-xl max-w-xs">
              <img 
                src="/placeholder.svg" 
                alt="Brain illustration" 
                className="mx-auto" 
              />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-lg">
                Your brain is like a <strong>super-powerful computer</strong> that notices details 
                other people might miss. You might see patterns, remember specific facts, or notice 
                tiny changes that others don't see!
              </p>
              <p>
                Your brain might experience the world differently:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sounds might seem louder to you</li>
                <li>Certain textures might feel uncomfortable</li>
                <li>You might understand things better with pictures</li>
                <li>You might have one topic you know everything about!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Daily Tools</CardTitle>
          <CardDescription>Things that can help you every day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 card-hover">
              <h3 className="font-semibold text-lg mb-2">Visual Schedules</h3>
              <p className="mb-3">
                Pictures and schedules can help you know what's happening next. This can make your day 
                feel more comfortable.
              </p>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div className="p-2 border rounded text-center">
                  <p className="text-xs">1</p>
                  <p>Breakfast</p>
                </div>
                <div className="p-2 border rounded text-center">
                  <p className="text-xs">2</p>
                  <p>School</p>
                </div>
                <div className="p-2 border rounded text-center">
                  <p className="text-xs">3</p>
                  <p>Home</p>
                </div>
                <div className="p-2 border rounded text-center">
                  <p className="text-xs">4</p>
                  <p>Bedtime</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 card-hover">
              <h3 className="font-semibold text-lg mb-2">Sensory Tools</h3>
              <p className="mb-3">
                These items can help when things feel too loud, bright, or overwhelming:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Headphones to make sounds quieter</li>
                <li>Fidget toys for your hands</li>
                <li>Sunglasses if lights are too bright</li>
                <li>A special cozy space when you need a break</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-center">Dealing with Big Feelings</h3>
            <p className="mb-3">
              Sometimes you might have big feelings that are hard to handle. Here are some things that might help:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Deep breathing:</strong> Breathe in slowly while counting to 4, hold for 2, then breathe out for 4
              </li>
              <li>
                <strong>Quiet corner:</strong> Have a special place with comfy items where you can go when you feel overwhelmed
              </li>
              <li>
                <strong>Feeling chart:</strong> Point to how you're feeling when it's hard to use words
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Special Powers</CardTitle>
          <CardDescription>Amazing abilities that make you unique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-primary/10 rounded-lg mb-6">
            <h3 className="font-bold text-center text-lg mb-3">Did You Know?</h3>
            <p className="text-center">
              Many famous scientists, artists, inventors and musicians have brains that work like yours!
              They used their special way of seeing the world to create amazing things.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Detail Detective</h3>
              <p className="mt-2">
                You notice tiny details that other people miss!
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Memory Master</h3>
              <p className="mt-2">
                You might remember facts, dates, or information really well!
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Pattern Pro</h3>
              <p className="mt-2">
                You're great at finding patterns and solving puzzles!
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-center mb-2">Activities That Use Your Powers</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div>
                <h4 className="font-medium">Detail Powers:</h4>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Spot-the-difference games</li>
                  <li>Building with LEGO or blocks</li>
                  <li>Finding hidden objects in pictures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Pattern Powers:</h4>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Coding and computer games</li>
                  <li>Music and rhythm activities</li>
                  <li>Math puzzles and games</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ASDResources;
