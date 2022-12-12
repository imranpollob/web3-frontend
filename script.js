import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js";
import { contractAddress, abi } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const withdrawButton = document.getElementById("withdrawButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
connectButton.onclick = connect;
withdrawButton.onclick = withdraw;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.error(error);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        connectButton.innerHTML = accounts[0];
    } else {
        connectButton.innerHTML = "Please install Metamask";
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(contractAddress);
            balanceButton.innerHTML = ethers.utils.formatEther(balance);
        } catch (error) {
            console.error(error);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        connectButton.innerHTML = accounts[0];
    } else {
        connectButton.innerHTML = "Please install Metamask";
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.error(error);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        connectButton.innerHTML = accounts[0];
    } else {
        connectButton.innerHTML = "Please install Metamask";
    }
}

async function fund() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const ethAmount = document.getElementById("ethAmount").value;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.error(error);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        connectButton.innerHTML = accounts[0];
    } else {
        connectButton.innerHTML = "Please install Metamask";
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(`Confirmation ${transactionReceipt.confirmations}`);
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}
