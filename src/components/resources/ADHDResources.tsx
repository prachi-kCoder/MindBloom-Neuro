
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

interface ADHDResourcesProps {
  audience: 'parent' | 'child';
}

const ADHDResources: React.FC<ADHDResourcesProps> = ({ audience }) => {
  if (audience === 'parent') {
    return <ADHDParentResources />;
  } else {
    return <ADHDChildResources />;
  }
};

const ADHDParentResources = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Understanding ADHD</CardTitle>
          <CardDescription>Foundational knowledge for parents and teachers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p>
              <strong>ADHD (Attention-Deficit/Hyperactivity Disorder)</strong> is a neurodevelopmental 
              condition affecting approximately 5-7% of children worldwide. It's characterized by consistent 
              patterns of inattention, hyperactivity, and impulsivity that interfere with development or functioning.
            </p>
            
            <h3 className="text-lg font-semibold mt-4">The ADHD Brain</h3>
            <p>
              ADHD involves differences in brain structure and neurotransmitter function, particularly 
              in areas responsible for executive functions like focus, impulse control, and organization. 
              These differences are largely genetic and neurobiological—not the result of parenting or diet.
            </p>
          </div>

          <div className="my-6 p-4 bg-muted rounded-lg border">
            <h4 className="font-semibold text-center mb-2">Important Perspective</h4>
            <p className="italic text-center">
              "ADHD is not a deficit of attention, but a difficulty regulating attention. Children with ADHD 
              can often hyperfocus on activities they find engaging while struggling to maintain focus on less stimulating tasks."
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
                  <span>"ADHD is just a lack of discipline or laziness."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    ADHD is a neurobiological condition affecting brain development and function. 
                    Brain imaging studies show distinct differences in neural pathways related to attention 
                    and executive function. Research confirms that appropriate medication combined with 
                    behavioral therapy improves focus by 40-60% in most children.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="myth-2">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">Myth</span>
                  <span>"ADHD is overdiagnosed and overmedicated."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    Studies show that when proper diagnostic protocols are followed, ADHD identification 
                    is consistent across different populations. The increase in diagnoses reflects better 
                    awareness and improved screening. Furthermore, research indicates that children with 
                    ADHD who receive appropriate treatment show better long-term outcomes in academic 
                    achievement, social relationships, and mental health.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="myth-3">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">Myth</span>
                  <span>"Children with ADHD can't focus on anything."</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 border-l-4 border-primary pl-4 py-2">
                  <p className="font-semibold">Fact:</p>
                  <p>
                    Many children with ADHD can hyperfocus on activities they find interesting or stimulating. 
                    The challenge is with regulating attention rather than a complete inability to focus. 
                    This hyperfocus can actually become a strength when channeled into productive activities 
                    aligned with the child's interests.
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
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="home">Home Strategies</TabsTrigger>
              <TabsTrigger value="school">School Strategies</TabsTrigger>
              <TabsTrigger value="screen">Screen Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="home" className="space-y-4">
              <h3 className="font-semibold text-lg">Creating Structure</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Consistent routines:</strong> Create visual schedules and checklists 
                  for morning, homework, and bedtime routines
                </li>
                <li>
                  <strong>Time-blocking:</strong> Use visual timers for activities (e.g., 20-minute 
                  homework sessions followed by 5-minute movement breaks)
                </li>
                <li>
                  <strong>Organize the environment:</strong> Designate specific places for belongings 
                  and reduce visual clutter
                </li>
              </ul>

              <h3 className="font-semibold text-lg mt-4">Effective Communication</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Give one instruction at a time</strong> instead of multi-step directions
                </li>
                <li>
                  <strong>Maintain eye contact</strong> when giving important information
                </li>
                <li>
                  <strong>Ask for verbal confirmation</strong> to ensure understanding
                </li>
              </ul>

              <div className="p-4 bg-muted rounded-lg mt-4">
                <h4 className="font-semibold">Parent Script Example:</h4>
                <p className="italic">
                  "I see you're having a hard time getting started on your homework. 
                  Let's break it down together. Which part seems most interesting to you? 
                  We'll start there for just 10 minutes, then take a quick break."
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="school" className="space-y-4">
              <h3 className="font-semibold text-lg">Classroom Accommodations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Seating placement:</strong> Near the teacher, away from distractions 
                  like windows or high-traffic areas
                </li>
                <li>
                  <strong>Movement opportunities:</strong> Allowing fidget tools, standing desks, 
                  or designated movement breaks
                </li>
                <li>
                  <strong>Assignment modifications:</strong> Breaking longer assignments into 
                  smaller chunks with checkpoints
                </li>
              </ul>

              <h3 className="font-semibold text-lg mt-4">School Advocacy</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-2">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Support Type</th>
                      <th className="border p-2 text-left">What to Request</th>
                      <th className="border p-2 text-left">Benefits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">504 Plan</td>
                      <td className="border p-2">Extended time, frequent breaks, reduced homework</td>
                      <td className="border p-2">Legally ensures accommodations are provided</td>
                    </tr>
                    <tr>
                      <td className="border p-2">IEP</td>
                      <td className="border p-2">Specialized instruction, behavioral support</td>
                      <td className="border p-2">More comprehensive for significant learning impacts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="screen" className="space-y-4">
              <h3 className="font-semibold text-lg">Managing Digital Stimulation</h3>
              <p>
                Children with ADHD are often drawn to the constant stimulation and immediate rewards 
                of screens, which can worsen attention issues over time.
              </p>
              
              <h4 className="font-medium mt-4">Practical Interventions:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Use gamified learning apps</strong> with 5–7 minute sessions to match attention spans
                </li>
                <li>
                  <strong>Enforce tech breaks</strong> with visual timers (30 minutes on, 30 minutes off)
                </li>
                <li>
                  <strong>Enable focus modes</strong> on devices to block distracting notifications
                </li>
                <li>
                  <strong>Balance screen time</strong> with physical activity (outdoor play, sports)
                </li>
              </ul>

              <div className="p-4 bg-muted rounded-lg mt-4">
                <h4 className="font-semibold">Recommended Applications:</h4>
                <ul className="mt-2">
                  <li><strong>Goally:</strong> Routine management with rewards</li>
                  <li><strong>Focus@Will:</strong> Background music designed to improve concentration</li>
                  <li><strong>Forest:</strong> Gamified focus timer app</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strengths of the ADHD Brain</CardTitle>
          <CardDescription>Harnessing unique abilities as advantages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Creativity & Innovation</h3>
              <p>
                Many people with ADHD excel at divergent thinking—generating multiple solutions 
                to open-ended problems. This out-of-the-box thinking is highly valuable in fields 
                requiring innovation.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Hyperfocus Capability</h3>
              <p>
                When engaged in interesting activities, people with ADHD can achieve intense 
                concentration and productivity—often working longer and with greater attention 
                to detail than others.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">High Energy & Enthusiasm</h3>
              <p>
                The energetic nature of many children with ADHD can translate to passion, 
                drive and infectious enthusiasm when channeled into areas of interest.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Notable Individuals with ADHD</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Michael Phelps</h4>
                <p className="text-sm text-muted-foreground">Olympic swimmer with 28 medals</p>
                <p className="mt-2">
                  Channeled his tremendous energy into swimming, using the structured routine 
                  and physical outlet to manage his ADHD symptoms.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Richard Branson</h4>
                <p className="text-sm text-muted-foreground">Entrepreneur & founder of Virgin Group</p>
                <p className="mt-2">
                  Credits his creative thinking and risk-taking attitude, common ADHD traits, 
                  as key factors in his business success.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ADHDChildResources = () => {
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
                Did you know your brain has a <strong>superpower engine</strong>? It's like having a 
                race car engine in your mind! Sometimes it might feel hard to control, but with the 
                right tools, you can use this power to do amazing things.
              </p>
              <p>
                Your brain might work differently from some other kids. That's not bad—it's just 
                different! You might notice:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your thoughts move really fast</li>
                <li>You notice things others don't see</li>
                <li>Sitting still feels really hard sometimes</li>
                <li>You can get super focused on things you love</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Learning Your Way</CardTitle>
          <CardDescription>Fun activities that help you learn better</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 card-hover">
              <h3 className="font-semibold text-lg mb-2">Movement Breaks</h3>
              <p className="mb-3">
                Did you know moving can help your brain focus better? Try these fun movement breaks:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Jumping jacks for 30 seconds</li>
                <li>Stretching like your favorite animal</li>
                <li>Dancing to your favorite song</li>
              </ul>
              <p className="text-sm italic">
                Try doing these between homework subjects or when you feel wiggly!
              </p>
            </div>
            
            <div className="border rounded-lg p-4 card-hover">
              <h3 className="font-semibold text-lg mb-2">Learning Games</h3>
              <p className="mb-3">
                These games are super fun AND help your brain get stronger:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Memory matching cards</li>
                <li>Simon Says (great for listening skills!)</li>
                <li>"I Spy" for observation practice</li>
              </ul>
              <p className="text-sm italic">
                Challenge yourself to beat your own record each time!
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-center">Screen Time Tips</h3>
            <p className="mb-3">
              Screens can be super fun, but they can sometimes make it harder for your amazing brain to focus. 
              Try these ideas:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Timer challenge:</strong> Set a timer for how long you'll use screens, 
                then take a break to move your body
              </li>
              <li>
                <strong>Learning apps:</strong> Try apps like Prodigy Math or Epic Reading that 
                make learning feel like playing
              </li>
              <li>
                <strong>Create, don't just watch:</strong> Use screens to make your own stories, 
                art or videos instead of just watching others
              </li>
            </ul>
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
              Many famous inventors, athletes, artists and entrepreneurs have brains that work just like yours!
              They used their different way of thinking to do incredible things.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Creative Thinking</h3>
              <p className="mt-2">
                You can come up with ideas and solutions that no one else thinks of!
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Energy & Enthusiasm</h3>
              <p className="mt-2">
                Your energy can inspire others and help you accomplish big goals!
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold">Super Focus</h3>
              <p className="mt-2">
                When you really care about something, you can focus so deeply and learn everything about it!
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-center mb-2">Your Superpower Journal</h3>
            <p>
              Keep track of times when you've used your special strengths! When did you:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Solve a problem in a creative way</li>
              <li>Notice something important that others missed</li>
              <li>Learn everything about a topic that interests you</li>
              <li>Use your energy to accomplish something big</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ADHDResources;
