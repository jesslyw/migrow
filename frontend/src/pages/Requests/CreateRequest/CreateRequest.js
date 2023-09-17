import React, { useState, useRef, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../../apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
// follow styling from register form
import "./CreateRequest.css";

const CreateRequest = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [validTitle, setValidTitle] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
  const [validCategory, setValidCategory] = useState(false);

  const [titleFocus, setTitleFocus] = useState(false);
  const [descriptionFocus, setDescriptionFocus] = useState(false);
  const [categoryFocus, setCategoryFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  /*useEffect(() => {
    titleRef.current.focus();
  }, []);*/
  // commented out because it was cleaner when component loads without focus on title, because of the note that appears when focus is there

  useEffect(() => {
    setValidTitle(title.length >= 1);
  }, [title]);

  useEffect(() => {
    setValidDescription(description.length >= 100);
  }, [description]);

  useEffect(() => {
    setValidCategory(!!category);
  }, [category]);

  useEffect(() => {
    setErrMsg("");
  }, [title, description, category]);

  // Map category names to their corresponding integer values
  const categoryMap = {
    language: 1,
    accommodation: 2,
    legal: 3,
    work: 4,
    community: 5,
    services: 6,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validTitle || !validDescription || !validCategory) {
      setErrMsg("Invalid Entry");
      return;
    }

    // data to send to backend
    const requestData = {
      title: title,
      description: description,
      category_id: categoryMap[category], // Use the mapped integer value
    };

    console.log("data Sent to Backend:", requestData); // Log the data

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_NEW_REQUEST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setSuccess(true);
        console.log(response);
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Render success message if success is true
  if (success) {
    return (
      <div className="create-request-body">
        <section className="request">
          <p className="success-message" aria-live="assertive">
            Request successfully created!
          </p>
          <br></br>
          <Link to="/dashboard" id="back-dashboard">
            <span>back to dashboard</span>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="create-request-body">
        <section className="create-request">
          <form className="request" onSubmit={handleSubmit}>
            <Link to="/dashboard" id="logo-form">
              mi<span>grow</span>
            </Link>
            <h1>Create a request </h1>
            <br></br>
            {/* title */}
            <label htmlFor="title">Title:</label>
            <input
              className="form-field"
              type="text"
              id="title"
              ref={titleRef}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
              aria-invalid={!validTitle}
              onFocus={() => setTitleFocus(true)}
              onBlur={() => setTitleFocus(false)}
              minLength={10} // min 10 characters
            />
            <p
              className={
                titleFocus && title.length < 10 ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Please provide a title with a length of at least 10 characters
            </p>
            {/* description */}
            <label htmlFor="description">Description:</label>
            <textarea
              className="form-field"
              type="text"
              id="description"
              ref={descriptionRef}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
              aria-invalid={!validDescription}
              onFocus={() => setDescriptionFocus(true)}
              onBlur={() => setDescriptionFocus(false)}
            />
            <p
              className={
                descriptionFocus && description.length < 100
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Please provide a description with at least 100 characters, clearly
              describing the issue and help needed
            </p>

            <label htmlFor="category">Category:</label>
            <select
              className="form-field"
              id="category"
              ref={categoryRef}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
              aria-invalid={!validCategory}
              onFocus={() => setCategoryFocus(true)}
              onBlur={() => setCategoryFocus(false)}
            >
              <option value="">Select Category</option>

              <option value="language">Language</option>
              <option value="legal">Legal</option>
              <option value="community">Community</option>
              <option value="work">Work</option>
              <option value="services">Services</option>
              <option value="accommodation">Accommodation</option>
            </select>

            <p
              className={
                categoryFocus && !category ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Please select a category.
            </p>

            <button
              className="create-request-button"
              disabled={!validTitle || !validDescription || !validCategory}
            >
              Create
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default CreateRequest;
