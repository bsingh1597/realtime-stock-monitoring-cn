import StockClient from "./StockClient";
import "../styles/Home.css"
import ChatRoom from "./ChatRoom";

export default function Home() {

    return (
        <div className="home-container">
            <div class="stock-client">
                <StockClient />
            </div>
            <div class="chat-box">
                <ChatRoom/>
            </div>

        </div>
    );
}