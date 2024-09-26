
      document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const profilePicture = document.getElementById('profile-picture').files[0];
        const termsAccepted = form.querySelector('input[type="checkbox"]').checked;

        if (!termsAccepted) {
            authMsg.textContent = 'You must accept the terms of service.';
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('profile-picture', profilePicture);

        try {
            const response = await fetch('/register', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                authMsg.textContent = 'Registration successful!';
                authMsg.style.color = 'green';
                form.reset(); // Clear the form fields
            } else {
                authMsg.textContent = result.error || 'Registration failed';
                authMsg.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            authMsg.textContent = 'An error occurred. Please try again.';
            authMsg.style.color = 'red';
        }
    });
});