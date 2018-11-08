const Web3 = require('web3');

var web3 = new Web3('http://18.179.206.91:8545');  //rinkeby
//const web3 = new Web3('ws://54.249.21.74:8546'); //mainnet
//const web3 = new Web3('http://54.249.21.74:8545'); //mainnet

const Tx = require('ethereumjs-tx')

const paymentABI = [ { "constant": true, "inputs": [], "name": "settle_window_min", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "channelCounter", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "channels", "outputs": [ { "name": "state", "type": "uint8" }, { "name": "settleBlock", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "participantsHash_to_channelCounter", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "settle_window_max", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "game", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "address" } ], "name": "lockIdentifier_to_lockedAmount", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_game", "type": "address" }, { "name": "_settle_window_min", "type": "uint256" }, { "name": "_settle_window_max", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "participant1", "type": "address" }, { "indexed": true, "name": "participant2", "type": "address" }, { "indexed": true, "name": "channelIdentifier", "type": "bytes32" }, { "indexed": false, "name": "settle_timeout", "type": "uint256" } ], "name": "ChannelOpened", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channel_identifier", "type": "bytes32" }, { "indexed": true, "name": "participant", "type": "address" }, { "indexed": false, "name": "total_deposit", "type": "uint256" } ], "name": "ChannelNewDeposit", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelIdentifier", "type": "bytes32" }, { "indexed": false, "name": "participant1_balance", "type": "uint256" }, { "indexed": false, "name": "participant2_balance", "type": "uint256" } ], "name": "CooperativeSettled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channel_identifier", "type": "bytes32" }, { "indexed": true, "name": "closing", "type": "address" }, { "indexed": false, "name": "balanceHash", "type": "bytes32" } ], "name": "ChannelClosed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channel_identifier", "type": "bytes32" }, { "indexed": true, "name": "nonclosing", "type": "address" }, { "indexed": false, "name": "balanceHash", "type": "bytes32" } ], "name": "NonclosingUpdateBalanceProof", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelIdentifier", "type": "bytes32" }, { "indexed": true, "name": "lockedIdentifier", "type": "bytes32" }, { "indexed": false, "name": "participant", "type": "address" }, { "indexed": false, "name": "transferToParticipantAmount", "type": "uint256" } ], "name": "ChannelSettled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelIdentifier", "type": "bytes32" }, { "indexed": true, "name": "beneficiary", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "ChannelLockedSent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "channelIdentifier", "type": "bytes32" }, { "indexed": true, "name": "beneficiary", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "ChannelLockedReturn", "type": "event" }, { "constant": false, "inputs": [ { "name": "participant1", "type": "address" }, { "name": "participant2", "type": "address" }, { "name": "settle_window", "type": "uint256" } ], "name": "openChannel", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "participant", "type": "address" }, { "name": "partner", "type": "address" } ], "name": "setTotalDeposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "participant1_address", "type": "address" }, { "name": "participant1_balance", "type": "uint256" }, { "name": "participant2_address", "type": "address" }, { "name": "participant2_balance", "type": "uint256" }, { "name": "participant1_signature", "type": "bytes" }, { "name": "participant2_signature", "type": "bytes" } ], "name": "cooperativeSettle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "partner", "type": "address" }, { "name": "balanceHash", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, { "name": "signature", "type": "bytes" } ], "name": "closeChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "closing", "type": "address" }, { "name": "balanceHash", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, { "name": "signature", "type": "bytes" } ], "name": "nonclosingUpdateBalanceProof", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "participant1", "type": "address" }, { "name": "participant1_transferred_amount", "type": "uint256" }, { "name": "participant1_locked_amount", "type": "uint256" }, { "name": "participant1_lock_id", "type": "uint256" }, { "name": "participant2", "type": "address" }, { "name": "participant2_transferred_amount", "type": "uint256" }, { "name": "participant2_locked_amount", "type": "uint256" }, { "name": "participant2_lock_id", "type": "uint256" } ], "name": "settleChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "participant1", "type": "address" }, { "name": "participant2", "type": "address" }, { "name": "lockIdentifier", "type": "bytes32" } ], "name": "unlock", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];

