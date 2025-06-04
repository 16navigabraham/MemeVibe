// app/memebattle/page.js

"use client";

import { useEffect, useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { Navbar } from "@/components/navbar";
import { MEME_BATTLES_CONTRACT } from "@/lib/contract";
import { parseGwei } from "viem";

export default function MemeBattlePage() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState("");

  const fetchBattles = async () => {
    try {
      setLoading(true);
      
      // Get total battle count from contract
      const battleCount = await publicClient.readContract({
        address: MEME_BATTLES_CONTRACT.address,
        abi: MEME_BATTLES_CONTRACT.abi,
        functionName: "battleCount",
      });

      // Fetch all battles
      const battlePromises = [];
      for (let i = 1; i <= Number(battleCount); i++) {
        battlePromises.push(
          publicClient.readContract({
            address: MEME_BATTLES_CONTRACT.address,
            abi: MEME_BATTLES_CONTRACT.abi,
            functionName: "getBattle",
            args: [i],
          })
        );
      }

      const battleResults = await Promise.all(battlePromises);
      
      // Format battle data
      const formattedBattles = battleResults.map((battle, index) => ({
        id: index + 1,
        castA: battle.castA,
        castB: battle.castB,
        votesA: Number(battle.votesA),
        votesB: Number(battle.votesB),
        isActive: battle.isActive,
        createdAt: Number(battle.createdAt)
      }));

      // Sort battles by creation time (newest first)
      const sortedBattles = formattedBattles
        .filter(battle => battle.isActive)
        .sort((a, b) => b.createdAt - a.createdAt);

      setBattles(sortedBattles);
    } catch (error) {
      console.error("Error fetching battles:", error);
      setBattles([]);
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

  const handleVote = async (battleId, choice) => {
    try {
      if (!walletClient || !address) {
        throw new Error("Please connect your wallet");
      }

      setVoteStatus("Preparing transaction...");

      // Simulate transaction first
      const { request } = await publicClient.simulateContract({
        address: MEME_BATTLES_CONTRACT.address,
        abi: MEME_BATTLES_CONTRACT.abi,
        functionName: "vote",
        args: [battleId, choice],
        account: address,
      });

      // Execute with optimized gas parameters
      const tx = await walletClient.writeContract({
        ...request,
        gas: request.gas ? (request.gas * 120n) / 100n : undefined, // 20% buffer
        maxFeePerGas: parseGwei("0.001"), // Very low gas price for Base
        maxPriorityFeePerGas: parseGwei("0.0001"),
      });

      setVoteStatus("Voting... Please wait for confirmation");
      
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: tx,
        confirmations: 1
      });

      if (receipt.status === "success") {
        setVoteStatus("✅ Vote successful!");
        await fetchBattles(); // Refresh battles after voting
      }

    } catch (error) {
      console.error("Voting error:", error);
      if (error.message?.includes("insufficient funds")) {
        setVoteStatus(`❌ Insufficient BASE. Get BASE tokens from bridge.base.org`);
      } else if (error.message?.includes("user rejected")) {
        setVoteStatus("Transaction cancelled");
      } else {
        setVoteStatus(`❌ ${error.message || "Failed to vote"}`);
      }
    }
  };

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
            ) : battles.length === 0 ? (
              <div className="text-center py-12 bg-purple-800/30 rounded-lg border border-purple-500/20">
                <h3 className="text-xl font-medium text-purple-100 mb-2">No Active Battles</h3>
                <p className="text-purple-200">Check back soon for new meme battles!</p>
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
