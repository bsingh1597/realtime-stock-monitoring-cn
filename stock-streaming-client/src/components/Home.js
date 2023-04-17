import StockClient from "./StockClient";
import "../styles/Home.css"
import ChatRoom from "./ChatRoom";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// home/start up page of the application
export default function Home() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname;

    useEffect(() => {

        if (localStorage.getItem("loggedIn") === null && sessionStorage.getItem("loggedIn") === null) {
            from
                ? navigate(from, { replace: true })
                : window.location.replace("/login");
        }

    }, [])

    return (
        <div className="home-container">
            <div class="stock-client">
                <StockClient />
            </div>
            <div class="chat-client">
                <ChatRoom />
            </div>

        </div>
    );
}