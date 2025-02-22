export const saveUser = async (user) => {
    console.log('api user',user);
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save user");
    }

    const data = await response.json();
    console.log("User saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error saving user:", error.message);
    return null;
  }
};
