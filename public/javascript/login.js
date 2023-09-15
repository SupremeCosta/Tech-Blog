//  login submission 


async function loginFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (username && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          username,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
         // Extract error message from response JSON
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Login failed';
        alert(errorMessage);
      }
    }
  }
  

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);