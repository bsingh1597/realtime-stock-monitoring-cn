import React, { useEffect, useState, useRef } from "react";

import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignUp.css";
export default function SignUp() {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    document.getElementById("registerButton").disabled = true;
  }, []);

  const navigate = useNavigate();
  // register button handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    var userInfo = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    console.log(userInfo); // for debugging, remove eventually...
    axios({
      // Endpoint to send files
      url: "http://localhost:8082/register",
      method: "POST",
      data: userInfo,
    })
      .then((res) => {
        console.log(JSON.stringify(res.data));
        if (res.data === "User created") {
          navigate("/login");
        } else {
          setErrMsg("User with  the username already exists!");
          setError(true);
        }
        errRef.current.focus();
      })
      .catch((e) => {
        console.log("Error in authentication " + JSON.stringify(e));
        const error = JSON.parse(JSON.stringify(e));
        console.log("Error Status " + error.status);
      });
  };


  const validate = () => {
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var username = document.getElementById("username");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirmPassword");

    if (
      firstName.value === "" ||
      lastName.value === "" ||
      username.value === "" ||
      email.value === "" ||
      password.value === "" ||
      confirmPassword.value === ""
      ) {
      document.getElementById("registerButton").disabled = true;
    } else {
      document.getElementById("registerButton").disabled = false;
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-title">
        <h1>Register to Stocks Watch</h1>

        <p>
          Already have an account?{" "}
          <a href="/Login" className="red">
            Sign in here
          </a>
        </p>
      </div>
      <>
      <form className="signupform" id="requiredFields" onChange={validate}>
        <section>
          {/**assertive  will have screen reader annouce the msg immdeitayly if focus is set here */}
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            <Alert severity={error ? "error" : "success"}>{errMsg}</Alert>
            <br></br>
          </p>
        </section>
        <p>* denotes 'required field'</p>
        <div className="username">
          <label className="form_label" for="firstName">
            *First Name:{" "}
          </label>
          <br></br>
          <input
            className="form_input"
            type="stext"
            id="firstName"
            placeholder="Bob"
            required
          />
        </div>
        <div className="lastname">
          <label className="form_label" for="lastName">
            *Last Name:{" "}
          </label>
          <br></br>
          <input
            type="stext"
            name=""
            id="lastName"
            className="form_input"
            placeholder="Smith"
            required
          />
        </div>
        <div className="username">
          <label className="form_label" for="username">
            *Username:{" "}
          </label>
          <br></br>
          <input
            type="stext"
            id="username"
            className="form_input"
            placeholder="bobsmith"
            required
          />
        </div>
        <div className="email">
          <label className="form_label" for="email">
            *Email address:{" "}
          </label>
          <br></br>
          <input
            type="stext"
            id="email"
            className="form_input"
            placeholder="user@mail.com"
            required
          />
        </div>
        <div className="password">
          <label className="form_label" for="password">
            *Password:{" "}
          </label>
          <br></br>
          <input
            className="form_input"
            type="password"
            id="password"
            placeholder="***********"
            required
          />
        </div>
        <div className="confirm-password">
          <label className="form_label" for="confirmPassword">
            *Confirm Password:{" "}
          </label>
          <br></br>
          <input
            className="form_input"
            type="password"
            id="confirmPassword"
            placeholder="***********"
            required
          />
        </div>
        <br></br>
      </form>
      </>
      <br></br>
      <hr class="half-width"></hr>
      <br></br>
      <button
        type="submit"
        className="btn"
        id="registerButton"
        onClick={handleSubmit}
      >
        Register
      </button>
    </div>
  );
}
