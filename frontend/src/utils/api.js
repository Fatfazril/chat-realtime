export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('token');
  
  if (!options.headers) {
    options.headers = {};
  }
  
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, options);

  // If unauthorized (401) and we got a response from the server indicating expired/missing token
  if (response.status === 401) {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    // If no refresh token, clear out potential garbage and hard redirect
    if (!storedRefreshToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
      return response;
    }

    // Try to refresh token
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefreshToken })
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      token = data.accessToken;
      localStorage.setItem('token', token);
      
      // Retry original request with new token
      options.headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(url, options);
    } else {
      // Refresh failed, clear session and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
      return response; // Return the 401 so caller can handle
    }
  }

  return response;
};
