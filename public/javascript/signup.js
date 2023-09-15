async function signupFormHandler(event) {
    event.preventDefault();

    // getting data from the form
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && password) {
        const response = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify({
            username,
            password
          }),
          headers: { 'Content-Type': 'application/json' }
        }); 
    // check the response status
    if (response.ok) {
        console.log('success');

        // loginHandler();
        document.location.replace('/dashboard');

      } else {
           // Extract error message from response JSON
           const errorData = await response.json();
           const errorMessage = errorData.message || 'Login failed';
           alert(errorMessage);
      }
    }
}

document.querySelector('#signup-form').addEventListener('submit', signupFormHandler); 