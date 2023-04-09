import React, { ReactDOM, useEffect, useState, useRef } from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { format } from 'react-string-format';
import Table from "./Table";

import '../styles/StockClient.css'

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
    const intialStocks = ['AMZN','BINANCE:BTCUSDT']

    const subscribeTemplate = '{"type":"subscribe","symbol":"{0}"}'

    const columns = [{
        Header: 'Symbol',
        accessor: 'symbol'
    }, {
        Header: 'Company Name',
        accessor: 'companyName'
    }, {
        Header: 'Price',
        accessor: 'price'
    }, {
        Header: 'P/L',
        accessor: 'pl'
    }]

    useEffect(() => {
        // setCurrentSubsTkr({currentSubsTkr :  \[...currentSubsTkr, intialStocks]})
        intialStocks.map((tkr) => {
            console.log("tkrs 1: "+tkr)
            setCurrentSubsTkr(...currentSubsTkr, tkr)
            setRowData([...rowData, {symbol : tkr, companyName: tkr, price: 0, pl: 0}])

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

    },[])

    wsClient.onmessage = (res) => {
        console.log('On message' + JSON.stringify(res.data));
        const response = JSON.parse(res.data)
        if(response.data) {
            console.log("it is in")
            updateStockPrice(res.data)
        }

    };

    const updateStockPrice = (data) => {
        console.log('On message 1' + JSON.parse(data));
        const stockRes = JSON.parse(data)
        console.log("First data in the array: "+ JSON.stringify(stockRes.data[0].s))
        setRowData(rowData.map(item => {
            console.log("Iteam checking is: "+item.symbol)
            
            if (item.symbol === stockRes.data[0].s && item.price !== stockRes.data[0].p) {
                const latestPrice = stockRes.data[0].p
                const previousPrice = item.price
                const percentageChange = (latestPrice - previousPrice)/previousPrice*100 
                
              return {
                ...item,
                price: latestPrice,
                pl : percentageChange.toFixed(7)
                
              };
            }
            return item;
          }));
    }

    const subscribeTkr = () => {
        console.log("Subs tkr before " + currentSubsTkr);
        const tkr = enterTkr.current.value
        wsClient.send(
            format(subscribeTemplate, tkr)
        )
        setCurrentSubsTkr(...currentSubsTkr, tkr)
        console.log("Subs tkr after " + currentSubsTkr);
        setRowData([...rowData, {symbol : tkr, companyName: tkr, price: 0, pl: 0}])
    };

    return (
        <>
            <div className="ProfileNavBar">
                <h1>Hello Web sockets</h1>
                <div className="search">
                <>
                    <input className="enter-tkr" type="text" ref={enterTkr} />
                    <button className="search-tker" onClick={subscribeTkr}>Search</button>
                </>
                </div>
                <div className="stock-table">
                    <Table columns={columns}
                        data={rowData} />
                </div>
                
            </div>
        </>
    );
}