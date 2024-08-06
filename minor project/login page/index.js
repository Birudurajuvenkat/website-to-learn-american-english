document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    if (username === '') {
        errorMessage.textContent = 'Username is required.';
        return;
    }

    if (email === '') {
        errorMessage.textContent = 'Email is required.';
        return;
    }

    if (password === '') {
        errorMessage.textContent = 'Password is required.';
        return;
    }

    if (confirmPassword === '') {
        errorMessage.textContent = 'Confirm Password is required.';
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    }

    // If everything is correct, redirect to the success page
    window.location.href = 'success.html';
});
