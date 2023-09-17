import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_ENDPOINTS } from "../../apiConfig";
import "./SignUp.css";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PLZ_REGEX = /^\d{5}$/;

const Register = () => {
  //Allow to focus on the user input when the component loads
  const emailRef = useRef();
  //Allow to focus on the error when there's one
  const errRef = useRef();

  //Breaking down Email Field:
  //a user state set to '', tied to the input
  const [email, setEmail] = useState("");
  //a boolean set to FALSE, tied to the validation of the name
  const [validEmail, setValidEmail] = useState(false);
  //a boolean set to FALSE, to detect focus on this field
  const [emailFocus, setEmailFocus] = useState(false);

  const [postCode, setPostCode] = useState("");
  const [validPostCode, setValidPostCode] = useState(false);
  const [postCodeFocus, setPostCodeFocus] = useState(false);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  //state for messages of error and success
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //build array of data to send to database
  const userToRegister = {};
  userToRegister["email"] = email;
  userToRegister["password"] = password;
  userToRegister["firstname"] = firstName;
  userToRegister["lastname"] = lastName;
  userToRegister["postcode"] = postCode;

  //sets the focus in Email Field when the component loads
  useEffect(() => {
    emailRef.current.focus();
  }, []); //second paramenter is an empty array, so this happens only once when the component loads, now it was hairy dude on the internet that said it, I'm starting to believe

  //everytime the email changes, it validades the input on the field
  useEffect(() => {
    console.log(email);
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  //checks postal code in Germany format
  useEffect(() => {
    console.log(postCode);
    setValidPostCode(PLZ_REGEX.test(postCode));
  }, [postCode]);

  //here the validation for password is checked, but also the confirmation if it matches 2 times
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  //anytime the user changes the information of the second array, the error message is set to '' and cleared out
  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword]);

  //define handlesubmit as async function, necessary when there is a large number of iterations involved or when the operations within the loop are complex
  const handleSubmit = async (e) => {
    // prevents submit button to work if there's a problem with regex validation
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);
    //If REGEX test is successful then v1 and v2 are true. If there's a hack and one of them is false, it invalidates the entry
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    //The try statement allows you to define a block of code to be tested for errors while it is being executed. The catch statement allows you to define a block of code to be executed, if an error occurs in the try block.
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToRegister),
      });

      const data = await response.json();
      //logic when the fetch is successful
      console.log(response?.data);
      console.log(data);
      console.log(response?.accessToken);
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setEmail("");
      setPassword("");
      setMatchPassword("");
    } catch (err) {
      //logic for when there is an error
      if (!err?.response) {
        setErrMsg("No Server Response");
        console.log(err.response);
      } else if (err.response?.status === 429) {
        setErrMsg("Rate Limit");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {/*If the validation e registrations goes well, we inform it, because this website is not Sphinx throwing enigmas at the user */}
      {success ? (
        <div className="register">
          <section className="register">
            <h1>Almost there!</h1>
            <p className="success">
              We've sent you an email with a activation link for your account.{" "}
              <br />
              <a className="form-link" href="/sign-in">
                Sign In
              </a>
            </p>
          </section>
        </div>
      ) : (
        <div className="register-body">
          <section className="register">
            {/*If theres a error message it applies class errmsg and it is showed on screen, if not, this section is positioned offscreen
                        aria-live for acessibility, announces errmsg when there's a screen reader*/}
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1>JOIN</h1>
            <Link to="/" id="logo-register">
              mi<span>grow</span>
            </Link>
            {/*with only one button we dont need onClick, so we use a onSubmit event*/}
            <form className="register" onSubmit={handleSubmit}>
              <label htmlFor="email">
                Email:
                {/* icons to indicate if the field is valid or not*/}
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validEmail || !email ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="email"
                ref={emailRef} //allows focus on input when page loads
                autoComplete="on"
                onChange={(e) => setEmail(e.target.value)} //function to tie the input to the email state
                value={email}
                required
                aria-invalid={validEmail ? "false" : "true"} //acessibility, screen reader announce if this field is invalid
                aria-describedby="emailNote" //points the id that provides information about the current element
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              <p
                id="emailNote"
                className={
                  emailFocus && email && !validEmail
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>

              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                className="narrow"
                id="firstName"
                autoComplete="on"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                required
              />

              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                autoComplete="on"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
              />

              <label htmlFor="postCode">
                Postal Code(PLZ):
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPostCode ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPostCode || !postCode ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="postCode"
                autoComplete="on"
                onChange={(e) => setPostCode(e.target.value)}
                value={postCode}
                required
                aria-invalid={validPostCode ? "false" : "true"} //acessibility, screen reader announce if this field is invalid
                aria-describedby="postCodeNote" //points the id that provides information about the current element
                onFocus={() => setPostCodeFocus(true)}
                onBlur={() => setPostCodeFocus(false)}
              />
              <p
                id="postCodeNote"
                className={
                  postCodeFocus && postCode && !validPostCode
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />5 numbers.
              </p>

              <label htmlFor="password">
                Password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPassword ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPassword || !password ? "hide" : "invalid"}
                />
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                aria-invalid={validPassword ? "false" : "true"}
                aria-describedby="passwordNote"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              {/*shows note when the field is on focus and there's not already a valid password in it*/}
              <p
                id="passwordNote"
                className={
                  passwordFocus && !validPassword ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                {/*inserts the symbols inside aria-label span, so it can read all the especial characters*/}
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>

              <label htmlFor="confirm_password">
                Confirm Password:
                {/*Shows valid icon only if there's a valid match, but also information stored in matchPassword, so it doesn't show a valid icon when both fields are empty*/}
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMatch && matchPassword ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validMatch || !matchPassword ? "hide" : "invalid"}
                />
              </label>
              <input
                type="password"
                id="confirm_password"
                onChange={(e) => setMatchPassword(e.target.value)}
                value={matchPassword}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>
              <br />
              {/*Button stays deisabled until all required data is valid*/}
              <button
                className="sign-up-button"
                disabled={
                  !validEmail ||
                  !validPassword ||
                  !validPostCode ||
                  !firstName ||
                  !lastName ||
                  !validMatch
                    ? true
                    : false
                }
              >
                JOIN
              </button>
              <br />
            </form>
            <p className="signin">
              Already a Migrow?
              <br />
              <span className="line">
                <Link className="form-link" to="/sign-in">
                  Sign In
                </Link>
              </span>
            </p>
          </section>
        </div>
      )}
    </>
  );
};

export default Register;
