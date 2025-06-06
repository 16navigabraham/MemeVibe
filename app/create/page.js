"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { fetchMemeTemplates, generateMeme } from "@/lib/api"
import { RefreshCw, Send } from "lucide-react"
import { handleCastMeme } from "./handleCastMeme"
import { useMintMeme } from "./useMintMeme"

export default function CreateMeme() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTemplateId = searchParams.get("template")

  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [textInputs, setTextInputs] = useState(["", ""])
  const [generatedMeme, setGeneratedMeme] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    isConnected,
    isConnecting,
    ethBalance,
    canMint,
    mintMeme,
    minting,
    mintError,
    mintSuccess,
    connectWallet,
  } = useMintMeme()

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchMemeTemplates()
        setTemplates(data)

        // If template ID is provided in URL, select it
        if (initialTemplateId) {
          const template = data.find((t) => t.id === initialTemplateId)
          if (template) {
            setSelectedTemplate(template)
            // Initialize text inputs based on box count
            setTextInputs(Array(template.box_count).fill(""))
          }
        }
      } catch (err) {
        setError("Failed to load meme templates")
      }
    }

    loadTemplates()
  }, [initialTemplateId])

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setTextInputs(Array(template.box_count).fill(""))
    setGeneratedMeme(null)
  }

  const handleTextChange = (index, value) => {
    const newTextInputs = [...textInputs]
    newTextInputs[index] = value
    setTextInputs(newTextInputs)
  }

  const handleGenerateMeme = async () => {
    if (!selectedTemplate) return

    try {
      setLoading(true)
      setError(null)
      const result = await generateMeme(selectedTemplate.id, textInputs)
      setGeneratedMeme(result)
      setLoading(false)
    } catch (err) {
      setError("Failed to generate meme. Please try again.")
      setLoading(false)
    }
  }

  // Updated onCastClick function to pass the meme URL and text inputs
  const onCastClick = () => {
    if (!generatedMeme) return;
    
    // Get the actual URL of the generated meme
    const memeUrl = generatedMeme.url;
    
    // Pass both the URL and the text inputs to the handleCastMeme function
    handleCastMeme(memeUrl, textInputs);
  }

  // Mint button handler
  const onMintClick = async () => {
    if (!isConnected) {
      connectWallet()
      return
    }
    if (!generatedMeme) return
    await mintMeme(generatedMeme.url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Your Meme</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
            <div className="h-[600px] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-purple-600 shadow-md"
                        : "border-transparent hover:border-purple-300"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="relative h-32 w-full">
                      <Image
                        src={template.url || "/placeholder.svg?height=128&width=128"}
                        alt={template.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meme Editor */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Your Text</h2>

            {selectedTemplate ? (
              <>
                <div className="relative w-full h-64 mb-6 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={selectedTemplate.url || "/placeholder.svg?height=256&width=256"}
                    alt={selectedTemplate.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="space-y-4">
                  {textInputs.map((text, index) => (
                    <div key={index} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Text Box {index + 1}</label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => handleTextChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={`Enter text for box ${index + 1}`}
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleGenerateMeme}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-purple-400"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                        Generating...
                      </span>
                    ) : (
                      "Generate Meme"
                    )}
                  </button>

                  {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Select a template from the left panel to get started</p>
              </div>
            )}
          </div>

          {/* Generated Meme */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Meme</h2>

            {generatedMeme ? (
              <>
                <div className="relative w-full h-64 mb-6 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={generatedMeme.url || "/placeholder.svg?height=256&width=256"}
                    alt="Generated Meme"
                    fill
                    className="object-contain"
                  />
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Back to Home
                </button>

                <button
                  onClick={onCastClick}
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors mt-2"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Cast to Warpcast
                </button>

                {/* Mint Meme Button */}
                <button
                  onClick={onMintClick}
                  disabled={
                    minting ||
                    !isConnected && isConnecting ||
                    !canMint ||
                    !generatedMeme
                  }
                  className={`w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition-colors mt-2
                    ${minting || !canMint ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  {minting
                    ? "Minting..."
                    : !isConnected
                      ? "Connect Wallet to Mint"
                      : ethBalance !== null && ethBalance < 0.001
                        ? "Insufficient ETH"
                        : "🪙 Mint Meme"}
                </button>

                {/* Mint status messages */}
                {mintError && (
                  <div className="text-red-500 text-sm mt-2">{mintError}</div>
                )}
                {mintSuccess && (
                  <div className="text-green-600 text-sm mt-2">
                    ✅ Mint successful! Check your wallet.
                  </div>
                )}

                {/* Show ETH balance warning if low */}
                {isConnected && ethBalance !== null && ethBalance < 0.001 && (
                  <div className="text-orange-500 text-xs mt-1">
                    Not enough ETH for gas. Please fund your wallet.
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Your generated meme will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}