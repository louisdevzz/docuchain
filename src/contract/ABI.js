//0x9d69b7d8A1B9A1Be84c59ef2866820De334E76FD
export const ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "stdAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "ethAddress",
				"type": "address"
			}
		],
		"name": "kycRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_stdAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_nameStudent",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_urlPhoto",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_year",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_hashNFT",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "registerKYC",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_stdAddress",
				"type": "address"
			}
		],
		"name": "removeKYC",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "stdAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "kycStatus",
				"type": "bool"
			}
		],
		"name": "studentAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "stdAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "kycStatus",
				"type": "bool"
			}
		],
		"name": "studentUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_stdAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_nameStudent",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_urlPhoto",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_year",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_hashNFT",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "updateKYC",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
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
		"name": "validAdmin",
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
		"name": "validStd",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_stdAddress",
				"type": "address"
			}
		],
		"name": "viewKYC",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewYourKYC",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "studentAdress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "nameStudent",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "urlPhoto",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "year",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "hashNFT",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "status",
						"type": "bool"
					}
				],
				"internalType": "struct Kyc.Student",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]