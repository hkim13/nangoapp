'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ProcessCarousel from '@/components/process-carousel';
import { AgentCards } from '@/components/agent-cards';

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-6xl py-12 sm:py-24 lg:py-32">
          <div className="text-left max-w-[800px]">
            <div className="text-sm text-gray-600 mb-4">
              Automated Business · Custom AI Agents
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Return to being human.
            </h1>
            <h2 className="text-4xl font-normal tracking-tight text-gray-400 sm:text-5xl mt-4">
              Spend less time in front of software with agents.
            </h2>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/auth/signup">
                <Button className="rounded-full px-8 py-6 text-lg font-semibold bg-black text-white border border-transparent transition-all hover:bg-transparent hover:border-black hover:text-black">
                  Let's Automate →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Cards Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
            Our Agents
          </h2>
          <AgentCards />
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
            Our Process
          </h2>
          <ProcessCarousel />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to be more present?
              <br />
              Start using our agents today.
            </h2>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/auth/signup">
                <Button className="rounded-full px-8 py-6 text-lg font-semibold bg-black text-white border border-transparent transition-all hover:bg-transparent hover:border-black hover:text-black">
                  Let's Automate →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
