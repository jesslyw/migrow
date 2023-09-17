import { React } from "react";
import "../../App.css";

function Welcome() {
  return (
    <>
      <div>
        <a href="{{ .SiteURL }}/confirm-signup?confirmation_url={{ .ConfirmationURL }}">
          Confirm your signup
        </a>
      </div>
    </>
  );
}

export default Welcome;
