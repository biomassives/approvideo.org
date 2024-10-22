// Initialize Supabase Client
const { createClient } = supabase;
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Placeholder for current user
let currentUser = null;

// Function to handle login with Supabase
async function supabaseLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    
    if (error) {
        console.error('Login failed:', error.message);
        alert('Login failed. Please check your credentials.');
    } else {
        currentUser = data.user;
        console.log('Login successful:', data);
        alert('Login successful! Welcome ' + currentUser.email);
        // Proceed with blockchain login or other activities
    }
}

// Function to handle blockchain login
async function blockchainLogin(blockchain) {
    console.log('Logging into blockchain:', blockchain);
    // You can add specific login logic for each blockchain here

    // Placeholder logic:
    alert(`Logged in to ${blockchain}`);
}

// Set up event listeners for blockchain login buttons
document.querySelectorAll('.blockchain-login-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const blockchain = button.getAttribute('data-blockchain');
        blockchainLogin(blockchain);
    });
});

// Example: Call supabaseLogin when the user clicks login
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    supabaseLogin(email, password);
});