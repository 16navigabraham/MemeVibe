// app/memebattle/page.js

"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  useAccount, 
  useSendTransaction, 
  useWaitForTransactionReceipt,
  usePublicClient 
} from "wagmi";
import { Navbar } from "@/components/navbar";
import { MEME_BATTLES_CONTRACT } from "@/lib/contract";
import { parseGwei, encodeFunctionData } from "viem";

export default function MemeBattlePage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState("");

  const { 
    data: hash,
    error: txError,
    isPending,
    sendTransaction 
  } = useSendTransaction();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  const fetchBattles = async () => {
    try {
      setLoading(true);
      
      // Add error handling for contract read
      if (!publicClient) {
        console.error("Public client not initialized");
        return;
      }

      // Wrap contract reads in try-catch
      let battleCount;
      try {
        battleCount = await publicClient.readContract({
          address: MEME_BATTLES_CONTRACT.address,
          abi: MEME_BATTLES_CONTRACT.abi,
          functionName: "battleCount",
        });
      } catch (error) {
        console.error("Error reading battle count:", error);
        setLoading(false);
        return;
      }

      // Fetch battles with error handling
      const battles = [];
      for (let i = 1; i <= Number(battleCount); i++) {
        try {
          const battle = await publicClient.readContract({
            address: MEME_BATTLES_CONTRACT.address,
            abi: MEME_BATTLES_CONTRACT.abi,
            functionName: "getBattle",
            args: [i],
          });
          
          battles.push({
            id: i,
            castA: battle.castA,
            castB: battle.castB,
            votesA: Number(battle.votesA),
            votesB: Number(battle.votesB),
            isActive: battle.isActive,
            createdAt: Number(battle.createdAt)
          });
        } catch (error) {
          console.error(`Error fetching battle ${i}:`, error);
          continue;
        }
      }

      // Sort battles safely
      const sortedBattles = battles
        .filter(battle => battle && battle.isActive)
        .sort((a, b) => b.createdAt - a.createdAt);

      setBattles(sortedBattles);
    } catch (error) {
      console.error("Error in fetchBattles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBattleResults = async (battleId) => {
    const battle = await publicClient.readContract({
      address: MEME_BATTLES_CONTRACT.address,
      abi: MEME_BATTLES_CONTRACT.abi,
      functionName: "getBattle",
      args: [battleId],
    });

    return {
      votesForA: Number(battle.votesA),
      votesForB: Number(battle.votesB),
      isActive: battle.isActive,
      winner: Number(battle.votesA) > Number(battle.votesB) ? 'A' : 
             Number(battle.votesB) > Number(battle.votesA) ? 'B' : 'Tie'
    };
  };

  // Fetch battles on mount and when wallet changes
  useEffect(() => {
    fetchBattles();
  }, [publicClient]);

  // Update handleVote function - simplified for Farcaster
  const handleVote = async (battleId, choice) => {
    try {
      setVoteStatus("Preparing vote...")

      const data = encodeFunctionData({
        abi: MEME_BATTLES_CONTRACT.abi,
        functionName: "vote",
        args: [BigInt(battleId), BigInt(choice)]
      })

      // Simplified transaction call for Farcaster
      sendTransaction({
        to: MEME_BATTLES_CONTRACT.address,
        data,
        value: BigInt(0)
      })

    } catch (error) {
      console.error("Vote error:", error)
      setVoteStatus(`❌ ${error?.message || "Vote failed"}`)
    }
  }

  // Simplified transaction monitoring
  useEffect(() => {
    if (isPending) {
      setVoteStatus("Confirming in Warpcast...")
    }
    if (isConfirming) {
      setVoteStatus("Transaction confirming...")
    }
    if (isConfirmed) {
      setVoteStatus("✅ Vote confirmed!")
      fetchBattles()
      setTimeout(() => setVoteStatus(""), 3000)
    }
    if (txError) {
      setVoteStatus(`❌ ${txError?.message || "Transaction failed"}`)
    }
  }, [isPending, isConfirming, isConfirmed, txError])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-wider mb-8">
            🔥 MEME BATTLES 🔥
          </h1>

          {/* Submit Button */}
          <a
            href="https://forms.gle/pHtC1AX8y88vYbBc9"
            target="_blank"
            rel="noopener"
            className="group relative inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-lg overflow-hidden transition-all duration-300 ease-out hover:bg-purple-500 hover:scale-105 transform mb-8"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="mr-2 text-xl">📥</span>
            <span className="font-medium">Submit Your Cast</span>
            <span className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">→</span>
          </a>

          {/* Battle Display */}
          <div className="w-full max-w-2xl">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-white">Loading meme battles...</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 mt-8 w-full">
                {battles.map((battle) => (
                  <div
                    key={battle.id}
                    className="bg-purple-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all"
                  >
                    <div className="text-sm text-purple-200 mb-4">
                      Started {formatDistanceToNow(new Date(battle.createdAt * 1000))} ago
                    </div>
                    
                    {/* Battle Content */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-purple-200 font-semibold">Cast A</p>
                        <a
                          href={battle.castA}
                          target="_blank"
                          className="inline-flex items-center text-purple-300 hover:text-purple-100 transition-colors"
                        >
                          <span>View Cast</span>
                          <span className="ml-1">→</span>
                        </a>
                      </div>
                      <div className="space-y-2">
                        <p className="text-purple-200 font-semibold">Cast B</p>
                        <a
                          href={battle.castB}
                          target="_blank"
                          className="inline-flex items-center text-purple-300 hover:text-purple-100 transition-colors"
                        >
                          <span>View Cast</span>
                          <span className="ml-1">→</span>
                        </a>
                      </div>
                    </div>

                    {/* Vote Section */}
                    {Date.now() / 1000 > battle.createdAt + 7 * 24 * 3600 ? (
                      <div className="text-center bg-purple-700/50 rounded-lg p-3">
                        <p className="text-purple-100 font-bold">
                          Battle Ended • A: {battle.votesA} | B: {battle.votesB}
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleVote(battle.id, 1)}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-colors"
                        >
                          Vote Cast A
                        </button>
                        <button
                          onClick={() => handleVote(battle.id, 2)}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-colors"
                        >
                          Vote Cast B
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
