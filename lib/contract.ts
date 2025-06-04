export const MEME_BATTLES_CONTRACT = {
  address: '0x00a9f9CE02535B6d0eF74A873fABdcBA9a44661b',
  abi: [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "battleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "castA",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "castB",
				"type": "string"
			}
		],
		"name": "BattleCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_castA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_castB",
				"type": "string"
			}
		],
		"name": "createBattle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_battleId",
				"type": "uint256"
			}
		],
		"name": "endBattle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_battleId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_choice",
				"type": "uint8"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "battleId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "choice",
				"type": "uint8"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "battleCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "battles",
		"outputs": [
			{
				"internalType": "string",
				"name": "castA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "castB",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "votesA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votesB",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_battleId",
				"type": "uint256"
			}
		],
		"name": "getBattle",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "castA",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "castB",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "votesA",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "votesB",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					}
				],
				"internalType": "struct MemeBattles.Battle",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "VOTING_PERIOD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
} as const;
