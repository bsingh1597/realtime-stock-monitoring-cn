import React from "react";
import "../styles/PostSignUp.css";

// redircted page after signup. confirms the user registration
export default function PostSignUp() {
  return (
    <div className="verify-body">
      <h3>VERIFY ACCOUNT</h3>
      <p>Please verify your account to login.</p>
      <p>A verification link has been sent to the registered email address</p>
      <br></br>
      <a href="/login" className="red">
        Login here
      </a>
    </div>
  );
}
