import { FaTasks, FaSyncAlt, FaUserAlt } from "react-icons/fa"; // Importing icons

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">About Taskly</h1>
        <p className="text-xl mb-6 max-w-3xl mx-auto">
          Taskly is your personal task management solution, designed to help you
          manage your day-to-day tasks with ease, efficiency, and flexibility.
          With Taskly, you can organize, track, and prioritize your tasks all in
          one place.
        </p>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <FaTasks className="text-4xl w-full text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Task Management</h3>
            <p className="text-gray-600">
              Create, edit, and delete tasks effortlessly. Stay organized and
              increase your productivity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <FaSyncAlt className="text-4xl w-full text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Real-Time Sync</h3>
            <p className="text-gray-600">
              All your changes are synced in real-time across devices, ensuring
              you always stay up to date.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <FaUserAlt className="text-4xl w-full text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-4">
              User-Friendly Interface
            </h3>
            <p className="text-gray-600">
              Enjoy an intuitive, easy-to-use interface that makes task
              management a breeze.
            </p>
          </div>
        </div>
      </section>

      {/* About Information Section */}
      <section className="flex flex-col items-center py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-xl max-w-2xl mb-8 text-gray-600">
          Our mission at Taskly is to provide individuals and teams with a
          powerful yet easy-to-use tool for task management. We believe that
          with the right tools, anyone can achieve greater focus, organization,
          and productivity.
        </p>
      </section>

      {/* Contact Info Section */}
      <section className="bg-gray-100 text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-xl text-gray-600 mb-6">
          Have questions or feedback? Reach out to us and we'd love to help!
        </p>
        <a
          href={`mailto:mdarman365506@gmail.com`}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          <FaUserAlt className="inline-block mr-2" />
          Get In Touch
        </a>
      </section>
    </div>
  );
};

export default About;
