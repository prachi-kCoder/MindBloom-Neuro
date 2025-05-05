
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

interface DyslexiaResourcesProps {
  audience: 'parent' | 'child';
}

const DyslexiaResources: React.FC<DyslexiaResourcesProps> = ({ audience }) => {
  if (audience === 'parent') {
    return <DyslexiaParentResources />;
  } else {
    return <DyslexiaChildResources />;
  }
};

const DyslexiaParentResources = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Understanding Dyslexia</CardTitle>
          <CardDescription>Foundational knowledge for parents and teachers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p>
              <strong>Dyslexia</strong> is a specific learning disability that affects reading and language processing. 
              It is characterized by difficulties with accurate and/or fluent word recognition, poor spelling, and 
              decoding abilities, despite normal intelligence and adequate educational opportunity.
            </p>
            
            <h3 className="text-lg font-semibold mt-4">The Dyslexic Brain</h3>
            <p>
              Research shows that dyslexia is fundamentally a phonological processing deficit—affecting how 
              the brain processes the sounds of language. Brain imaging studies reveal that individuals with 
              dyslexia often show differences in the parts of the brain responsible for language processing. 
              However, many dyslexic individuals also show strengths in visual-spatial reasoning, creative thinking, 
              and big-picture comprehension.
            </p>
          </div>

          <div className="my-6 p-4 bg-muted rounded-lg border">
            <h4 className="font-semibold text-center mb-2">Important Perspective</h4>
            <p className="italic text-center">
              "Dyslexia is not a reflection of intelligence. It's a different wiring of the brain that can bring 
              unique strengths along with the challenges in reading."
            </p>
          </div>

          <h3 className="text-lg font-semibold">Signs of Dyslexia</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-center">Early Years (Ages 5-6)</h4>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Difficulty learning letter names and sounds</li>
                <li>Trouble recognizing rhyming patterns</li>
                <li>Delayed speech development</li>
                <li>Persistent confusion of left versus right</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-center">Elementary (Ages 7-12)</h4>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Reading well below grade level</li>
                <li>Letter or number reversals past age 7</li>
                <li>Slow, laborious reading</li>
                <li>Strong comprehension despite poor decoding</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-center">Teen Years (Ages 13+)</h4>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Continued spelling difficulties</li>
                <li>Avoidance of reading tasks</li>
                <li>Poor organizational skills</li>
                <li>Strong critical thinking despite reading challenges</li>
              </ul>
            </div>
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
                  <span>"Dyslexia is just seeing letters backward."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    Dyslexia is fundamentally a phonological processing deficit affecting how the brain 
                    processes the sounds of language. Letter reversals are just one potential symptom and 
                    often occur in typically developing young readers as well. The core challenge involves 
                    connecting letters to their corresponding sounds and blending these sounds into words.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="myth-2">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">Myth</span>
                  <span>"Dyslexic children can't learn to read well."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    With structured literacy programs specifically designed for dyslexia, approximately 90% 
                    of children can achieve grade-level reading proficiency. These approaches focus on explicit 
                    phonics instruction, systematic and cumulative teaching, and multisensory learning. Early 
                    intervention yields the best results, but it's never too late to improve reading skills.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="myth-3">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">Myth</span>
                  <span>"Dyslexia affects intelligence."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    By definition, dyslexia occurs regardless of intelligence. Many dyslexic individuals have 
                    average or above-average intelligence. Notable figures like Albert Einstein, Steve Jobs, 
                    and Richard Branson all had dyslexia. Dyslexic thinking is often characterized by strengths 
                    in creative problem-solving, innovation, and big-picture thinking.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence-Based Reading Approaches</CardTitle>
          <CardDescription>Structured literacy techniques for dyslexic learners</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="approaches" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="approaches">Reading Methods</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodations</TabsTrigger>
              <TabsTrigger value="technology">Assistive Tech</TabsTrigger>
            </TabsList>
            
            <TabsContent value="approaches" className="space-y-4">
              <h3 className="font-semibold text-lg">Structured Literacy Methods</h3>
              <p>
                Research consistently shows that explicit, systematic, and multisensory instruction 
                works best for dyslexic learners.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Orton-Gillingham Approach</h4>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Direct, explicit instruction in phonics</li>
                    <li>Multisensory techniques engaging visual, auditory, and kinesthetic pathways</li>
                    <li>Systematic and cumulative learning sequence</li>
                    <li>Frequent review and practice</li>
                  </ul>
                  <p className="text-sm italic mt-2">
                    Programs based on O-G: Wilson Reading System, Barton Reading Program
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Other Effective Methods</h4>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Lindamood-Bell:</strong> Focus on phoneme awareness and visualization</li>
                    <li><strong>Davis Dyslexia Method:</strong> Emphasizes visual and kinesthetic learning</li>
                    <li><strong>Structured Word Inquiry:</strong> Investigates how spelling represents meaning</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg mt-4">
                <h4 className="font-semibold">The Multisensory Advantage</h4>
                <p className="mt-2">
                  Multisensory learning engages multiple pathways in the brain simultaneously. For example:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li><strong>Visual:</strong> Looking at letters and words</li>
                  <li><strong>Auditory:</strong> Hearing sounds and reading aloud</li>
                  <li><strong>Kinesthetic:</strong> Tracing letters in sand or forming them with clay</li>
                  <li><strong>Tactile:</strong> Using textured materials to form letters</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="accommodation" className="space-y-4">
              <h3 className="font-semibold text-lg">School and Learning Accommodations</h3>
              <p>
                Appropriate accommodations remove barriers to learning while still challenging students to develop skills.
              </p>
              
              <h4 className="font-medium mt-4">Reading Accommodations:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Extended time</strong> for reading assignments and tests (typically 1.5-2x)
                </li>
                <li>
                  <strong>Audio versions</strong> of textbooks and reading materials
                </li>
                <li>
                  <strong>Text-to-speech</strong> software for independent reading
                </li>
                <li>
                  <strong>Colored overlays</strong> or reading rulers for visual tracking support
                </li>
              </ul>

              <h4 className="font-medium mt-4">Writing Accommodations:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Speech-to-text</strong> software for longer writing assignments
                </li>
                <li>
                  <strong>Word banks</strong> for spelling support
                </li>
                <li>
                  <strong>Alternative assessments</strong> that don't rely heavily on written expression
                </li>
                <li>
                  <strong>Note-taking assistance</strong> (printed teacher notes, recording devices)
                </li>
              </ul>

              <div className="p-4 bg-muted rounded-lg mt-4">
                <h4 className="font-semibold">School Advocacy Tips:</h4>
                <ul className="list-disc pl-6 mt-2">
                  <li>Request formal accommodations through an IEP (Individualized Education Plan) or 504 Plan</li>
                  <li>Document your child's specific challenges and needs</li>
                  <li>Focus on accommodations that provide access without reducing expectations</li>
                  <li>Maintain regular communication with teachers about what's working</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="technology" className="space-y-4">
              <h3 className="font-semibold text-lg">Assistive Technology Solutions</h3>
              <p>
                Modern technology offers powerful tools to help dyslexic learners access information 
                and demonstrate their knowledge.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Reading Support Tools</h4>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Voice Dream Reader:</strong> Text-to-speech with visual highlighting</li>
                    <li><strong>Learning Ally:</strong> Human-narrated audiobooks for dyslexic readers</li>
                    <li><strong>OpenDyslexic:</strong> Font designed to increase readability</li>
                    <li><strong>Rewordify:</strong> Simplifies complex text while maintaining meaning</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Writing & Organization Tools</h4>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Grammarly:</strong> Grammar and spelling assistance</li>
                    <li><strong>Dragon Naturally Speaking:</strong> Advanced speech-to-text</li>
                    <li><strong>Inspiration:</strong> Visual mapping for organizing ideas</li>
                    <li><strong>ModMath:</strong> Digital graph paper for math problems</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg mt-4">
                <h4 className="font-semibold">Technology Principles:</h4>
                <ul className="list-disc pl-6 mt-2">
                  <li>Use technology as a scaffold, not a replacement for learning skills</li>
                  <li>Match technology to specific challenges (e.g., decoding, fluency, comprehension)</li>
                  <li>Balance independent reading skills with access to grade-level content</li>
                  <li>Teach students to self-advocate for needed technology</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dyslexic Thinking: Strengths & Abilities</CardTitle>
          <CardDescription>Harnessing unique cognitive profiles as advantages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">3D Spatial Reasoning</h3>
              <p>
                Many dyslexic individuals excel at visualizing in three dimensions, understanding 
                how objects relate in space, and mentally manipulating spatial information.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Big Picture Thinking</h3>
              <p>
                The ability to see connections between ideas, grasp concepts holistically, and 
                understand complex systems is a common strength in dyslexic thinking.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Narrative & Creative Thinking</h3>
              <p>
                Many dyslexic individuals have strengths in storytelling, creative problem-solving, 
                and finding innovative solutions to challenges.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Notable Individuals with Dyslexia</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Richard Branson</h4>
                <p className="text-sm text-muted-foreground">Entrepreneur & founder of Virgin Group</p>
                <p className="mt-2">
                  Has been open about his dyslexia and how it led him to develop strong delegation skills, 
                  big-picture thinking, and clear communication strategies in business.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Octavia Spencer</h4>
                <p className="text-sm text-muted-foreground">Academy Award-winning actress</p>
                <p className="mt-2">
                  Has spoken about how dyslexia helped her develop exceptional memorization techniques for 
                  scripts and a deep understanding of character emotions and motivations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Career Pathways</h3>
            <p>Fields where dyslexic thinking can be particularly valuable:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Architecture & Design:</strong> Using spatial reasoning and visual thinking</li>
              <li><strong>Engineering & Construction:</strong> Applying 3D visualization and problem-solving</li>
              <li><strong>Entrepreneurship:</strong> Leveraging big-picture thinking and creative solutions</li>
              <li><strong>Arts & Entertainment:</strong> Storytelling and creative expression</li>
              <li><strong>Science & Innovation:</strong> Making connections between diverse concepts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DyslexiaChildResources = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Amazing Brain</CardTitle>
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
                Your brain is <strong>wired differently</strong> in a really cool way! While reading might 
                be tricky, your brain is super talented at other amazing things.
              </p>
              <p>
                Your brain might be extra good at:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Seeing the big picture when others get stuck on small details</li>
                <li>Imagining things in 3D—like building with blocks or LEGOs</li>
                <li>Coming up with creative ideas and solutions</li>
                <li>Telling stories and seeing connections between things</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reading Your Way</CardTitle>
          <CardDescription>Tools and tricks that make reading easier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 card-hover">
              <h3 className="font-semibold text-lg mb-2">Reading Tools</h3>
              <p className="mb-3">
                These tools can make reading easier and more fun:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Colored reading strips that make words stand still</li>
                <li>Books with audio that read along with you</li>
                <li>Special fonts that are easier to read</li>
                <li>Reading apps that help with tricky words</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 card-hover">
              <h3 className="font-semibold text-lg mb-2">Fun Reading Activities</h3>
              <p className="mb-3">
                These activities help train your reading brain:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Word games that help you hear sounds in words</li>
                <li>Reading while tracing letters with your finger</li>
                <li>Making words with clay or magnetic letters</li>
                <li>Reading comics or graphic novels with pictures</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-center">Reading Challenge: Beat Your Own Record!</h3>
            <p className="mb-3">
              Try these fun ways to track your reading progress:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Word Detective:</strong> Keep a list of new words you learn to read
              </li>
              <li>
                <strong>Reading Timer:</strong> See if you can read a little longer each day
              </li>
              <li>
                <strong>Book Adventure:</strong> Create a map of all the books you read
              </li>
            </ul>
            <p className="mt-3 italic text-center">
              Remember: The goal is to beat YOUR last record, not to compete with anyone else!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Superpowers</CardTitle>
          <CardDescription>Special strengths that make you amazing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-primary/10 rounded-lg mb-6">
            <h3 className="font-bold text-center text-lg mb-3">Did You Know?</h3>
            <p className="text-center">
              Many famous inventors, artists, architects, and storytellers have brains that work just like yours!
              They used their different way of thinking to create amazing things.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Building Superpower</h3>
              <p className="mt-2">
                You can visualize and build amazing 3D creations!
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Puzzle Superpower</h3>
              <p className="mt-2">
                You can solve problems by seeing patterns others miss!
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Story Superpower</h3>
              <p className="mt-2">
                You can create amazing stories and see connections between ideas!
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-center mb-2">Activities That Use Your Powers</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div>
                <h4 className="font-medium">Build & Create:</h4>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Building with LEGO or blocks</li>
                  <li>Making 3D art projects</li>
                  <li>Drawing maps and mazes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Think & Solve:</h4>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Puzzles and brainteasers</li>
                  <li>Science experiments</li>
                  <li>Storytelling and creative writing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-primary rounded-lg">
            <h3 className="font-semibold text-center">Words to Remember</h3>
            <p className="text-center mt-2 italic">
              "Reading might be harder for you, but that doesn't mean you're not smart. 
              Your brain just works differently, and that different thinking is what makes you special!"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DyslexiaResources;
