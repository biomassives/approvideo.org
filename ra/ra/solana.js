// Import necessary Solana libraries (e.g., solana-web3.js)
const solanaWeb3 = require('@solana/web3.js');

// Guest wallet generation for users
let guestWallet = null;
let guestBalance = 0;

// Function to create a guest wallet for users
async function createGuestWallet() {
    // Generate a new Solana keypair
    const newKeypair = solanaWeb3.Keypair.generate();
    guestWallet = newKeypair;

    // Display the guest wallet details
    displayGuestWallet(guestWallet);

    // Optionally fund the guest wallet with test SOL for learning purposes
    fundGuestWallet(guestWallet);
}

// Function to display the guest wallet details to the user
function displayGuestWallet(wallet) {
    const walletDisplay = document.getElementById('wallet-display');
    walletDisplay.innerHTML = `
        <h2>Guest Wallet Created</h2>
        <p><strong>Public Address:</strong> ${wallet.publicKey.toString()}</p>
        <p><strong>Balance:</strong> ${guestBalance} SOL</p>
        <button id="learn-self-custody" class="learn-btn">Learn About Self-Custody</button>
        <button id="offline-storage" class="offline-btn">Learn About Offline Storage</button>
    `;

    // Add event listeners for learning buttons
    document.getElementById('learn-self-custody').addEventListener('click', showSelfCustodyInfo);
    document.getElementById('offline-storage').addEventListener('click', showOfflineStorageInfo);
}

// Function to provide guest wallets with test SOL (for demo purposes)
async function fundGuestWallet(wallet) {
    console.log("Funding guest wallet with test SOL...");
    // Simulate funding the wallet with test SOL (can be modified for devnet interaction)
    guestBalance = 0.1; // Example balance (in SOL)
    displayGuestWallet(wallet);
}

// Show educational info about self-custody
function showSelfCustodyInfo() {
    const infoDisplay = document.getElementById('info-display');
    infoDisplay.innerHTML = `
        <h3>What is Self-Custody?</h3>
        <p>Self-custody means you are fully responsible for managing and securing your wallet's private keys. No third-party has control over your assets.</p>
        <ul>
            <li>Always store your private key or seed phrase in a secure place (preferably offline).</li>
            <li>Avoid sharing your keys or passwords with anyone.</li>
            <li>Consider using a hardware wallet for long-term storage.</li>
        </ul>
    `;
}

// Show educational info about offline storage (e.g., hardware wallets)
function showOfflineStorageInfo() {
    const infoDisplay = document.getElementById('info-display');
    infoDisplay.innerHTML = `
        <h3>Why Use Offline Storage?</h3>
        <p>Offline storage, such as a hardware wallet, provides extra security by keeping your private keys disconnected from the internet. This helps protect your funds from online attacks.</p>
        <ul>
⬤