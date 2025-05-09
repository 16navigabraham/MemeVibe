import Link from "next/link"
import { Navbar } from "@/components/navbar"

export function HeroSection() {
  return (
    <div className="mb-9"> 
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600">
      <Navbar />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Create Hilarious Memes in Seconds</h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Choose from hundreds of templates, add your text, and share your creations with the world.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/create"
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Create a Meme
            </Link>
            <Link
              href="/gallery"
              className="bg-purple-700 text-white hover:bg-purple-800 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
