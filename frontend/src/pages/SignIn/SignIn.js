import { useRef, useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../apiConfig";
import "./SignIn.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  //to set focus on the login-email input
  const emailRef = useRef();
  //to set focus on errors so the screen reader can read it
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //redirects to another screen
  const navigate = useNavigate();

  //build array of data to send to database
  const user = {};
  user["email"] = email;
  user["password"] = password;

  useEffect(() => {
    //this one sets the focus on email input when the component loads
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    //this one clears any error message when the user changes the useState of password or email
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //The try statement allows you to define a block of code to be tested for errors while it is being executed. The catch statement allows you to define a block of code to be executed, if an error occurs in the try block.
    try {
      console.log(user);
      const response = await fetch(API_ENDPOINTS.SIGN_IN_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        body: JSON.stringify(user),
      });

      console.log(response);

      if (response.status === 200) {
        //logic when the response.status is a good match
        setSuccess(true);
        setEmail("");
        setPassword("");
      } //logic when the response.status is a bad match
      else if (response.status === 401) {
        setErrMsg("Invalid login credentials");
      } else {
        setErrMsg("Login Failed");
      }
    } catch (err) {
      //when there is an error
      if (!err?.response) {
        setErrMsg("No Server Response");
        console.log(err.response);
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        // redirect to Home Feed in case of successful login
        navigate("/dashboard")
      ) : (
        <div className="signin">
          <section className="signin">
            {/*Displays any error msg on the top, aria-live set to assertive makes sure the screen reader
                    informs the error as soon as the focus is on this <p> element.
                    {errRef} is here to make this focus action possible*/}
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <Link to="/dashboard" id="logo-form">
              mi<span>grow</span>
            </Link>
            <h1>SIGN IN</h1>
            <form className="signin" onSubmit={handleSubmit}>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                ref={emailRef} //sets the focus on this field when component loads
                autoComplete="on"
                onChange={(e) => setEmail(e.target.value)}
                value={email} //clears the input of the form upon submission
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password} //clears the input of the form upon submission
                required
              />
              <br />
              <button class="signin-button">LOGIN</button>
            </form>
            <p className="signup">
              Need an Account?
              <br />
              <span className="line">
                <Link className="form-link" to="/sign-up">
                  SIGN UP
                </Link>
              </span>
            </p>
          </section>
        </div>
      )}
    </>
  );
};

export default SignIn;
