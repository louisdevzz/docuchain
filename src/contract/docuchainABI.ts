//0x31bfde6Ff35DCBe3f71477fAb4a639F4d4F961ef
export const docuchain = [
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
		  "internalType": "uint256",
		  "name": "idDocs",
		  "type": "uint256"
		},
		{
		  "indexed": false,
		  "internalType": "bool",
		  "name": "kycStatus",
		  "type": "bool"
		}
	  ],
	  "name": "documentAdded",
	  "type": "event"
	},
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "idDocs",
		  "type": "uint256"
		},
		{
		  "indexed": false,
		  "internalType": "address",
		  "name": "ethAddress",
		  "type": "address"
		}
	  ],
	  "name": "documentRemoved",
	  "type": "event"
	},
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": false,
		  "internalType": "uint256",
		  "name": "idDocs",
		  "type": "uint256"
		},
		{
		  "indexed": false,
		  "internalType": "bool",
		  "name": "kycStatus",
		  "type": "bool"
		}
	  ],
	  "name": "documentUpdated",
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
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "_ethAddress",
		  "type": "address"
		},
		{
		  "internalType": "string",
		  "name": "_nameDocs",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_cidDocs",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_contentHash",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_creatorName",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_agency",
		  "type": "string"
		},
		{
		  "internalType": "uint256",
		  "name": "_timeCreate",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "_timeUpdate",
		  "type": "uint256"
		}
	  ],
	  "name": "addDocument",
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
		  "internalType": "address",
		  "name": "_ethAdmin",
		  "type": "address"
		}
	  ],
	  "name": "checkAdmin",
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
	  "name": "getAllDocumentHashes",
	  "outputs": [
		{
		  "internalType": "string[]",
		  "name": "",
		  "type": "string[]"
		}
	  ],
	  "stateMutability": "view",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "_contentHash",
		  "type": "string"
		}
	  ],
	  "name": "getDocumentByHash",
	  "outputs": [
		{
		  "components": [
			{
			  "internalType": "uint256",
			  "name": "idDocs",
			  "type": "uint256"
			},
			{
			  "internalType": "string",
			  "name": "nameDocs",
			  "type": "string"
			},
			{
			  "internalType": "string",
			  "name": "cidDocs",
			  "type": "string"
			},
			{
			  "internalType": "string",
			  "name": "contentHash",
			  "type": "string"
			},
			{
			  "internalType": "string",
			  "name": "creatorName",
			  "type": "string"
			},
			{
			  "internalType": "string",
			  "name": "agency",
			  "type": "string"
			},
			{
			  "internalType": "uint256",
			  "name": "timeCreate",
			  "type": "uint256"
			},
			{
			  "internalType": "uint256",
			  "name": "timeUpdate",
			  "type": "uint256"
			},
			{
			  "internalType": "bool",
			  "name": "status",
			  "type": "bool"
			}
		  ],
		  "internalType": "struct DocuchainVerify.Document",
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
		  "name": "_idDocs",
		  "type": "uint256"
		}
	  ],
	  "name": "getDocumentById",
	  "outputs": [
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
		  "internalType": "uint256",
		  "name": "",
		  "type": "uint256"
		},
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
		  "internalType": "uint256",
		  "name": "_idDocs",
		  "type": "uint256"
		},
		{
		  "internalType": "address",
		  "name": "_ethAddress",
		  "type": "address"
		}
	  ],
	  "name": "removeDocument",
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
		  "name": "_ethAddress",
		  "type": "address"
		},
		{
		  "internalType": "string",
		  "name": "_nameDocs",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_cidDocs",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_contentHash",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_creatorName",
		  "type": "string"
		},
		{
		  "internalType": "string",
		  "name": "_agency",
		  "type": "string"
		},
		{
		  "internalType": "uint256",
		  "name": "_timeCreate",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "_timeUpdate",
		  "type": "uint256"
		},
		{
		  "internalType": "bool",
		  "name": "_status",
		  "type": "bool"
		}
	  ],
	  "name": "updateDocument",
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
	}
] as const