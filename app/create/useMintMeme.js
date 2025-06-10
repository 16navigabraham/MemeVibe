import { useState, useCallback, useEffect } from "react"
import { useAccount, useBalance, useConnect, useDisconnect, useWalletClient, usePublicClient } from "wagmi"

// Replace with your deployed NFT contract address and ABI
const NFT_CONTRACT_ADDRESS = "0x47AE624EC4a5B9137b38E3134446B1aF245027A9"
const NFT_CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "imageUrl", "type": "string" }],
    "name": "mintMeme",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export function useMintMeme() {
  const { address, isConnected, isConnecting } = useAccount()
  const { data: balanceData, refetch: refetchBalance } = useBalance({ address, watch: true })
  const { connectAsync, connectors, error: wagmiConnectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const [minting, setMinting] = useState(false)
  const [mintError, setMintError] = useState(null)
  const [mintSuccess, setMintSuccess] = useState(false)
  const [ethBalance, setEthBalance] = useState(null)

  // Update ETH balance
  useEffect(() => {
    if (balanceData && balanceData.value) {
      setEthBalance(Number(balanceData.value) / 1e18)
    } else {
      setEthBalance(null)
    }
  }, [balanceData])

  // Can mint if connected and has enough ETH
  const canMint = isConnected && ethBalance !== null && ethBalance >= 0.00005

  // Connect wallet (prefer Farcaster, fallback to injected)
  const connectWallet = useCallback(async () => {
    setMintError(null)
    try {
      // Try to find Farcaster wallet
      const farcasterConnector = connectors.find(
        (c) => c.id?.toLowerCase().includes("farcaster")
      )
      if (farcasterConnector) {
        await connectAsync({ connector: farcasterConnector })
        return
      }
      // Fallback: try injected wallet (MetaMask, etc.)
      const injectedConnector = connectors.find(
        (c) => c.id === "injected"
      )
      if (injectedConnector) {
        await connectAsync({ connector: injectedConnector })
        return
      }
      // No wallet found
      setMintError(
        "No compatible wallet found. Please install the Farcaster wallet extension or another Ethereum wallet."
      )
    } catch (err) {
      setMintError(
        err?.shortMessage ||
        err?.message ||
        wagmiConnectError?.message ||
        "Failed to connect wallet."
      )
    }
  }, [connectAsync, connectors, wagmiConnectError])

  // Mint meme function
  const mintMeme = useCallback(async (imageUrl) => {
    setMintError(null)
    setMintSuccess(false)
    if (!isConnected) {
      setMintError("Wallet not connected.")
      return
    }
    if (!canMint) {
      setMintError("Insufficient ETH balance.")
      return
    }
    if (!walletClient) {
      setMintError("Wallet client not available.")
      return
    }
    setMinting(true)
    try {
      // Prepare transaction
      const { request } = await publicClient.simulateContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: "mintMeme",
        args: [imageUrl],
        account: address,
      })
      // Send transaction
      const tx = await walletClient.writeContract(request)
      // Wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash: tx })
      setMintSuccess(true)
      refetchBalance()
    } catch (err) {
      setMintError(err?.shortMessage || err?.message || "Mint failed.")
    } finally {
      setMinting(false)
    }
  }, [isConnected, canMint, walletClient, publicClient, address, refetchBalance])

  return {
    isConnected,
    isConnecting,
    ethBalance,
    canMint,
    mintMeme,
    minting,
    mintError,
    mintSuccess,
    connectWallet,
    disconnect,
  }
}
