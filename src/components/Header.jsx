import CustomNav from './CustomNav'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Flightify</h1>
        <nav className="flex gap-6">
          <CustomNav to="/">Home</CustomNav>
          <CustomNav to="/tests">Tests</CustomNav>
          <CustomNav to="/contact">Contact</CustomNav>
        </nav>
      </div>
    </header>
  )
}
