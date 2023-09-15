async function logout() {
    const response = await fetch('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
         // Extract error message from response JSON
         const errorData = await response.json();
         const errorMessage = errorData.message || 'Login failed';
         alert(errorMessage);
    }
  }
  
  document.querySelector('#logout').addEventListener('click', logout);