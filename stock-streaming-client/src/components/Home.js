import StockClient from "./StockClient";
import "../styles/Home.css"
import ChatRoom from "./ChatRoom";

// home/start up page of the application
export default function Home() {

    return (
        <div className="home-container">
            <div class="stock-client">
                <StockClient />
            </div>
            <div class="chat-client">
                <ChatRoom/>
            </div>

        </div>
    );
}