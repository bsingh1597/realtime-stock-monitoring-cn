import React, { ReactDOM, useEffect, useState, useRef } from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { format } from 'react-string-format';
import Table from "./Table";

const WS_URL = "wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0"

const wsClient = new WebSocket(WS_URL)

export default function StockClient() {

    const [rowData, setRowData] = useState([])

    let data = {
        symbol : "",
        companyName: "",
        price : "",
        pl : ""
    }

    const enterTkr = useRef()
    const [currentSubsTkr, setCurrentSubsTkr] = useState([])

    //  const intialStocks = ['AAPL','AMZN', '']
    const intialStocks = ['AMZN']

    const subscribeTemplate = '{"type":"subscribe","symbol":"{0}"}'

    const columns = [{
        Header: 'Symbol',
        accessor: 'name'
    }, {
        Header: 'Company Name',
        accessor: 'age'
    }, {
        Header: 'Price',
        accessor: 'abc'
    }, {
        Header: 'P/L',
        accessor: 'def'
    }]

    useEffect(() => {
        // setCurrentSubsTkr({currentSubsTkr :  \[...currentSubsTkr, intialStocks]})
        intialStocks.map((tkr) => {
            console.log("tkrs"+tkr)
            setCurrentSubsTkr(...currentSubsTkr, tkr)

        })
        wsClient.onopen = () => {
            console.log('WebSocket connection established.');
            intialStocks.map(tkr => {
                wsClient.send(
                    format(subscribeTemplate, tkr)
                )
            }
                // '{"type":"subscribe","symbol":"BINANCE:BTCUSDT"}'
            )
        };

    })

    wsClient.onmessage = (res) => {
        console.log('On message' + JSON.stringify(res.data));
        const response = JSON.parse(res.data)
        // console.log('On message2' + response.type);
    };


    const subscribeTkr = () => {
        console.log("Subs tkr before " + currentSubsTkr);
        const tkr = enterTkr.current.value
        console.log("Tkr " + tkr)
        console.log("Susbcribe Msg " + format(subscribeTemplate, tkr))
        wsClient.send(
            format(subscribeTemplate, tkr)
        )
        setCurrentSubsTkr(...currentSubsTkr, tkr)
        console.log("Subs tkr after " + currentSubsTkr);
    };

    return (
        <>
            <div className="ProfileNavBar">
                <h1>Hello Web sockets</h1>
                <>
                    <input className="enter-tkr" type="text" ref={enterTkr} />
                    <button className="search-tker" onClick={subscribeTkr}>Search</button>
                </>
                <div className="stock-table">
                    <Table columns={columns}
                        data={rowData} />
                </div>
            </div>
        </>
    );
}