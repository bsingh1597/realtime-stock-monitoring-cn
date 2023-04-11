import React, { ReactDOM, useEffect, useState, useRef } from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { format } from 'react-string-format';
import Table from "./Table";
import "../styles/SearchBar.css"
import * as StockConstant from "../common/StockNames"

const WS_URL = StockConstant.FINHUB_WS_API + StockConstant.FINHUB_TOKEN

const wsClient = new WebSocket(WS_URL)

export default function StockClient() {

    const stockOptions = StockConstant.STOCK_LIST
    // Use state hook variable to manage the changing state of variable
    const [rowData, setRowData] = useState([])
    const [searchTkr, setSearchTkr] = useState("")
    const [currentSubsTkr, setCurrentSubsTkr] = useState([])
    const [showTriggerBox, setShowTriggerBox] = useState(false)
    const triggerPrice = useRef()

    const intialStocks = ['Amazon', 'Bitcoin USD']

    let initialData = [{
        symbol: "",
        companyName: "",
        price: "",
        pl: ""
    }]

    const columns = [{
        Header: 'Company_Name',
        accessor: 'companyName'
    }, {
        Header: 'Symbol',
        accessor: 'symbol'
    }, {
        Header: 'Price',
        accessor: 'price'
    }, {
        Header: 'P/L',
        accessor: 'pl',
        Cell: (props) => {
            if (props.value !== "Infinity") {
                if (props.value > 0) {
                    return (
                        <p style={{ color: "green" }}>
                            {props.value + "%"}
                        </p>
                    );
                } else if (props.value < 0) {
                    return (
                        <p style={{ color: "red" }}>
                            {props.value + "%"}
                        </p>
                    );
                }
            }
        },
    }, {
        Header: 'Trigger',
        Cell: (props) => {
            console.log("showTriggerBox: " + showTriggerBox)
            return (
                // <p>{props.row.original.symbol}</p>
                <>
                    {!showTriggerBox &&
                        <button
                            className="show-trigger"
                            onClick={() => { setShowTriggerBox(true) }}
                        >Set Trigger</button>}
                    {showTriggerBox &&
                        <div>
                            <input
                                className="set-trigger-text"
                                type="text"
                                ref={triggerPrice} />
                            <button
                                className="set-trigger-button"
                                onClick={handleSetTrigger(props.row.original.symbol)}>
                                    Submit
                                </button>
                        </div>
                    }
                </>
            ); 
        }
    }]

    const handleSetTrigger = (symbol) => {
        console.log("Inside handleSetTrigger for symbol: "+symbol)

    }

    let initalSubsTkrs = []
    useEffect(() => {
        intialStocks.map((stockTkr) => {
            console.log("tkrs 1: " + stockTkr)
            const tkr = StockConstant.SYMBOL_MAP[stockTkr]
            initalSubsTkrs.push({ symbol: tkr, companyName: stockTkr, price: 0, pl: 0 })

        })
        setRowData(initalSubsTkrs)

        wsClient.onopen = () => {
            console.log('WebSocket connection established.');
            intialStocks.map(stockTkr => {
                const tkr = StockConstant.SYMBOL_MAP[stockTkr]
                wsClient.send(
                    format(StockConstant.SUBSCRIBE_TEMPLATE, tkr)
                )
            }
                // "{"type":"subscribe","symbol":"BINANCE:BTCUSDT"}"
            )
        };

    }, [])

    wsClient.onmessage = (res) => {
        console.log('On message' + JSON.stringify(res.data));
        const response = JSON.parse(res.data)
        if (response.data) {
            console.log("it is in")
            updateStockPrice(res.data)
        }

    };

    const updateStockPrice = (data) => {
        console.log('On message 1' + JSON.parse(data));
        const stockRes = JSON.parse(data)
        console.log("First data in the array: " + JSON.stringify(stockRes.data[0].s))
        setRowData(rowData.map(item => {
            console.log("Iteam checking is: " + item.symbol)

            if (item.symbol === stockRes.data[0].s && item.price !== stockRes.data[0].p) {
                const latestPrice = stockRes.data[0].p
                const previousPrice = item.price
                const percentageChange = (latestPrice - previousPrice) / previousPrice * 100

                return {
                    ...item,
                    price: latestPrice,
                    pl: percentageChange.toFixed(7)

                };
            }
            return item;
        }));
    }

    const handleOnChagenSearchTkr = (event) => {
        setSearchTkr(event.target.value)
    }

    const handleOnClickDropdown = (searchVal) => {
        console.log("Selected from dropdown: " + searchVal)
        setSearchTkr(searchVal)
    }

    const subscribeTkr = (searchVal) => {
        console.log("Searched: " + searchVal)
        if (searchVal !== "" && StockConstant.SYMBOL_MAP[searchVal]) {
            console.log("Searched Sympbol: " + StockConstant.SYMBOL_MAP[searchVal])
            setSearchTkr("")

            const tkr = StockConstant.SYMBOL_MAP[searchVal]
            wsClient.send(
                format(StockConstant.SUBSCRIBE_TEMPLATE, tkr)
            )
            setCurrentSubsTkr(...currentSubsTkr, tkr)
            console.log("Subs tkr after " + currentSubsTkr);
            setRowData([...rowData, { symbol: tkr, companyName: searchVal, price: 0, pl: 0 }])
        }
    };

    return (
        <>
            <div className="ProfileNavBar">
                <div className="search-container">
                    <div className="search-inner">
                        <input
                            className="enter-tkr"
                            type="text"
                            value={searchTkr}
                            onChange={handleOnChagenSearchTkr} />
                        <button className="search-tkr" onClick={() => subscribeTkr(searchTkr)}>Search</button>
                    </div>
                    <div className="dropdown">
                        {stockOptions.filter(stock => {
                            const searchTerm = searchTkr.toLowerCase();
                            const stockFullName = stock.toLocaleLowerCase();

                            return searchTerm && stockFullName.includes(searchTerm)
                        })
                            .slice(0, 10)
                            .map((stock) =>
                            (<div
                                className="dropdown-row"
                                onClick={() => handleOnClickDropdown(stock)}>
                                {stock}</div>
                            ))}
                    </div>
                </div>
                <div className="stock-table">
                    <Table columns={columns}
                        data={rowData} />
                </div>
            </div>
        </>
    );
}