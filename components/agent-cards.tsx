'use client'

import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'

const agents = [
  {
    id: 1,
    name: 'Agent 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    image: '/Agent 1.png',
    link: '/agent1'
  },
  {
    id: 2,
    name: 'Agent 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    image: '/Agent 1.png',
    link: '/agent2'
  },
  {
    id: 3,
    name: 'Agent 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    image: '/Agent 1.png',
    link: '/agent3'
  }
]

export function AgentCards() {
  return (
    <div className="">
      {agents.map((agent) => (
        <div key={agent.id} className="flex flex-col md:flex-row gap-24 items-center">
          {/* Image container */}
          <div className="w-full md:w-3/5 relative h-[500px] rounded-3xl overflow-hidden">
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              className="object-contain rounded-3xl"
              priority={agent.id === 1}
            />
          </div>
          
          {/* Content container */}
          <div className="w-full md:w-2/5 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-semibold mb-6">{agent.name}</h3>
              <p className="text-gray-600 text-lg mb-8">{agent.description}</p>
            </div>
            <div>
              <Link href={agent.link}>
                <Button className="w-full md:w-auto rounded-full px-8 py-6 text-lg font-semibold bg-black text-white border border-transparent transition-all hover:bg-transparent hover:border-black hover:text-black">
                  Learn More →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
