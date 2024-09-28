        // DOM elements
        const contentForm = document.getElementById('content-form');
        const authForm = document.getElementById('auth-form');
        const messageDiv = document.getElementById('message');

        // Check authentication status
        async function checkAuth() {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch('/api/auth', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        contentForm.classList.remove('hidden');
                        authForm.classList.add('hidden');
                        return;
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                }
            }
            // If we get here, user is not authenticated
            contentForm.classList.add('hidden');
            authForm.classList.remove('hidden');
            localStorage.removeItem('authToken');
        }

        // Handle auth form submission
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                showMessage('Check your email for the login link!', 'success');
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });

        // Helper function to show messages
        function showMessage(message, type) {
            messageDiv.textContent = message;
            messageDiv.className = type;
        }

        // Initial auth check
        checkAuth();

        // Listen for successful auth redirect
        window.addEventListener('load', async () => {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const accessToken = hashParams.get('access_token');
            if (accessToken) {
                localStorage.setItem('authToken', accessToken);
                await checkAuth();
                window.history.replaceState(null, '', window.location.pathname);
            }
        });
