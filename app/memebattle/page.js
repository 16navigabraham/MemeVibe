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
import { farcaster } from "@/lib/wagmi"

export default function MemeBattlePage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState("");
  const [connectStatus, setConnectStatus] = useState("");
  const [votedBattles, setVotedBattles] = useState({}); // battleId: true
  const [showHistory, setShowHistory] = useState(false);
  const [historySort, setHistorySort] = useState("recent"); // "recent" | "votes" | "closest"
  const [endedBattles, setEndedBattles] = useState([]);
  const [audio] = useState(() => (typeof window !== "undefined" ? new Audio("/celebrate.mp3") : null));

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

  // Fetch battles and check if user has voted
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
      const ended = [];
      const voted = {};
      for (let i = 1; i <= Number(battleCount); i++) {
        try {
          const battle = await publicClient.readContract({
            address: MEME_BATTLES_CONTRACT.address,
            abi: MEME_BATTLES_CONTRACT.abi,
            functionName: "getBattle",
            args: [i],
          });
          // Check if user has voted in this battle
          let hasVoted = false;
          if (address) {
            try {
              hasVoted = await publicClient.readContract({
                address: MEME_BATTLES_CONTRACT.address,
                abi: MEME_BATTLES_CONTRACT.abi,
                functionName: "hasVoted",
                args: [i, address],
              });
            } catch (e) {
              // fallback: ignore if method doesn't exist
            }
          }
          if (hasVoted) voted[i] = true;
          const battleObj = {
            id: i,
            castA: battle.castA,
            castB: battle.castB,
            votesA: Number(battle.votesA),
            votesB: Number(battle.votesB),
            isActive: battle.isActive,
            createdAt: Number(battle.createdAt)
          };
          if (battleObj.isActive) {
            battles.push(battleObj);
          } else {
            ended.push(battleObj);
          }
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
      setVotedBattles(voted);
      setEndedBattles(ended);
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

  // Add connect handler for Farcaster
  const handleConnect = async () => {
    try {
      await farcaster.connect()
      setConnectStatus("")
    } catch (err) {
      setConnectStatus("❌ Failed to connect Farcaster")
    }
  }

  // Update handleVote function - simplified for Farcaster
  const handleVote = async (battleId, choice) => {
    if (!isConnected) {
      setVoteStatus("❌ Connector not connected.")
      return
    }
    if (votedBattles[battleId]) {
      setVoteStatus("❌ You have already voted in this battle.")
      return
    }
    try {
      setVoteStatus("Preparing vote...")

      const data = encodeFunctionData({
        abi: MEME_BATTLES_CONTRACT.abi,
        functionName: "vote",
        args: [BigInt(battleId), BigInt(choice)]
      })

      sendTransaction({
        to: MEME_BATTLES_CONTRACT.address,
        data,
        value: BigInt(0)
      })

      // Optimistically update votedBattles state
      setVotedBattles(prev => ({ ...prev, [battleId]: true }))
    } catch (error) {
      setVoteStatus(`❌ ${error?.shortMessage || error?.message || "Vote failed"}`)
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
      // Show contract revert reason if available
      setVoteStatus(`❌ ${txError?.shortMessage || txError?.message || "Transaction failed"}`)
    }
  }, [isPending, isConfirming, isConfirmed, txError])

  // Surprise Me: Jump to a random active battle
  const handleSurpriseMe = async () => {
    if (battles.length === 0) return;
    const idx = Math.floor(Math.random() * battles.length);
    const el = document.getElementById(`battle-${battles[idx].id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const confetti = (await import("canvas-confetti")).default;
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
    }
  };

  // Share: Pre-fill Farcaster/Twitter message
  const handleShare = async (battle) => {
    const url = typeof window !== "undefined" ? window.location.origin + "#battle-" + battle.id : "";
    const text = `🔥 Meme Battle! Vote now:\nCast A: ${battle.castA}\nCast B: ${battle.castB}\n${url}`;
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(farcasterUrl, "_blank");
    const confetti = (await import("canvas-confetti")).default;
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
  };

  // Fun animation on vote or battle end
  useEffect(() => {
    if (voteStatus.startsWith("✅")) {
      (async () => {
        const confetti = (await import("canvas-confetti")).default;
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.7 } });
        if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
      })();
    }
  }, [voteStatus, audio]);

  // Sort ended battles for history
  const sortedEndedBattles = [...endedBattles].sort((a, b) => {
    if (historySort === "votes") {
      return (b.votesA + b.votesB) - (a.votesA + a.votesB);
    }
    if (historySort === "closest") {
      return Math.abs(a.votesA - a.votesB) - Math.abs(b.votesA - b.votesB);
    }
    // recent
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-wider mb-8">
            🔥 MEME BATTLES 🔥
          </h1>
          {/* Surprise Me Button */}
          <button
            onClick={handleSurpriseMe}
            className="mb-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow transition-all"
          >
            🎲 Surprise Me!
          </button>
          {/* Toggle History */}
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="mb-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg shadow transition-all"
          >
            {showHistory ? "🔙 Back to Battles" : "📜 View Battle History"}
          </button>
          {/* History Sort Options */}
          {showHistory && (
            <div className="mb-4 flex gap-2">
              <button
                className={`px-3 py-1 rounded ${historySort === "recent" ? "bg-purple-700 text-white" : "bg-gray-300 text-gray-700"}`}
                onClick={() => setHistorySort("recent")}
              >
                Recent
              </button>
              <button
                className={`px-3 py-1 rounded ${historySort === "votes" ? "bg-purple-700 text-white" : "bg-gray-300 text-gray-700"}`}
                onClick={() => setHistorySort("votes")}
              >
                Most Voted
              </button>
              <button
                className={`px-3 py-1 rounded ${historySort === "closest" ? "bg-purple-700 text-white" : "bg-gray-300 text-gray-700"}`}
                onClick={() => setHistorySort("closest")}
              >
                Closest
              </button>
            </div>
          )}
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
            ) : showHistory ? (
              <div className="max-w-2xl mx-auto space-y-6 mt-8 w-full">
                {sortedEndedBattles.length === 0 && (
                  <div className="text-center text-purple-200 py-8">No finished battles yet.</div>
                )}
                {sortedEndedBattles.map((battle) => {
                  // Calculate vote percentages
                  const totalVotes = battle.votesA + battle.votesB;
                  const percentA = totalVotes === 0 ? 50 : Math.round((battle.votesA / totalVotes) * 100);
                  const percentB = totalVotes === 0 ? 50 : 100 - percentA;
                  const castAWins = battle.votesA > battle.votesB;
                  const castBWins = battle.votesB > battle.votesA;
                  return (
                    <div
                      key={battle.id}
                      id={`battle-${battle.id}`}
                      className="bg-purple-900/60 rounded-xl shadow-lg p-6 border border-purple-500/30"
                    >
                      <div className="flex justify-between text-xs text-purple-300 mb-2">
                        <span>Battle #{battle.id}</span>
                        <span>{formatDistanceToNow(new Date(battle.createdAt * 1000))} ago</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <a href={battle.castA} target="_blank" className="text-purple-200 underline">Cast A</a>
                        </div>
                        <div>
                          <a href={battle.castB} target="_blank" className="text-purple-200 underline">Cast B</a>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-purple-100">
                        <span>Cast A: {battle.votesA}</span>
                        <span>Cast B: {battle.votesB}</span>
                      </div>
                      <div className="w-full h-5 bg-gray-700 rounded-full flex overflow-hidden mb-2">
                        <div
                          className={`h-full flex items-center justify-end transition-all duration-300 ${
                            castAWins
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${percentA}%` }}
                        >
                          {percentA > 10 && (
                            <span className="text-xs text-white px-2">{percentA}%</span>
                          )}
                        </div>
                        <div
                          className={`h-full flex items-center justify-start transition-all duration-300 ${
                            castBWins
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${percentB}%` }}
                        >
                          {percentB > 10 && (
                            <span className="text-xs text-white px-2">{percentB}%</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span>
                          Winner:{" "}
                          {battle.votesA === battle.votesB
                            ? "Tie"
                            : battle.votesA > battle.votesB
                            ? "Cast A"
                            : "Cast B"}
                        </span>
                        <button
                          onClick={() => handleShare(battle)}
                          className="text-green-300 hover:text-green-500 underline"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 mt-8 w-full">
                {!isConnected ? (
                  <button
                    type="button"
                    onClick={handleConnect}
                    className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors mb-4"
                  >
                    Connect Farcaster
                  </button>
                ) : null}
                {connectStatus && (
                  <div className="mb-4 text-red-500 text-sm">{connectStatus}</div>
                )}
                {battles.map((battle) => {
                  // Calculate vote percentages
                  const totalVotes = battle.votesA + battle.votesB;
                  const percentA = totalVotes === 0 ? 50 : Math.round((battle.votesA / totalVotes) * 100);
                  const percentB = totalVotes === 0 ? 50 : 100 - percentA;
                  const castAWins = battle.votesA > battle.votesB;
                  const castBWins = battle.votesB > battle.votesA;
                  return (
                    <div
                      key={battle.id}
                      id={`battle-${battle.id}`}
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
                            disabled={votedBattles[battle.id]}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                              votedBattles[battle.id]
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-purple-600 text-white hover:bg-purple-500"
                            }`}
                          >
                            Vote Cast A
                          </button>
                          <button
                            onClick={() => handleVote(battle.id, 2)}
                            disabled={votedBattles[battle.id]}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                              votedBattles[battle.id]
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-purple-600 text-white hover:bg-purple-500"
                            }`}
                          >
                            Vote Cast B
                          </button>
                        </div>
                      )}
                      {/* Vote Result Bar */}
                      <div className="mt-6">
                        <div className="flex justify-between text-xs font-semibold mb-1 text-purple-100">
                          <span>Cast A: {battle.votesA}</span>
                          <span>Cast B: {battle.votesB}</span>
                        </div>
                        <div className="w-full h-5 bg-gray-700 rounded-full flex overflow-hidden">
                          <div
                            className={`h-full flex items-center justify-end transition-all duration-300 ${
                              castAWins
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${percentA}%` }}
                          >
                            {percentA > 10 && (
                              <span className="text-xs text-white px-2">{percentA}%</span>
                            )}
                          </div>
                          <div
                            className={`h-full flex items-center justify-start transition-all duration-300 ${
                              castBWins
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${percentB}%` }}
                          >
                            {percentB > 10 && (
                              <span className="text-xs text-white px-2">{percentB}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => handleShare(battle)}
                          className="text-green-300 hover:text-green-500 underline text-xs"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Confetti canvas is handled by canvas-confetti */}
      {/* Sound file /celebrate.mp3 should be placed in public/ */}
    </div>
  );
}
