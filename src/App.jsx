import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Home, Contact, Tests, NotFound } from './pages'

import { Header } from './components'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main
          className="flex-1 max-w-4xl mx-auto p-6"
          style={{ margin: 'auto' }}
        >
          <Routes>
            <Route path="/flightify" element={<Home />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="text-center p-4 text-sm text-gray-500">
          © {new Date().getFullYear()}
        </footer>
      </div>
    </Router>
  )
}

export default App
