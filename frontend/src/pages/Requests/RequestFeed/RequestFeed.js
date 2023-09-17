import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RequestFeed.css"; // Import the CSS file
import { API_ENDPOINTS } from "../../../apiConfig";

function RequestFeed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // Added state for selected category

  useEffect(() => {
    // Fetch requests when the component mounts
    fetchRequests(selectedCategory); // Fetch requests initially without filtering
  }, [selectedCategory]); // Update requests when selectedCategory changes

  const fetchRequests = (filter) => {
    // Construct the URL based on the selected filter
    let url;
    if (filter === "nearme") {
      url = API_ENDPOINTS.GET_REQUESTS_NEAR_ME;
    } else if (filter) {
      url = API_ENDPOINTS.GET_REQUESTS_BY_CATEGORY.replace("category", filter);
    } else {
      url = API_ENDPOINTS.GET_ALL_REQUESTS;
    }
    // Reset the error state to null before making the fetch request
    setError(null);
    // Fetch requests from the specified endpoint
    fetch(url)
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Sign In Required");
        }
        if (response.status === 500) {
          throw new Error("No Requests Found");
        }
        return response.json();
      })
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const categoryMap = {
    1: "language",
    2: "accommodation",
    3: "legal",
    4: "work",
    5: "community",
    6: "services",
  };

  const [expandedRequests, setExpandedRequests] = useState({});

  const handleRequestClick = (requestId) => {
    setExpandedRequests((prevExpandedRequests) => ({
      ...prevExpandedRequests,
      [requestId]: !prevExpandedRequests[requestId],
    }));
  };

  const handleFilterClick = (filter) => {
    setSelectedCategory(filter);
  };

  if (loading) {
    return <p className="loading-sign">Loading...</p>;
  }

  if (error === "Sign In Required") {
    return (
      <div>
        <p>Sign In Required. Please sign in to view requests.</p>
        <Link to="/sign-in">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="request-feed">
      <h2>Request Feed</h2>
      <Link to="/dashboard" id="logo-form">
        mi<span>grow</span>
      </Link>

      {/* Render filter buttons */}
      <div className="filter-buttons">
        <button onClick={() => handleFilterClick(null)}>all</button>
        {Object.keys(categoryMap).map((categoryId) => (
          <button
            key={categoryId}
            onClick={() => handleFilterClick(categoryMap[categoryId])}
          >
            {categoryMap[categoryId]}
          </button>
        ))}
        <button onClick={() => handleFilterClick("nearme")}>near me</button>{" "}
        {/* Add Near Me button */}
      </div>

      <p className="feed-instructions">click on each request to know more</p>

      {error === "No Requests Found" ? (
        <p>No requests found.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <div
                className="request-box"
                onClick={() => handleRequestClick(request.id)}
              >
                <h3 className="request-title">{request.title}</h3>

                <p className="request-user">{`${request.users.first_name} ${request.users.last_name}`}</p>
                <div className="request-attribute-wrapper">
                  <button className="request-attribute" id="request-category">
                    {categoryMap[request.category_id] || "Unknown"}
                  </button>

                  <button className="request-attribute" id="request-postcode">
                    {request.postcode}
                  </button>
                </div>
                {expandedRequests[request.id] && (
                  <div className="request-description">
                    <p>{request.description}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RequestFeed;