const diceABI = [ { "constant": true, "inputs": [], "name": "revealWindow", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "roundIdentifier_to_diceInfo", "outputs": [ { "name": "positive", "type": "address" }, { "name": "negative", "type": "address" }, { "name": "betMask", "type": "uint256" }, { "name": "modulo", "type": "uint256" }, { "name": "initiatorHashR", "type": "bytes32" }, { "name": "acceptorR", "type": "bytes32" }, { "name": "state", "type": "uint8" }, { "name": "lastRevealBlock", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_revealWindow", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "initiator", "type": "address" }, { "indexed": true, "name": "acceptor", "type": "address" }, { "indexed": false, "name": "roundIdentifier", "type": "bytes32" }, { "indexed": false, "name": "winner", "type": "address" } ], "name": "InitiatorSettled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "initiator", "type": "address" }, { "indexed": true, "name": "acceptor", "type": "address" }, { "indexed": false, "name": "roundIdentifier", "type": "bytes32" }, { "indexed": false, "name": "lastRevealBlock", "type": "uint256" } ], "name": "AcceptorSettled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "initiator", "type": "address" }, { "indexed": true, "name": "acceptor", "type": "address" }, { "indexed": false, "name": "roundIdentifier", "type": "bytes32" }, { "indexed": false, "name": "winner", "type": "address" } ], "name": "InitiatorRevealed", "type": "event" }, { "constant": false, "inputs": [ { "name": "channelIdentifier", "type": "bytes32" }, { "name": "round", "type": "uint256" }, { "name": "betMask", "type": "uint256" }, { "name": "modulo", "type": "uint256" }, { "name": "positive", "type": "address" }, { "name": "negative", "type": "address" }, { "name": "initiatorHashR", "type": "bytes32" }, { "name": "initiatorSignature", "type": "bytes" }, { "name": "acceptorR", "type": "bytes32" }, { "name": "acceptorSignature", "type": "bytes" }, { "name": "initiatorR", "type": "bytes32" } ], "name": "initiatorSettle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelIdentifier", "type": "bytes32" }, { "name": "round", "type": "uint256" }, { "name": "betMask", "type": "uint256" }, { "name": "modulo", "type": "uint256" }, { "name": "positive", "type": "address" }, { "name": "negative", "type": "address" }, { "name": "initiatorHashR", "type": "bytes32" }, { "name": "initiatorSignature", "type": "bytes" }, { "name": "acceptorR", "type": "bytes32" } ], "name": "acceptorSettle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelIdentifier", "type": "bytes32" }, { "name": "round", "type": "uint256" }, { "name": "initiatorR", "type": "bytes32" } ], "name": "initiatorReveal", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "roundIdentifier", "type": "bytes32" } ], "name": "getResult", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

const paymentData = "0x608060405234801561001057600080fd5b506040516060806121ea83398101604090815281516020830151919092015160008054600160a060020a03909416600160a060020a031990941693909317909255600555600655612184806100666000396000f3006080604052600436106100cf5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630a798f2481146100d45780630ab943e114610110578063184446941461014e5780635a1047461461016357806377c5f23c146101785780637a7ebd7b146101a257806384a769b2146101d75780638568536a146102435780638a6e8018146102fa5780639e45b47814610312578063b4778bea14610327578063c3fe3e2814610341578063c6bf4ec514610372578063ddfb48cb14610396575b600080fd5b3480156100e057600080fd5b506100fe600160a060020a0360043581169060243516604435610402565b60408051918252519081900360200190f35b34801561011c57600080fd5b5061014c600160a060020a036004358116906024359060443590606435906084351660a43560c43560e435610578565b005b34801561015a57600080fd5b506100fe6108ca565b34801561016f57600080fd5b506100fe6108d0565b34801561018457600080fd5b5061014c600160a060020a03600435811690602435166044356108d6565b3480156101ae57600080fd5b506101ba600435610c87565b6040805160ff909316835260208301919091528051918290030190f35b3480156101e357600080fd5b50604080516020601f60643560048181013592830184900484028501840190955281845261014c94600160a060020a038135169460248035956044359536956084949301918190840183828082843750949750610ca69650505050505050565b34801561024f57600080fd5b50604080516020601f60843560048181013592830184900484028501840190955281845261014c94600160a060020a0381358116956024803596604435909316956064359536959460a49493919091019190819084018382808284375050604080516020601f89358b018035918201839004830284018301909452808352979a999881019791965091820194509250829150840183828082843750949750610ea09650505050505050565b34801561030657600080fd5b506100fe600435611327565b34801561031e57600080fd5b506100fe611339565b61014c600160a060020a036004358116906024351661133f565b34801561034d57600080fd5b50610356611438565b60408051600160a060020a039092168252519081900360200190f35b34801561037e57600080fd5b506100fe600435600160a060020a0360243516611447565b3480156103a257600080fd5b50604080516020601f60643560048181013592830184900484028501840190955281845261014c94600160a060020a0381351694602480359560443595369560849493019181908401838280828437509497506114649650505050505050565b600080600083600654811115801561041c57506005548110155b1515610472576040805160e560020a62461bcd02815260206004820152601560248201527f696e76616c696420736574746c652077696e646f770000000000000000000000604482015290519081900360640190fd5b61047c878761176b565b600081815260026020526040902054909350156104e3576040805160e560020a62461bcd02815260206004820152601660248201527f6368616e6e656c20616c72656164792065786973747300000000000000000000604482015290519081900360640190fd5b600180548101908190556000848152600260205260409020556105068787611986565b600081815260036020908152604091829020805460ff19166001178155600201889055815188815291519294508492600160a060020a03808b1693908c16927f1dbb8128ba7369dfbdcb440570a5ac538daeaeadd800bae81f1721258e1658a492918290030190a45050509392505050565b600080600080600061058a8d8a611986565b60008181526003602052604090208054919650945060ff166002146105f9576040805160e560020a62461bcd02815260206004820152601d60248201527f6368616e6e656c2073746174652073686f6c6420626520636c6f736564000000604482015290519081900360640190fd5b60028401544311610654576040805160e560020a62461bcd02815260206004820181905260248201527f736574746c656d656e742077696e646f772073686f756c64206265206f766572604482015290519081900360640190fd5b600160a060020a03808e166000908152600186016020526040808220928c16825290209093509150610688838d8d8d611ac1565b61069482898989611ac1565b6106a3858e8d8d8d8c8c611be4565b90508360010160008e600160a060020a0316600160a060020a031681526020019081526020016000206000808201600090556001820160006101000a81549060ff02191690556002820160009055600382016000905550508360010160008a600160a060020a0316600160a060020a031681526020019081526020016000206000808201600090556001820160006101000a81549060ff0219169055600282016000905560038201600090555050600360008660001916600019168152602001908152602001600020600080820160006101000a81549060ff021916905560028201600090555050600260006107998f8c61176b565b815260208101919091526040016000908120556107b8838d848b611dc5565b604051919d509850600160a060020a038e16908d156108fc02908e906000818181858888f193505050501580156107f3573d6000803e3d6000fd5b50604051600160a060020a038a169089156108fc02908a906000818181858888f1935050505015801561082a573d6000803e3d6000fd5b5060408051600160a060020a038f168152602081018e90528151839288927f51506def4da4e4946729d5e4857c7898b5037649a12445dcca8e885afb12e469929081900390910190a360408051600160a060020a038b168152602081018a90528151839288927f51506def4da4e4946729d5e4857c7898b5037649a12445dcca8e885afb12e469929081900390910190a350505050505050505050505050565b60055481565b60015481565b6000818152600460208181526040808420600160a060020a03888116865290835281852054878216865282862054865484517fadd4c7840000000000000000000000000000000000000000000000000000000081529687018990529351919690959094939092169263add4c784926024808201939182900301818787803b15801561096057600080fd5b505af1158015610974573d6000803e3d6000fd5b505050506040513d602081101561098a57600080fd5b50519050600160a060020a0381161515610a81576000831115610a0d57604051600160a060020a0387169084156108fc029085906000818181858888f193505050501580156109dd573d6000803e3d6000fd5b50604080518481529051600160a060020a0388169186916000805160206121398339815191529181900360200190a35b6000821115610a7c57604051600160a060020a0386169083156108fc029084906000818181858888f19350505050158015610a4c573d6000803e3d6000fd5b50604080518381529051600160a060020a0387169186916000805160206121398339815191529181900360200190a35b610c7f565b85600160a060020a031681600160a060020a03161415610b8f576000821115610b1c57604051600160a060020a0387169083156108fc029084906000818181858888f19350505050158015610ada573d6000803e3d6000fd5b50604080518381529051600160a060020a0388169186917f088f29dc1537a391127b5577fa9923ab8a3738bf3f4160d5c0ca098acec24a3e9181900360200190a35b6000831115610a7c57604051600160a060020a0387169084156108fc029085906000818181858888f19350505050158015610b5b573d6000803e3d6000fd5b50604080518481529051600160a060020a0388169186916000805160206121398339815191529181900360200190a3610c7f565b6000831115610c1057604051600160a060020a0386169084156108fc029085906000818181858888f19350505050158015610bce573d6000803e3d6000fd5b50604080518481529051600160a060020a0387169186917f088f29dc1537a391127b5577fa9923ab8a3738bf3f4160d5c0ca098acec24a3e9181900360200190a35b6000821115610c7f57604051600160a060020a0386169083156108fc029084906000818181858888f19350505050158015610c4f573d6000803e3d6000fd5b50604080518381529051600160a060020a0387169186916000805160206121398339815191529181900360200190a35b505050505050565b6003602052600090815260409020805460029091015460ff9091169082565b60008060008033886000610cba8383611986565b60008181526003602052604090205490915060ff16600114610d26576040805160e560020a62461bcd02815260206004820152601660248201527f6368616e6e656c2073686f756c64206265206f70656e00000000000000000000604482015290519081900360640190fd5b610d30338c611986565b965060036000886000191660001916815260200190815260200160002095508560010160008c600160a060020a0316600160a060020a0316815260200190815260200160002094506000891115610e2357610d8d878b8b8b611e35565b9350600160a060020a03808516908c1614610e18576040805160e560020a62461bcd02815260206004820152602960248201527f62616c616e63652070726f6f662073686f756c64206265207369676e6564206260448201527f7920706172746e65720000000000000000000000000000000000000000000000606482015290519081900360840190fd5b610e23858b8b611ef0565b8554600260ff19918216811788553360008181526001808b0160209081526040928390208201805490961690911790945591890180544301905581518d8152915190928a927fc385db978aebc30a2ab47905160e860a190999aab78e9c8d040ca5911f83eede929081900390910190a35050505050505050505050565b60008060008089886000610eb48383611986565b60008181526003602052604090205490915060ff16600114610f20576040805160e560020a62461bcd02815260206004820152601660248201527f6368616e6e656c2073686f756c64206265206f70656e00000000000000000000604482015290519081900360640190fd5b610f2a8d8c611986565b9650610f3a878e8e8e8e8e611f5b565b9550600160a060020a03808716908e1614610fc5576040805160e560020a62461bcd02815260206004820152602a60248201527f7369676e61747572652073686f756c64206265207369676e656420627920706160448201527f727469636970616e743100000000000000000000000000000000000000000000606482015290519081900360840190fd5b610fd3878e8e8e8e8d611f5b565b9550600160a060020a03808716908c161461105e576040805160e560020a62461bcd02815260206004820152602a60248201527f7369676e61747572652073686f756c64206265207369676e656420627920706160448201527f727469636970616e743200000000000000000000000000000000000000000000606482015290519081900360840190fd5b60036000886000191660001916815260200190815260200160002094508460010160008c600160a060020a0316600160a060020a03168152602001908152602001600020600001548560010160008f600160a060020a0316600160a060020a0316815260200190815260200160002060000154019350898c0184141515611155576040805160e560020a62461bcd02815260206004820152603860248201527f7468652073756d206f662062616c616e6365732073686f756c6420626520657160448201527f75616c20746f2074686520746f74616c206465706f7369740000000000000000606482015290519081900360840190fd5b8460010160008e600160a060020a0316600160a060020a031681526020019081526020016000206000808201600090556001820160006101000a81549060ff02191690556002820160009055600382016000905550508460010160008c600160a060020a0316600160a060020a031681526020019081526020016000206000808201600090556001820160006101000a81549060ff0219169055600282016000905560038201600090555050600360008860001916600019168152602001908152602001600020600080820160006101000a81549060ff021916905560028201600090555050600260006112498f8e61176b565b8152602081019190915260400160009081208190558c111561129d57604051600160a060020a038e16908d156108fc02908e906000818181858888f1935050505015801561129b573d6000803e3d6000fd5b505b60008a11156112de57604051600160a060020a038c16908b156108fc02908c906000818181858888f193505050501580156112dc573d6000803e3d6000fd5b505b604080518d8152602081018c9052815189927f4c4399a084cb97d6d0f51a5481485cccd0eb35cf21aec6cf5140408b1b3d1bd8928290030190a250505050505050505050505050565b60026020526000908152604090205481565b60065481565b600080838360006113508383611986565b60008181526003602052604090205490915060ff166001146113bc576040805160e560020a62461bcd02815260206004820152601660248201527f6368616e6e656c2073686f756c64206265206f70656e00000000000000000000604482015290519081900360640190fd5b6113c68787611986565b6000818152600360209081526040808320600160a060020a038c16808552600190910183529281902080543401808255825190815291519499509750919288927f0346e981e2bfa2366dc2307a8f1fa24779830a01121b1275fe565c6b98bb4d3492908290030190a350505050505050565b600054600160a060020a031681565b600460209081526000928352604080842090915290825290205481565b600080600080873360006114788383611986565b60008181526003602052604090205490915060ff166002146114e4576040805160e560020a62461bcd02815260206004820152601860248201527f6368616e6e656c2073686f756c6420626520636c6f7365640000000000000000604482015290519081900360640190fd5b89158015906114f35750600089115b1515611549576040805160e560020a62461bcd02815260206004820152601560248201527f696e76616c69642062616c616e63652070726f6f660000000000000000000000604482015290519081900360640190fd5b611553338c611986565b965060036000886000191660001916815260200190815260200160002095508560010160008c600160a060020a0316600160a060020a0316815260200190815260200160002094508460010160009054906101000a900460ff161515611603576040805160e560020a62461bcd02815260206004820152601860248201527f706172746e65722073686f756c6420626520636c6f7365720000000000000000604482015290519081900360640190fd5b6002860154431115611685576040805160e560020a62461bcd02815260206004820152602660248201527f6368616e6e656c2073686f756c6420626520696e20736574746c656d656e742060448201527f77696e646f770000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b611691878b8b8b611e35565b9350600160a060020a03808516908c161461171c576040805160e560020a62461bcd02815260206004820152602560248201527f7369676e61747572652073686f756c64206265207369676e656420627920636c60448201527f6f73696e67000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b611727858b8b611ef0565b604080518b81529051339189917f9402d324e62839355b4df4992553dcdef3d9451e87e9591f51a776388c04e4ca9181900360200190a35050505050505050505050565b6000600160a060020a0383161580159061178d5750600160a060020a03821615155b80156117ab575081600160a060020a031683600160a060020a031614155b1515611801576040805160e560020a62461bcd02815260206004820152600d60248201527f696e76616c696420696e70757400000000000000000000000000000000000000604482015290519081900360640190fd5b81600160a060020a031683600160a060020a031610156118e85782826040516020018083600160a060020a0316600160a060020a03166c0100000000000000000000000002815260140182600160a060020a0316600160a060020a03166c01000000000000000000000000028152601401925050506040516020818303038152906040526040518082805190602001908083835b602083106118b45780518252601f199092019160209182019101611895565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050611980565b81836040516020018083600160a060020a0316600160a060020a03166c0100000000000000000000000002815260140182600160a060020a0316600160a060020a03166c0100000000000000000000000002815260140192505050604051602081830303815290604052604051808280519060200190808383602083106118b45780518252601f199092019160209182019101611895565b92915050565b60008080600160a060020a038516158015906119aa5750600160a060020a03841615155b80156119c8575083600160a060020a031685600160a060020a031614155b1515611a1e576040805160e560020a62461bcd02815260206004820152600d60248201527f696e76616c696420696e70757400000000000000000000000000000000000000604482015290519081900360640190fd5b611a28858561176b565b60008181526002602090815260409182902054825180830185905280840182905283518082038501815260609091019384905280519496509094509282918401908083835b60208310611a8c5780518252601f199092019160209182019101611a6d565b5181516020939093036101000a6000190180199091169216919091179052604051920182900390912098975050505050505050565b6002840154600090158015611ad4575083155b8015611ade575082155b8015611ae8575081155b15611af257611bdd565b8383836040516020018084815260200183815260200182815260200193505050506040516020818303038152906040526040518082805190602001908083835b60208310611b515780518252601f199092019160209182019101611b32565b5181516020939093036101000a60001901801990911692169190911790526040519201829003909120600289015490945084149250611bdd915050576040805160e560020a62461bcd02815260206004820152601e60248201527f62616c616e636520686173682073686f756c6420626520636f72726563740000604482015290519081900360640190fd5b5050505050565b600081851415611c73576040805160208082018b9052818301889052825180830384018152606090920192839052815191929182918401908083835b60208310611c3f5780518252601f199092019160209182019101611c20565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050611d89565b81851015611d04576040805160208082018b9052818301859052825180830384018152606090920192839052815191929182918401908083835b60208310611ccc5780518252601f199092019160209182019101611cad565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020905060009550611d89565b6040805160208082018b9052818301889052825180830384018152606090920192839052815191929182918401908083835b60208310611d555780518252601f199092019160209182019101611d36565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050600092505b6000818152600460209081526040808320600160a060020a039a8b16845290915280822097909755939096168352509290209190915550919050565b600080600080611dd58786612035565b909250905086811415611e085785548210611df1578554611df3565b815b88548754908201955081900393509150611e2a565b87548210611e17578754611e19565b815b885487549082900395508101935091505b505094509492505050565b604080516c01000000000000000000000000300260208083019190915260348201879052605482018690526074808301869052835180840390910181526094909201928390528151600093849392909182918401908083835b60208310611ead5780518252601f199092019160209182019101611e8e565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050611ee68184612058565b9695505050505050565b60038301548111611f4b576040805160e560020a62461bcd02815260206004820152601960248201527f6e6f6e63652073686f756c64206265206d6f6e6f746f6e696300000000000000604482015290519081900360640190fd5b6002830191909155600390910155565b604080516c01000000000000000000000000308102602080840191909152603483018a9052600160a060020a03808a16830260548501526068840189905287169091026088830152609c8083018690528351808403909101815260bc909201928390528151600093849392909182918401908083835b60208310611ff05780518252601f199092019160209182019101611fd1565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902090506120298184612058565b98975050505050505050565b600080828411612048578383038461204d565b828403835b915091509250929050565b6000806000808451604114151561206e57600080fd5b50505060208201516040830151606084015160001a601b60ff8216101561209357601b015b8060ff16601b14806120a857508060ff16601c145b15156120b357600080fd5b60408051600080825260208083018085528a905260ff8516838501526060830187905260808301869052925160019360a0808501949193601f19840193928390039091019190865af115801561210d573d6000803e3d6000fd5b5050604051601f190151945050600160a060020a038416151561212f57600080fd5b50505092915050560006fcb8f03d7121545713132681b1bf54af1ff9fcab01f34b23a6745f5ddbbce5a165627a7a72305820cb97039043795177ce08477a81d6a4df12bd01931014d2b1853a410d80e886590029";

const diceData = "0x608060405234801561001057600080fd5b506040516020806110c0833981016040525160015561108c806100346000396000f3006080604052600436106100775763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633e03dc9d811461007c578063863d22c714610149578063add4c78414610170578063b22524c1146101a4578063ee4e16921461022b578063f29ada2f14610249575b600080fd5b34801561008857600080fd5b50604080516020600460e43581810135601f81018490048402850184019095528484526101479482359460248035956044359560643595608435600160a060020a039081169660a4359091169560c4359536956101049492939190920191819084018382808284375050604080516020601f818a01358b0180359182018390048302840183018552818452989b8a359b909a90999401975091955091820193509150819084018382808284375094975050933594506102b19350505050565b005b34801561015557600080fd5b5061015e610695565b60408051918252519081900360200190f35b34801561017c57600080fd5b5061018860043561069b565b60408051600160a060020a039092168252519081900360200190f35b3480156101b057600080fd5b50604080516020600460e43581810135601f81018490048402850184019095528484526101479482359460248035956044359560643595608435600160a060020a039081169660a4359091169560c4359536956101049492939190920191819084018382808284375094975050933594506107579350505050565b34801561023757600080fd5b506101476004356024356044356109d4565b34801561025557600080fd5b50610261600435610cdb565b60408051600160a060020a03998a168152979098166020880152868801959095526060860193909352608085019190915260a084015260ff1660c083015260e08201529051908190036101000190f35b60408051602080820184905282518083038201815291830192839052815160009384938493849391929182918401908083835b602083106103035780518252601f1990920191602091820191016102e4565b5181516020939093036101000a600019018019909116921691909117905260405192018290039091208c149250610387915050576040805160e560020a62461bcd02815260206004820152601c60248201527f696e69746961746f72522073686f756c6420626520636f727265637400000000604482015290519081900360640190fd5b6103978f8f8f8f8f8f8f8f610d2f565b9350600160a060020a03808516908c1614610422576040805160e560020a62461bcd02815260206004820152602760248201527f7369676e61747572652073686f756c64206265207369676e656420627920696e60448201527f69746961746f7200000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b308f8f8f8f8f8f8f8e604051602001808a600160a060020a0316600160a060020a03166c01000000000000000000000000028152601401896000191660001916815260200188815260200187815260200186815260200185600160a060020a0316600160a060020a03166c0100000000000000000000000002815260140184600160a060020a0316600160a060020a03166c010000000000000000000000000281526014018360001916600019168152602001826000191660001916815260200199505050505050505050506040516020818303038152906040526040518082805190602001908083835b6020831061052c5780518252601f19909201916020918201910161050d565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020925089600160a060020a031661056f8488610e19565b600160a060020a0316146105f3576040805160e560020a62461bcd02815260206004820152602760248201527f7369676e61747572652073686f756c64206265207369676e656420627920696e60448201527f69746961746f7200000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b6106018d8d878a8f8f610ef9565b915061060d8f8f610fda565b600081815260026020908152604091829020805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0387811691821790925583518581529283015282519394508d169233927f512c626a39638d8845d1244c69032b4456ac2ba22c1502165be19374ee932081928290030190a3505050505050505050505050505050565b60015481565b6000818152602081905260408120600681015460ff166001141561073a576007810154431161073a576040805160e560020a62461bcd02815260206004820152602360248201527f72657665616c2074696d652077696e646f772073686f756c6420626520636c6f60448201527f7365640000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b5050600090815260026020526040902054600160a060020a031690565b6000808033600160a060020a038816146107bb576040805160e560020a62461bcd02815260206004820152601d60248201527f74782073686f756c64206265206d616465206279206163636570746f72000000604482015290519081900360640190fd5b6107cb8c8c8c8c8c8c8c8c610d2f565b9250600160a060020a0380841690891614610856576040805160e560020a62461bcd02815260206004820152602760248201527f7369676e61747572652073686f756c64206265207369676e656420627920696e60448201527f69746961746f7200000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b6108608c8c610fda565b915060008083600019166000191681526020019081526020016000209050898160020181905550888160030181905550878160000160006101000a815481600160a060020a030219169083600160a060020a03160217905550868160010160006101000a815481600160a060020a030219169083600160a060020a0316021790555085816004018160001916905550838160050181600019169055506001544301816007018190555060018160060160006101000a81548160ff021916908360ff1602179055508660026000846000191660001916815260200190815260200160002060006101000a815481600160a060020a030219169083600160a060020a0316021790555086600160a060020a031688600160a060020a03167f77d6c2556176bfe2b3d17a9fcb85f4ffdb2a97fa933a92a471297cec936d75098484600701546040518083600019166000191681526020018281526020019250505060405180910390a3505050505050505050505050565b60008060006109e38686610fda565b60008181526020819052604090206006810154919450925060ff16600114610a7b576040805160e560020a62461bcd02815260206004820152602260248201527f73746174652073686f756c642062652077616974696e6720666f72207265766560448201527f616c000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b600482015460408051602080820188905282518083038201815291830192839052815191929182918401908083835b60208310610ac95780518252601f199092019160209182019101610aaa565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916141515610b51576040805160e560020a62461bcd02815260206004820152601c60248201527f696e69746961746f72522073686f756c6420626520636f727265637400000000604482015290519081900360640190fd5b6007820154431115610bd3576040805160e560020a62461bcd02815260206004820152602160248201527f72657665616c2074696d652077696e646f772073686f756c64206265206f706560448201527f6e00000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b60028201546003830154600584015484546001860154610c0594939289929091600160a060020a039182169116610ef9565b6000848152600260208181526040808420805473ffffffffffffffffffffffffffffffffffffffff19908116600160a060020a038881169182179093558685528387208054831681556001818101805490941690935595860187905560038601879055600486018790556005860187905560068601805460ff1916905560079095019590955593870154875482518a815293840194909452815195965084169492909316927f58bd3f2c86e089a272400331a7430bfada3c33073ac9cb0bd56079aad1297cee92918290030190a3505050505050565b60006020819052908152604090208054600182015460028301546003840154600485015460058601546006870154600790970154600160a060020a03968716979690951695939492939192909160ff169088565b604080516c01000000000000000000000000308102602080840191909152603483018c9052605483018b9052607483018a905260948301899052600160a060020a03808916830260b4850152871690910260c883015260dc8083018690528351808403909101815260fc909201928390528151600093849392909182918401908083835b60208310610dd25780518252601f199092019160209182019101610db3565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050610e0b8184610e19565b9a9950505050505050505050565b60008060008084516041141515610e2f57600080fd5b50505060208201516040830151606084015160001a601b60ff82161015610e5457601b015b8060ff16601b1480610e6957508060ff16601c145b1515610e7457600080fd5b60408051600080825260208083018085528a905260ff8516838501526060830187905260808301869052925160019360a0808501949193601f19840193928390039091019190865af1158015610ece573d6000803e3d6000fd5b5050604051601f190151945050600160a060020a0384161515610ef057600080fd5b50505092915050565b604080516020808201879052818301869052825180830384018152606090920192839052815160009384938493909282918401908083835b60208310610f505780518252601f199092019160209182019101610f31565b5181516020939093036101000a6000190180199091169216919091179052604051920182900390912094508a925084915050811515610f8b57fe5b06905060288811610fba57600281900a891664ffffffffff1615610fb157849250610fb5565b8392505b610fce565b88811015610fca57849250610fce565b8392505b50509695505050505050565b6040805160208082018590528183018490528251808303840181526060909201928390528151600093918291908401908083835b6020831061102d5780518252601f19909201916020918201910161100e565b5181516020939093036101000a6000190180199091169216919091179052604051920182900390912096955050505050505600a165627a7a72305820ff2ab97f96fb15df18deb9540ad77f107688b752aef3fa91f06af9db392528f20029"

const owner = "0xa08105d7650Fe007978a291CcFECbB321fC21ffe";
const ownerPrivateKey = new Buffer('6A22D7D5D87EFC4A1375203B7E54FBCF35FAA84975891C5E3D12BE86C579A6E5', 'hex');

async function main(diceRevealWindow, paymentWindowMin, paymentWindowMax) {

    var diceContract = await deploy(diceABI, diceData, [diceRevealWindow])

    if (diceContract != '0x0') {
        console.log("dice contract deployed: ", diceContract);
    } else {
        console.log("dice contract deployed failed");
        return;
    }

    var paymentContract = await deploy(paymentABI, paymentData, [diceContract, paymentWindowMin, paymentWindowMax]);

    if (paymentContract != '0x0') {
        console.log("payment contract deployed: ", paymentContract);
    } else {
        console.log("payment contract deployed failed");
        return;
    }

}

async function deploy(abi, data, args) {
    var myContract = new web3.eth.Contract(abi);
    data = myContract.deploy({data:data, arguments:args}).encodeABI();
    var nonce = await web3.eth.getTransactionCount(owner);

    var txData = {
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(5000000),
        gasPrice: web3.utils.toHex(10e9), // 10 Gwei
        from: owner,
        data: data 
    }

    const transaction = new Tx(txData)
    transaction.sign(ownerPrivateKey)
    const serializedTx = transaction.serialize().toString('hex')
    let res = await web3.eth.sendSignedTransaction('0x' + serializedTx)

    if (res && res.status) {
        console.log("contract deployed: ", res);
        return res.contractAddress;
    } else {
        console.log("contract deployed failed");
        return "0x0";
    }
}

main(6, 8, 10);