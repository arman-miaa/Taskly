import { useNavigate } from "react-router";
import logo from "/Taskly-logo.webp";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/tasks");
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-4/5 text-center text-white">
        <img
          src={logo}
          alt="Taskly Logo"
          className="w-48 h-48 object-cover rounded-full mb-8 shadow-lg"
        />
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Taskly
        </h1>
        <p className="text-xl mb-6 opacity-90 drop-shadow-md">
          Your personal task management solution for seamless productivity.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 bg-white text-primary font-semibold rounded-lg shadow-xl hover:bg-gray-200 transition-all transform hover:scale-105"
        >
          Get Started
        </button>
      </section>

  
    </div>
  );
};

export default Home;
