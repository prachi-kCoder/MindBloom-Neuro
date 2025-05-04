
import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Complete the Assessment',
    description: "Answer age-appropriate questions about your child's behavior, interests, and challenges."
  },
  {
    number: '02',
    title: 'Review Your Insights',
    description: "Receive personalized analysis of your child's behavioral patterns and developmental indicators."
  },
  {
    number: '03',
    title: 'Explore Resources',
    description: "Access tailored educational materials and strategies based on your child's specific needs."
  },
  {
    number: '04',
    title: 'Connect with Professionals',
    description: 'Book consultations with specialists who can provide expert guidance and intervention.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 relative z-0">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-soft-peach/50 px-3 py-1 text-sm text-primary">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your Path to Understanding</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A simple, supportive journey to better understand and assist your child's unique developmental needs.
            </p>
          </div>
        </div>
        
        <div className="mt-16 relative">
          {/* Timeline connector */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block"></div>
          
          <div className="space-y-16 md:space-y-0 relative">
            {steps.map((step, index) => (
              <div key={index} className={`md:grid md:grid-cols-2 md:gap-8 md:items-center relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} ${index !== steps.length - 1 ? 'pb-16' : ''}`}>
                <div className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:text-right md:justify-end' : 'md:text-left'} z-0`}>
                  <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-primary/20 to-primary/40 text-primary ${index % 2 === 0 ? 'md:ml-4' : 'md:mr-4'}`}>
                      {step.number}
                    </div>
                  </div>
                  <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <div className={`mt-6 md:mt-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} z-0`}>
                  <div className={`bg-soft-blue/20 backdrop-blur-sm rounded-xl p-6 h-40 flex items-center justify-center ${index % 2 === 0 ? '' : ''}`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-white shadow-sm`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                          {index === 0 ? (
                            // Assessment icon
                            <g>
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 12h6" />
                              <path d="M12 9v6" />
                            </g>
                          ) : index === 1 ? (
                            // Insights icon
                            <g>
                              <path d="M3 3v18h18" />
                              <path d="m19 9-5 5-4-4-3 3" />
                            </g>
                          ) : index === 2 ? (
                            // Resources icon
                            <g>
                              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </g>
                          ) : (
                            // Connect icon
                            <g>
                              <circle cx="9" cy="7" r="4" />
                              <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                              <circle cx="19" cy="11" r="2" />
                              <path d="M19 17v-2a2 2 0 0 0-2-2h-2" />
                            </g>
                          )}
                        </svg>
                      </div>
                      <p className="mt-2 text-sm font-medium text-foreground/80">
                        {index === 0 ? 'Personalized Questions' : 
                         index === 1 ? 'Data Visualization' : 
                         index === 2 ? 'Tailored Resources' : 
                         'Expert Guidance'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
