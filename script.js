import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js";

const connectButton = document.getElementById("connectButton");
const withdrawButton = document.getElementById("withdrawButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
connectButton.onclick = connect;
// withdrawButton.onclick = withdraw;
// fundButton.onclick = fund;
// balanceButton.onclick = getBalance;

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
