import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const steps = [
  {
    title: 'Connect your software',
    description: 'Seamlessly integrate with your existing tools and platforms',
    image: '/integrations.webp'
  },
  {
    title: 'Prep data for agents',
    description: 'Transform and structure your data for optimal AI processing',
    image: '/data-ingestion-architecture-300x218.png'
  },
  {
    title: 'Build agents',
    description: 'Create intelligent AI agents tailored to your specific needs',
    image: '/integrations.webp'  // Using same image temporarily
  },
  {
    title: 'Deploy in your environment',
    description: 'Securely deploy and manage your AI agents in production',
    image: '/integrations.webp'  // Using same image temporarily
  }
];

export default function ProcessCarousel() {
  const [activeStep, setActiveStep] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      
      // Calculate which step should be active based on scroll progress
      const newStep = Math.min(
        Math.max(
          Math.floor(scrollProgress * steps.length),
          0
        ),
        steps.length - 1
      );
      
      setActiveStep(newStep);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="py-24">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left side - Process Image */}
        <div className="w-full lg:w-1/2 relative h-[400px]">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`absolute inset-0 transition-opacity duration-500 ${
                activeStep === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Right side - All steps */}
        <div className="w-full lg:w-1/2 space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`transition-all duration-500 ${
                activeStep === index
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-50 -translate-x-4'
              }`}
            >
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
