import React, { ReactDOM, useEffect, useState, useRef } from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import axios from "axios";
import { format } from 'react-string-format';
import { InputLabel, Button, Select, MenuItem, FormControl, TextField, Alert } from "@mui/material";
import Table from "./Table";
import "../styles/SearchBar.css"
import "../styles/StockClient.css"
import * as StockConstant from "../common/StockNames"
import { over } from 'stompjs';
import SockJS from 'sockjs-client';


const WS_URL = StockConstant.FINHUB_WS_API + StockConstant.FINHUB_TOKEN

const wsClient = new WebSocket(WS_URL)

// const triggerClient = new WebSocket(WS_URL)

var stompClient = null;
export default function StockClient() {


    const stockOptions = StockConstant.STOCK_LIST
    const triggerThresholdTypes = StockConstant.TRIGGER_TYPES
    // Use state hook variable to manage the changing state of variable
    const [goodMsg, setGoodMsg] = useState("");
    const [rowData, setRowData] = useState([])
    const [searchTkr, setSearchTkr] = useState("")
    const [currentSubsTkr, setCurrentSubsTkr] = useState([])
    const [triggerPrice, setTriggerPrice] = useState("")
    const [triggerStock, setTriggerStock] = useState("")
    const [subsTriggers, setSubsTriggers] = useState([])
    const [triggerThresholdType, setTriggerThresholdType] = useState("")

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
    }]

    const handleSetTrigger = (symbol) => {
        console.log("Inside handleSetTrigger for symbol: " + symbol)
        // TODO - code to call the backend api for triggers

    }

    let initalSubsTkrs = []
    let initialSubsStocks = []
    useEffect(() => {
        intialStocks.map((stockName) => {
            console.log("tkrs 1: " + stockName)
            const tkr = StockConstant.SYMBOL_MAP[stockName]
            initalSubsTkrs.push({ symbol: tkr, companyName: stockName, price: 0, pl: 0 })
            initialSubsStocks.push(stockName)

        })

        console.log("Should only be called once")
        setRowData(initalSubsTkrs)
        setCurrentSubsTkr(initialSubsStocks)

        wsClient.onopen = () => {
            console.log('WebSocket connection established with finhub.');
            intialStocks.map(stockTkr => {
                const tkr = StockConstant.SYMBOL_MAP[stockTkr]
                wsClient.send(
                    format(StockConstant.SUBSCRIBE_TEMPLATE, tkr)
                )
            }
                // "{"type":"subscribe","symbol":"BINANCE:BTCUSDT"}"
            )
        };
        connect()
    }, [])

    const connect = () => {
        console.log("Inside connect function StockClient")
        const jwtToken = sessionStorage.getItem("jwtToken")
        let Sock = new SockJS('http://localhost:8082/webSocket'
            // , null, {
            //     headers: {'Authorization': 'Bearer '+ jwtToken}}
        );
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
        console.log("After setting the connection")
    }

    const onConnected = () => {
        console.log("On Connected")
        stompClient.subscribe('/chatroom/alert', onAlertMessageReceived);
    }

    const onAlertMessageReceived = (req) => {
        console.log("onAlertMessageReceived")
        let reqData = JSON.parse(req.body);
        console.log("ALERTTT!!", JSON.stringify(req.body));
        // alertMessage.push(reqData);
        // setAlertMessage([...alertMessage]);
    }

    const onError = (err) => {
        console.log("Error from our server: ", JSON.stringify(err))
    }

    wsClient.onmessage = (res) => {
        // console.log('On message' + JSON.stringify(res.data));
        const response = JSON.parse(res.data)
        if (response.data) {
            // console.log("it is in")
            updateStockPrice(res.data)
        }

    };

    const updateStockPrice = (data) => {
        // console.log('On message 1' + JSON.parse(data));
        const stockRes = JSON.parse(data)
        // console.log("First data in the array: " + JSON.stringify(stockRes.data[0].s))
        setRowData(rowData.map(item => {
            // console.log("Iteam checking is: " + item.symbol)

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

    const handleSetTriggerSubmit = () => {
        console.log("trigger price: " + triggerPrice)
        console.log("trigger stock: " + triggerStock)
        console.log("trigger type: " + triggerThresholdType)
        if (triggerPrice && triggerStock) {
            setSubsTriggers([...subsTriggers, triggerStock])
            axios
                .post("http://localhost:8082/subscribe", { symbol: triggerStock, price: triggerPrice, triggerType: triggerThresholdType })
                .then((res) => {
                    console.log(JSON.stringify(res.data));
                    setGoodMsg(res.data)
                    console.log("Trigger is set up");
                })
                .catch((e) => {
                    console.log("Error in Subscribe call " + JSON.stringify(e));
                    // setErrMsg()
                });
        };
        setTriggerStock("")
        setTriggerPrice("")
        setTriggerThresholdType("")
    }

    const subscribeTkr = (stockName) => {
        console.log("Searched: " + stockName)
        if (stockName !== "" && StockConstant.SYMBOL_MAP[stockName]) {
            console.log("Searched Sympbol: " + StockConstant.SYMBOL_MAP[stockName])
            setSearchTkr("")

            const tkr = StockConstant.SYMBOL_MAP[stockName]
            wsClient.send(
                format(StockConstant.SUBSCRIBE_TEMPLATE, tkr)
            )
            setCurrentSubsTkr([...currentSubsTkr, stockName])
            setRowData([...rowData, { symbol: tkr, companyName: stockName, price: 0, pl: 0 }])
        }
    };

    return (
        <>
            <div className="search-container">
                <section>
                    {/**assertive  will have screen reader annouce the msg immdeitayly if focus is set here */}
                    <p
                        className={goodMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        <Alert onClose={() => {setGoodMsg("")}} severity="success">{goodMsg}</Alert>
                        <br></br>
                    </p>
                </section>
                <div className="search-inner">
                    <TextField
                        className="enter-tkr"
                        type="text"
                        label="Enter Stock Name..."
                        value={searchTkr}
                        onChange={handleOnChagenSearchTkr} />
                    <Button className="search-tkr" variant="contained" onClick={() => subscribeTkr(searchTkr)}>Search</Button>
                </div>
                <div className="dropdown">
                    {stockOptions.filter(stock => {
                        return searchTkr &&
                            stock.toLocaleLowerCase().includes(searchTkr.toLowerCase()) &&  // Checks is the chars passed are included in a stock
                            currentSubsTkr.indexOf(stock) === -1  // Restricts showing the stock name in dropdown which is already subscribed
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
            <div className="trigger-container">
                <FormControl
                    // style={{ height: "25px" }} 
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                >
                    <InputLabel style={{ "margin-top": "0px" }} id="select-label">Set Trigger</InputLabel>
                    <Select
                        labelId="select-label"
                        style={{ "margin-top": "15px" }}
                        value={triggerStock}
                        onChange={(e) => setTriggerStock(e.target.value)}
                    >
                        {currentSubsTkr.map((stockname) => {
                            return (
                                <MenuItem value={StockConstant.SYMBOL_MAP[stockname]}>{stockname}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <TextField
                    style={{ "margin-top": "0px", "height": "1px" }}
                    id="outlined-basic"
                    label="Trigger Price..."
                    variant="outlined"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                />
                <FormControl
                    // style={{ height: "25px" }} 
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                >
                    <InputLabel style={{ "margin-top": "0px" }} id="select-label">Set Threshold Type</InputLabel>
                    <Select
                        labelId="select-label"
                        style={{ "margin-top": "15px" }}
                        value={triggerThresholdType}
                        onChange={(e) => setTriggerThresholdType(e.target.value)}
                    >
                        {triggerThresholdTypes.map((thresholdType) => {
                            return (
                                <MenuItem value={thresholdType}>{thresholdType}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleSetTriggerSubmit}>
                    Submit
                </Button>
            </div>
        </>
    );
}