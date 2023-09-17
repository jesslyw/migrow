import { React, useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  // fetch user session when page loads to render accordingly
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state as true

  useEffect(() => {
    // Fetch user session from your backend API using the fetch API
    fetch("http://localhost:3000/users/get-session") // Update the URL to match your backend route
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const { session } = data;
        console.log(session);
        setUser(session);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Could not retrieve user session:", error);
        setLoading(false);
      });
  }, []);

  const handleSignOut = () => {
    // Make an API call to sign the user out (you can use fetch or Axios)
    fetch("http://localhost:3000/users/signout", {
      method: "POST", // Use the appropriate HTTP method for sign-out
    })
      .then((response) => {
        if (response.ok) {
          setTimeout(() => {
            // Sign-out after 3 seconds
            setUser(null); // Update the user state to indicate that the user is not authenticated
          }, 2000); // 2 seconds

          // Use history to navigate to the home page
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Sign-out failed:", error);
      });
  };

  return (
    <>
      <main className="App">
        <div id="dashboard">
          {/* Conditionally render the links based on user authentication */}
          {user ? (
            <>
              <Link to="/" id="logo-form">
                mi<span>grow</span>
              </Link>
              <h1>DASHBOARD</h1>
              <br />
              <NavLink className={"buttons-dashboard"} to="/requests/new">
                new help request
              </NavLink>
              <NavLink className={"buttons-dashboard"} to="/requests/all">
                all requests
              </NavLink>
              <button className="sign-out-dashboard" onClick={handleSignOut}>
                sign out
              </button>
            </>
          ) : (
            <>
              {/* <NavLink to="/sign-in">sign in</NavLink>
              <NavLink to="/sign-up">sign up</NavLink> */}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
