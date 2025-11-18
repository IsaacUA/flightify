import { NavLink } from 'react-router'

export default function CustomNav({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? 'font-medium underline' : 'text-gray-600 hover:underline'
      }
    >
      {children}
    </NavLink>
  )
}
