
export const  generateBasicAuthHeader = () => {
    // Retrieve username and password from localStorage
    const userName = localStorage.getItem("username");
    const password = localStorage.getItem("password");
  
    // Check if both are available
    if (!userName || !password) {
      throw new Error("Username or password not found in localStorage");
    }
  
    // Encode the credentials in Base64 format
    const credentials = btoa(`${userName}:${password}`);
  
    // Return the Authorization header
    return {
        "Authorization": `Basic ${credentials}`,
      };
    };
    