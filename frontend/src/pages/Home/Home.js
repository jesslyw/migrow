import { React, useEffect, useRef, useState } from "react";
import "./Home.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import abouticon from "../../img/bird.png";
import teamicon from "../../img/girafe.png";
import loginicon from "../../img/login.png";
import techlabs from "../../img/techlabs.png";
import camila from "../../img/camila.png";
import jess from "../../img/jess.png";
import laura from "../../img/laura.png";
import mari from "../../img/mari.png";
import monica from "../../img/monica.png";
import peer from "../../img/peer.png";
import salwa from "../../img/salwa.png";
// wow we need to bring monica to the importaholics meeting

function Home() {
  //Scrolling Sections, because we are rocks that like to roll
  const home = useRef(null);
  const aboutapp = useRef(null);
  const aboutteam = useRef(null);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

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

  const navigate = useNavigate();

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

  //After all these nonsense, here's what we wanted to show to the internet people
  return (
    <>
      {loading ? null : (
        <div className="app">
          <section ref={home}>
            {/*Home Screen*/}
            <div className="home">
              {/*Side nav Icons*/}
              <div id="icons">
                <p onClick={() => scrollToSection(home)}>
                  <img src={loginicon} id="icon" title="Enter" />
                </p>
                <p onClick={() => scrollToSection(aboutapp)}>
                  <img src={abouticon} id="icon" title="About App" />
                </p>
                <p onClick={() => scrollToSection(aboutteam)}>
                  <img src={teamicon} id="icon" title="About Team" />
                </p>
              </div>

              {/*CSS3 CodePen Animation*/}
              <div id="shapes">
                <div className="div1" id="one"></div>
                <div className="div1" id="two"></div>
                <div className="div2" id="three"></div>
                <div className="div2" id="four"></div>
              </div>

              {/*Logo and Slogan */}
              <div className="migrow">
                <div id="slogan">GROW WITH OTHERS</div>
                <Link to="/" id="logo">
                  mi<span>grow</span>
                </Link>
              </div>

              {/*Nav Buttons*/}

              {/* Conditionally render the links based on user authentication */}
              {user ? (
                <>
                  <div className="home-logged">
                    <NavLink className="home-nav" to="/dashboard">
                      dashboard
                    </NavLink>
                    <NavLink className="home-nav" to="/requests/new">
                      new help request
                    </NavLink>
                    <NavLink className="home-nav" to="/requests/all">
                      all requests
                    </NavLink>
                    <button className="sign-out-home" onClick={handleSignOut}>
                      sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="visitor">
                    <NavLink className="home-visitor" to="/sign-in">
                      sign in
                    </NavLink>
                    <NavLink className="home-visitor" to="/sign-up">
                      sign up
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </section>
          {/*About App Section*/}
          <section ref={aboutapp}>
            <div className="about">
              <div className="about-content">
                <p>
                  <h1>
                    <strong>
                      Welcome to <span id="logo-tiny">migrow</span>
                    </strong>
                  </h1>
                  <h3>
                    <strong>Your Path to Settling in Germany Together</strong>
                  </h3>
                  <br />
                  <p>
                    Are you a migrant embarking on a new chapter of your life in
                    Germany? Navigating a new country can be both exciting and
                    challenging, and that's where{" "}
                    <span id="logo-tiniest">migrow</span> comes in. Our
                    innovative app is more than just a tool; it's a community
                    designed to empower migrants like you, making your journey
                    to settling in Germany smoother, more informed, and
                    incredibly enriching.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      What is <span id="logo-tiniest">migrow</span>?
                    </strong>
                  </p>
                  <p>
                    <span id="logo-tiniest">migrow</span> is a platform that
                    connects migrants with fellow migrants who have already
                    overcome the hurdles of relocating to Germany and natives
                    that could have insider tips or a vision to share. We
                    understand that adapting to a new culture, learning a new
                    language, and understanding unfamiliar systems can be
                    overwhelming. That's why Migrow facilitates connections
                    between newcomers and experienced migrants and natives who
                    are eager to lend a helping hand.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Why Choose <span id="logo-tiniest">migrow</span>?
                    </strong>
                  </p>
                  <p>
                    <strong>👨&zwj;👩&zwj;👧&zwj;👦 Community First:</strong>{" "}
                    We're more than just an app; we're a grassroots initiative,
                    created by the people, for the people that celebrates
                    diversity and enables communities to support each other on
                    the path to integration.
                  </p>
                  <p>
                    <strong>💪 Empowerment:</strong>{" "}
                    <span id="logo-tiniest">migrow</span> empowers you to take
                    charge of your settlement journey by connecting you with
                    those who've already conquered the challenges you face and
                    democratizing access to resources, opportunities, and
                    decision-making processes.
                  </p>
                  <p>
                    <strong>🌎 Cultural Exchange:</strong> Experience the beauty
                    of cultural exchange by forging friendships with people from
                    various backgrounds, all sharing the common goal of building
                    a life in Germany.
                  </p>
                  <p>
                    <strong>💞 Trust and Support:</strong> Our platform is based
                    on trust and genuine support. As a facilitator, we collect
                    the bare minimum data necessary and have implemented safety
                    measures to ensure that you are in control of how your data
                    is shared and used within our platform.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Embark on your journey to settling in Germany with
                    confidence, camaraderie, and a wealth of knowledge at your
                    fingertips. Join <span id="logo-tiniest">migrow</span> today
                    and discover the joy of conquering challenges together. Your
                    success story starts here.
                  </p>
                </p>
                <br />
                <p>
                  <strong>Our Features:</strong>
                </p>
                <p>
                  🌐 <strong>Connect with Seasoned Migrants</strong>: Whether
                  you're struggling with legal and bureaucratic procedures,
                  language barriers, or just seeking advice on the best local
                  spots, <span id="logo-tiniest">migrow</span> connects you with
                  locals and experienced migrants who've been in your shoes.
                </p>
                <p>
                  😀 <strong>Insider View</strong>: Is hard to find friends in a
                  new place! And it's easier to find yourself always in circles
                  of people just like you. But{" "}
                  <span id="logo-tiniest">migrow</span> builds a bridge that
                  help you connect with people that were born here and perhaps
                  have a different point of view to share!
                </p>
                <p>
                  💡 <strong>Problem Solving</strong>: Got a specific problem
                  that needs solving? Post it on{" "}
                  <span id="logo-tiniest">migrow</span> and watch as our vibrant
                  community rallies around you with solutions, suggestions, and
                  empathetic support.
                </p>
              </div>
            </div>
          </section>
          {/*About Team Section*/}
          <section ref={aboutteam}>
            <div className="aboutteam">
              <div className="about-content">
                <h1>
                  <strong>
                    Meet the Team behind <span id="logo-tiny">migrow</span>
                  </strong>
                </h1>
                <br />

                <p>
                  <span>
                    We are the team behind <span id="logo-tiniest">migrow</span>
                    , brought together by <img src={techlabs} id="techlabs" />{" "}
                    in a hybrid <em>UX Design</em> and <em>Web Development</em>{" "}
                    Program.
                  </span>
                </p>
                <p>
                  <span>
                    Drawing on our personal challenges and experiences, we
                    united forces blending code, design, and ideas to create a
                    platform that empowers migrants in their communities.
                  </span>
                </p>

                {/*Pictures of everyone - TO DO: add names and tracks on hover, add Mentors*/}
                <div className="teampics">
                  {/*Web Dev Track*/}
                  <div className="container">
                    <img className="pics" src={camila} id="team" />
                    <div class="middle">
                      <div class="team-member">
                        Camila Piotrowski
                        <p className="track">WebDev Frontend</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <img className="pics" src={jess} id="team" />
                    <div class="middle">
                      <div class="team-member">
                        Jessica Lim<p className="track">WebDev Backend</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <img className="pics" src={mari} id="team" />
                    <div class="middle">
                      <div class="team-member">
                        Mariana Rausch<p className="track">WebDev Frontend</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <img className="pics" src={monica} id="team" />
                    <div class="middle">
                      <div class="team-member">
                        Monica Fadul<p className="track">WebDev Frontend</p>
                      </div>
                    </div>
                  </div>
                  <br />
                  {/*UX Track*/}
                  <div className="container">
                    <img className="pics" src={laura} id="team" />
                    <div class="middle">
                      <div class="team-member">
                        Laura Benz<p className="track">UX Design</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <img className="pics" src={peer} id="team" />
                    <div class="middle">
                      <div class="team-member">
                        Peer Nissen<p className="track">UX Design</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <img className="pics" src={salwa} id="team" />
                    <div class="middle">
                      <div class="team-member">
                        Salwa Sultan<p className="track">UX Design</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Home;
