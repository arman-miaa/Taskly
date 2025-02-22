import { useContext } from "react";
import { useNavigate } from "react-router"; // Import useNavigate
import { AuthContext } from "../providers/AuthProvider";
import { saveUser } from "../apis/userApi";

const LoginPage = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate

const handleWithGoogle = async () => {
  try {
    const result = await signInWithGoogle(); // Await the Google sign-in function
    // console.log("User signed in:", result.user); 
    saveUser(result.user)

    navigate("/", { replace: true }); // Redirect to home page
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg text-center w-80">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Login to Taskly
        </h2>
        <p className="text-gray-500 mb-6">Manage your tasks efficiently</p>

        <button
          onClick={handleWithGoogle}
          className="flex items-center justify-center gap-3 w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
