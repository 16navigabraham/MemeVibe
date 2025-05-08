"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { fetchMemeTemplates } from "@/lib/api"

export function MemeGallery() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true)
        const data = await fetchMemeTemplates()
        setTemplates(data.slice(0, 12)) // Show only first 12 templates on homepage
        setLoading(false)
      } catch (err) {
        setError("Failed to load meme templates")
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {templates.map((template) => (
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
          </div>
        </Link>
      ))}
    </div>
  )
}
