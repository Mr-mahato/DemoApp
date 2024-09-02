require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const fs = require("fs");

const app = express();
app.use(express.json());

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545"); // Default Ganache RPC URL

// Connect to your Ganache account
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Replace with your deployed contract address and ABI
const contractAddress = "0xb5465ED8EcD4F79dD4BE10A7C8e7a50664e5eeEB"; // Replace with your contract address on Ganache
const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "employee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "initialBalance",
        type: "uint256",
      },
    ],
    name: "addEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "employee",
        type: "address",
      },
    ],
    name: "EmployeeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "employee",
        type: "address",
      },
    ],
    name: "EmployeeRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "employee",
        type: "address",
      },
    ],
    name: "paySalary",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "employee",
        type: "address",
      },
    ],
    name: "removeEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "employee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SalaryPaid",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "employeeBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Initialize the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Generate a new dummy address
const dummyAccount = web3.eth.accounts.create();
const dummyAddress = dummyAccount.address;
console.log("Dummy address generated:", dummyAddress);

// fs.appendFileSync('dummyEthAccount.json', JSON.stringify(dummyAddress), (err) => {
//     if (err) {
//         console.log("appendFile Error:", err);
//     }
// });

// Endpoint to add an employee
// app.post('/addEmployee', async (req, res) => {
//     const { employeeAddress, initialBalance } = req.body;

//     try {
//         // Ensure the employee address is valid
//         if (!web3.utils.isAddress(employeeAddress)) {
//             return res.status(400).json({ success: false, error: 'Invalid employee address' });
//         }

//         // Convert initialBalance to BigInt
//         const initialBalanceBigInt = initialBalance;

//         // Check if the employee already exists
//         const existingBalance = await contract.methods.employeeBalances(employeeAddress,initialBalanceBigInt).call();
//         if (existingBalance !== '0') {
//             return res.status(400).json({ success: false, error: 'Employee already exists' });
//         }

//         const receipt = await contract.methods.addEmployee(employeeAddress, initialBalanceBigInt).send({
//             from: account.address,
//             gas: 15000,
//             gasPrice: '30',
//         });

//         // Convert BigInt values to strings in the receipt
//         const receiptWithStringBigInts = JSON.parse(JSON.stringify(receipt, (key, value) =>
//             typeof value === 'bigint' ? value.toString() : value
//         ));

//         res.status(200).json({ success: true, receipt: receiptWithStringBigInts });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

app.post("/addEmployee", async (req, res) => {
  const { employeeAddress, initialBalance } = req.body;

  try {
    // Ensure the employee address is valid
    if (!web3.utils.isAddress(employeeAddress)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid employee address" });
    }

    // Convert initialBalance to BigInt
    const initialBalanceBigInt = BigInt(initialBalance);

 		   // lets check exisiting user
            // const existingBalance = await contract.methods.employeeBalances(employeeAddress).call();
			// console.log("ExistingBalance:" , existingBalance);
			
            // if (existingBalance !== '0') {
            //     return res.status(400).json({ success: false, error: 'Employee already exists' });
            // }

    const receipt = await contract.methods
      .addEmployee(employeeAddress, initialBalanceBigInt)
      .send({
        from: account.address,
        gas: 150000,
        gasPrice: "30000000000",
      });

    // Convert BigInt values to strings in the receipt
    const receiptWithStringBigInts = JSON.parse(
      JSON.stringify(receipt, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json({ success: true, receipt: receiptWithStringBigInts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to pay salary
app.post("/paySalary", async (req, res) => {
  const { employeeAddress } = req.body;
  try {
    const receipt = await contract.methods.paySalary(employeeAddress).send({
      from: account.address,
      gas: 150000,
      gasPrice: "30000000000",
    });
    const receiptWithStringBigInts = JSON.parse(
      JSON.stringify(receipt, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    res.json({ success: true, receiptWithStringBigInts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to check employee balance
app.get("/employeeBalance/:employee", async (req, res) => {
  const { employee } = req.params;
  try {
    const balance = await contract.methods.employeeBalances(employee).call();
    res.json({ success: true, balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to remove an employee
app.post("/removeEmployee", async (req, res) => {
  const { employee } = req.body;
  try {
    const receipt = await contract.methods.removeEmployee(employee).send({
      from: account.address,
      gas: 150000,
      gasPrice: "30000000000",
    });
    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
