"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { fetchMemeTemplates } from "@/lib/api"
import Link from "next/link"
import { Search } from "lucide-react"

export default function Gallery() {
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true)
        const data = await fetchMemeTemplates()
        setTemplates(data)
        setFilteredTemplates(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load meme templates")
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTemplates(templates)
    } else {
      const filtered = templates.filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredTemplates(filtered)
    }
  }, [searchQuery, templates])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Meme Gallery</h1>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/create?template=${template.id}`}
                className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={template.url || "/placeholder.svg?height=200&width=200"}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.box_count} text {template.box_count === 1 ? "box" : "boxes"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
