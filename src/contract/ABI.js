//0xf0873E7C54212f0c94755A103aDb2139a6786314
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
				"name": "ethAdmin",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "admAdd",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "ethAdmin",
				"type": "address"
			}
		],
		"name": "admRemove",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "idStudent",
				"type": "string"
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "idStudent",
				"type": "string"
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
				"internalType": "string",
				"name": "idStudent",
				"type": "string"
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
				"name": "_ethAdmin",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addAdmin",
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
		"inputs": [
			{
				"internalType": "string",
				"name": "_idStudent",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nameStudent",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_urlCertificate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_birthday",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_major",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_gradutionYear",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_hashNFT",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nameUniversity",
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
				"name": "_ethAdmin",
				"type": "address"
			}
		],
		"name": "removeAdmin",
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
				"internalType": "string",
				"name": "_idStudent",
				"type": "string"
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
		"inputs": [
			{
				"internalType": "string",
				"name": "_idStudent",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nameStudent",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_urlCertificate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_birthday",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_major",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_gradutionYear",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_hashNFT",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nameUniversity",
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
		"name": "validAdminNew",
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
				"internalType": "string",
				"name": "_idStudent",
				"type": "string"
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
	}
]