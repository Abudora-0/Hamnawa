import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/upload", label: "Upload" },
  { to: "/reader", label: "Reader" },
  { to: "/speak", label: "Speak Aloud" },
  { to: "/settings", label: "Settings" },
  { to: "/help", label: "Help" },
];

function Navbar() {
  return (
    <nav aria-label="Main navigation">
      <ul className="nav-list">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
