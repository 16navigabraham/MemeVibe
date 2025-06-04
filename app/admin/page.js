"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { updateApiCredentials, getApiCredentials } from "@/lib/api"
import { Eye, EyeOff, Save, Lock, Swords } from "lucide-react"
import { 
  useSendTransaction, 
  useWaitForTransactionReceipt,
  useAccount,
  usePublicClient 
} from "wagmi"
import { MEME_BATTLES_CONTRACT } from "@/lib/contract"
import { parseGwei, encodeFunctionData } from "viem"
import { farcaster } from "@/lib/wagmi"

export default function AdminPage() {
  // Existing states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [apiPassword, setApiPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // New states for battle creation
  const [castA, setCastA] = useState("")
  const [castB, setCastB] = useState("")
  const [battleStatus, setBattleStatus] = useState("")

  // Replace useWalletClient with new hooks
  const { address, connector, isConnected } = useAccount()
  const { 
    data: hash,
    error: txError,
    isPending,
    sendTransaction 
  } = useSendTransaction()

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Add publicClient
  const publicClient = usePublicClient()

  // Existing login handler
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === "asJrA.61271895$") {
      setIsAuthenticated(true)
      setError("")
      const credentials = getApiCredentials()
      setUsername(credentials.username)
      setApiPassword(credentials.password)
    } else {
      setError("Invalid password")
    }
  }

  // Existing credentials update handler
  const handleUpdateCredentials = (e) => {
    e.preventDefault()
    if (!username || !apiPassword) {
      setError("Both username and password are required")
      return
    }
    try {
      updateApiCredentials(username, apiPassword)
      setSuccessMessage("API credentials updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError("Failed to update API credentials")
    }
  }

  // Add connect handler for Farcaster
  const handleConnect = async () => {
    try {
      await farcaster.connect()
    } catch (err) {
      setBattleStatus("❌ Failed to connect Farcaster")
    }
  }

  // Update battle creation handler - simplified for Farcaster
  const handleCreateBattle = async (e) => {
    e.preventDefault()
    if (!isConnected) {
      setBattleStatus("❌ Connector not connected.")
      return
    }
    if (!castA || !castB) {
      setBattleStatus("Please fill both cast links")
      return
    }

    try {
      setBattleStatus("Preparing battle...")

      const data = encodeFunctionData({
        abi: MEME_BATTLES_CONTRACT.abi,
        functionName: "createBattle",
        args: [castA, castB],
      })

      sendTransaction({
        to: MEME_BATTLES_CONTRACT.address,
        data,
        value: BigInt(0)
      })

    } catch (error) {
      setBattleStatus(`❌ ${error?.shortMessage || error?.message || "Failed to create battle"}`)
    }
  }

  // Simplified transaction monitoring
  useEffect(() => {
    if (isPending) {
      setBattleStatus("Confirm in Warpcast...")
    }
    if (isConfirming) {
      setBattleStatus("Creating battle...")
    }
    if (isConfirmed) {
      setBattleStatus("✅ Battle created!")
      setCastA("")
      setCastB("")
      setTimeout(() => setBattleStatus(""), 3000)
    }
    if (txError) {
      setBattleStatus(`❌ ${txError?.shortMessage || txError?.message || "Failed to create battle"}`)
    }
  }, [isPending, isConfirming, isConfirmed, txError])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-purple-100">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-8">
            {/* API Credentials Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Update API Credentials</h2>

              <form onSubmit={handleUpdateCredentials}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Imgflip Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Imgflip username"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="apiPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Imgflip Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="apiPassword"
                      value={apiPassword}
                      onChange={(e) => setApiPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter Imgflip password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                {successMessage && <div className="mb-4 text-green-500 text-sm">{successMessage}</div>}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Update Credentials
                </button>
              </form>
            </div>

            {/* Battle Creation Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Create New Battle</h2>
              {!isConnected ? (
                <button
                  type="button"
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors mb-4"
                >
                  Connect Farcaster
                </button>
              ) : null}
              <form onSubmit={handleCreateBattle}>
                <div className="mb-4">
                  <label htmlFor="castA" className="block text-sm font-medium text-gray-700 mb-1">
                    Cast A Link
                  </label>
                  <input
                    type="text"
                    id="castA"
                    value={castA}
                    onChange={(e) => setCastA(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter first cast link"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="castB" className="block text-sm font-medium text-gray-700 mb-1">
                    Cast B Link
                  </label>
                  <input
                    type="text"
                    id="castB"
                    value={castB}
                    onChange={(e) => setCastB(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter second cast link"
                    required
                  />
                </div>

                {battleStatus && (
                  <div
                    className={`mb-4 text-sm ${
                      battleStatus.includes("✅") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {battleStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className={`w-full flex items-center justify-center ${
                    isPending || isConfirming 
                      ? 'bg-gray-400' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white font-bold py-2 px-4 rounded-md transition-colors`}
                >
                  <Swords className="mr-2 h-5 w-5" />
                  {isPending ? 'Check Farcaster...' : 
                   isConfirming ? 'Creating Battle...' : 
                   'Create Battle'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}