import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Login.css";

// login page 
export default function Login() {

    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [remember, setRemember] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname;

    //put focus on the user input when first load
    useEffect(() => {
        console.log(location);
        userRef.current.focus();
    }, []);

    //emoty the error msg is there any change in the user or password input
    useEffect(() => {
        setErrMsg("");
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("username and pass", user, pwd);
        await axios({
            // Endpoint to send files
            url: "http://localhost:8082/login",
            method: "GET",
            withCredentials: false,
            auth: {
                username: user,
                password: pwd,
            },
        })
            .then((res) => {
                console.log(JSON.stringify(res.data));
                if (res.data.token) {
                    console.log(res.data.token);
                    const token = res.data.token;

                    sessionStorage.setItem("loggedIn", true);
                    sessionStorage.setItem("jwtToken", res.data.token);
                    sessionStorage.setItem("user", user);
                    sessionStorage.setItem("logginMessage", false)

                    console.log("before calling navigate");
                    if (remember) {
                        localStorage.setItem("jwtToken", token);
                        localStorage.setItem("user", user);
                    }
                    from
                        ? navigate(from, { replace: true })
                        : window.location.replace("/home");
                    setUser("");
                    setPwd("");
                } else if (res.data.token === null) {
                    //unable to login cause account not validated
                    console.log("error message: " + res.data.message);
                    setErrMsg(res.data.message);
                }
                errRef.current.focus();
            })
            .catch((e) => {
                console.log("Error in authentication " + JSON.stringify(e));
                const error = JSON.parse(JSON.stringify(e));
                console.log("Error Status " + error.status);

                if (error.status === 401) {
                    setErrMsg("Username or Password is incorrect");
                }
                errRef.current.focus();
            });
    };
    const toggle_rememberMe = () => {
        setRemember((prev) => !prev);
    };
    useEffect(() => {
        if (remember) {
            localStorage.setItem("rememberMe", remember);
        }
    }, [remember]);
    return (
        <>
            {/**{success?(if logged in - go to previous page):([false]else show error stay on page)} */}
            <div className="c">
                <form method="POST" className="form" onSubmit={handleSubmit}>
                    <div className="content">
                        <div className="form-group">
                            <section>
                                {/**assertive  will have screen reader annouce the msg immdeitayly if focus is set here */}
                                <p
                                    // ref={errRef}
                                    className={errMsg ? "alertMsg" : "offscreen"}
                                    aria-live="assertive"
                                >
                                    <Alert severity="error">{errMsg}</Alert>
                                    <br></br>
                                </p>
                            </section>
                            <label>Username: </label>
                            <input
                                type="text"
                                ref={userRef}
                                id="username-input"
                                placeholder="Username..."
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                            />
                        </div>
                        <br></br>
                        <div className="form-group">
                            <label>Password: </label>
                            <input
                                type="password"
                                id="password-input"
                                placeholder="Password..."
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <div className="rememberMe_container">
                                <input
                                    type="checkbox"
                                    style={{ "width": "40px" }}
                                    id="rememberMe"
                                    onChange={toggle_rememberMe}
                                    checked={remember}
                                />
                                <label for="rememberMe"> Remember Me</label>
                                <br></br>
                            </div>
                            <button type="submit" className="btn">
                                Login
                            </button>
                            <p className="sign-up">
                                Don't have an account?{" "}
                                <a href="/signup" className="red">
                                    Sign up here
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
