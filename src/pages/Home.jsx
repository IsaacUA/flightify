import { Link } from 'react-router'

export default function Home() {
  return (
    <section>
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl text-center mt-20">
        <h1 className="text-4xl font-extrabold text-blue-500 mb-4 tracking-tight">
          Welcome to Flightify: Plane Configuration Mastery ✈️
        </h1>

        <p className="text-xl font-medium text-gray-600 mb-8">
          Your Virtual Aircraft Training Center
        </p>

        <hr className="mb-8 border-gray-200" />

        {/* Section: How It Works */}
        <div className="mb-10 text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🛠️ How It Works
          </h2>

          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold text-blue-500 mr-2">1.</span>
              <p>
                <strong className="text-gray-900">Select Your Model:</strong>{' '}
                Choose from our extensive database of aircraft.
              </p>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-500 mr-2">2.</span>
              <p>
                <strong className="text-gray-900">Identify & Place:</strong>{' '}
                Drag and drop essential components (payload, equipment, crew
                items) into their correct zones on the aircraft blueprint.
              </p>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-500 mr-2">3.</span>
              <p>
                <strong className="text-gray-900">Test Your Accuracy:</strong>{' '}
                Receive immediate feedback on your configurations and review
                results to pinpoint areas for improvement.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
