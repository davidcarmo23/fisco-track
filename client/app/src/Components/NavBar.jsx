import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // nice user icon
import api from "../api";

function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Example: fetch user from backend
    api.get("/api/user/") // you’d need an endpoint like this in Django
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="navBar">
      <button>Home</button>
      <button>Expenses</button>
      <button>Invoices</button>
      <button>Receipts</button>

      <div className="userContainer">
        <button className="userButton">
          <FaUserCircle className="userIcon" />
          {user ? user.username : "Guest"}
        </button>
        {/* dropdown / accordion for settings */}
        <div className="userDropdown">
          <button>Settings</button>
          <button>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
