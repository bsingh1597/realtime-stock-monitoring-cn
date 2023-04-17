import React, { useEffect, useState } from "react";
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

var stompClient1 = null;
export default function StockClient() {

    const stockOptions = StockConstant.STOCK_LIST
    const triggerThresholdTypes = StockConstant.TRIGGER_TYPES

    // Use state hook variable to manage the changing state of variable
    const [goodMsg, setGoodMsg] = useState("");
    const [rowData, setRowData] = useState([])
    const [searchTkr, setSearchTkr] = useState("") // Hold the value of newly searched stock
    // List of currrently subscribed stock names NOT symbols
    const [currentSubsTkr, setCurrentSubsTkr] = useState(localStorage.getItem("currentSubsTkr") ? localStorage.getItem("currentSubsTkr").split(",") : StockConstant.INITIAL_STOCK_LIST)
    const [triggerPrice, setTriggerPrice] = useState("")  // Price of the set trigger
    const [triggerStock, setTriggerStock] = useState("")  // Symbol of the set triger
    const [triggerThresholdType, setTriggerThresholdType] = useState("")  // Threshold type StopLoss or Target of the set trigger
    const [triggerMessage, setTriggerMessage] = useState("")  // Message to be shown as alert when the trigger is hit
    // List of subscribed triggers (This is used for showing trigger only to requested client)
    const [subsTriggersList, setSubsTriggersList] = useState(localStorage.getItem("subsTriggersList") ? JSON.parse(localStorage.getItem("subsTriggersList")) : [])

    const [unsubscribetriggerData, setUnsubscribetriggerData] = useState()

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
    },
    ]

    let initalSubsTkrs = []
    // This hook is called when file is rebdered once every time
    useEffect(() => {

        currentSubsTkr.map((stockName) => {
            // console.log("tkrs 1: " + stockName)
            const tkr = StockConstant.SYMBOL_MAP[stockName]
            initalSubsTkrs.push({ symbol: tkr, companyName: stockName, price: 0, pl: 0 })

        })

        // console.log("Should only be called once")
        // This is the data passed to the table
        setRowData(initalSubsTkrs)

        // While the connection is opened with Finhub subscribe the current susbcribed stocks
        wsClient.onopen = () => {
            console.log('WebSocket connection established with finhub.');
            currentSubsTkr.map(stockTkr => {
                const tkr = StockConstant.SYMBOL_MAP[stockTkr]
                // Subscribing some stocks which will be initially viewed to client once this componene is rendered for the first time
                wsClient.send(
                    format(StockConstant.SUBSCRIBE_TEMPLATE, tkr)
                )
            }
                // "{"type":"subscribe","symbol":"BINANCE:BTCUSDT"}"
            )
        };
        connect()
    }, [])

    // This function extablished the connection between frontend client and stock-streaming-server
    const connect = () => {
        console.log("Inside connect function StockClient")
        let Sock = new SockJS('http://localhost:8082/webSocket');
        stompClient1 = over(Sock);
        stompClient1.connect({}, onConnected, onError);
        console.log("After setting the connection")
    }

    // Subscribe the topic alert so any message pushed on that will be received by this client
    const onConnected = () => {
        console.log("On Connected StockClient")
        stompClient1.subscribe('/trigger/alert', onAlertMessageReceived);
    }

    // This is a callback called whever this is message pusehd to /trigger/alert
    const onAlertMessageReceived = (res) => {
        let resData = JSON.parse(res.body);
        console.log("ALERTTT!! StockClient", JSON.stringify(resData));

        // Filter the trigger message so only if the client has subscribed for that trigger than receives it
        subsTriggersList.filter((triggerData => {
            return resData && resData.symbol === triggerData.symbol && resData.price === triggerData.price && resData.triggerType === triggerData.triggerType
        })).map((triggerData) => {
            console.log(format(StockConstant.TRIGGER_MESSAGE_TEMPLATE, resData.triggerType, resData.symbol, resData.price))
            setTriggerMessage(format(StockConstant.TRIGGER_MESSAGE_TEMPLATE, resData.triggerType, StockConstant.SYMBOL_MAP_REVERSE[resData.symbol], resData.price));
        }
        )
    }

    // This function removes the specific trigger
    const removeTrigger = () => {
        console.log("triggerMessage ", unsubscribetriggerData)

        axios
            .post("http://localhost:8082/unsubscribe/trigger", unsubscribetriggerData)
            .then((res) => {
                console.log(JSON.stringify(res.data));
                setGoodMsg(res.data)
            })
            .catch((e) => {
                console.log("Error in unsubscribe call " + JSON.stringify(e));
            });
        let newSubsTriggerDataList = subsTriggersList.filter((triggerData) =>
            !(triggerData.triggerType === unsubscribetriggerData.triggerType &&
                triggerData.symbol === unsubscribetriggerData.symbol &&
                triggerData.price === unsubscribetriggerData.price))
        setSubsTriggersList(newSubsTriggerDataList)
        localStorage.setItem("subsTriggersList", JSON.stringify(newSubsTriggerDataList))
    };

    const onError = (err) => {
        console.log("Error from our server: ", JSON.stringify(err))
    }

    // This function is called when there is message from the Finhub Api
    wsClient.onmessage = (res) => {
        // console.log('On message' + JSON.stringify(res.data));
        const response = JSON.parse(res.data)
        if (response.data) {
            updateStockPrice(res.data)
        }

    };

    // This function sets the stock price and chnage to the table
    const updateStockPrice = (data) => {
        // console.log('On message 1' + JSON.parse(data));
        const stockRes = JSON.parse(data)
        setRowData(rowData.map(item => {
            // console.log("Iteam checking is: " + item.symbol)

            if (item.symbol === stockRes.data[0].s && item.price !== stockRes.data[0].p) {
                const latestPrice = stockRes.data[0].p
                const previousPrice = item.price
                // Calculate the chnage percentage based on the previous price and recent price
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

    // Sets the currently searched stock
    const handleOnChageSearchTkr = (event) => {
        setSearchTkr(event.target.value)
    }

    // When a stock is seleted from the drop down
    const handleOnClickDropdown = (searchVal) => {
        console.log("Selected from dropdown: " + searchVal)
        setSearchTkr(searchVal)
    }

    // Submit after selecting all the fields of trigger
    const handleSetTriggerSubmit = () => {
        console.log("trigger price: " + triggerPrice)
        console.log("trigger stock: " + triggerStock)
        console.log("trigger type: " + triggerThresholdType)
        if (triggerPrice && triggerStock && triggerThresholdType) {
            const triggerData = {
                symbol: triggerStock,
                price: parseFloat(triggerPrice).toFixed(2),
                triggerType: triggerThresholdType
            }
            subsTriggersList.push(triggerData);
            localStorage.setItem("subsTriggersList", JSON.stringify(subsTriggersList))
            setSubsTriggersList(subsTriggersList);

            // Call to stock-streaming-server to subscribe the stock
            axios
                .post("http://localhost:8082/subscribe/trigger", triggerData)
                .then((res) => {
                    console.log(JSON.stringify(res.data));
                    setGoodMsg(res.data)
                    console.log("Trigger is set up");
                })
                .catch((e) => {
                    console.log("Error in Subscribe call " + JSON.stringify(e));
                });
        };
        setTriggerStock("")
        setTriggerPrice("")
        setTriggerThresholdType("")
    }

    // This function is called on clicking search after stock name selection and add the stock to currently subscribed stock
    const subscribeTkr = (stockName) => {
        console.log("Searched: " + stockName)
        if (stockName !== "" && StockConstant.SYMBOL_MAP[stockName]) {
            console.log("Searched Sympbol: " + StockConstant.SYMBOL_MAP[stockName])
            setSearchTkr("")

            const tkr = StockConstant.SYMBOL_MAP[stockName]
            // Call to Finhub API to subscribe the stock
            wsClient.send(
                format(StockConstant.SUBSCRIBE_TEMPLATE, tkr)
            )
            setCurrentSubsTkr([...currentSubsTkr, stockName])
            setRowData([...rowData, { symbol: tkr, companyName: stockName, price: 0, pl: 0 }])
            currentSubsTkr.push(stockName)
            // For session management
            localStorage.setItem("currentSubsTkr", currentSubsTkr)
        }
    };

    return (
        <>
            <div className="search-container">
                <section>
                    {/** To show subscribed to trigger message */}
                    <p
                        className={goodMsg ? "errmsg1" : "offscreen"}
                        aria-live="assertive"
                    >
                        <Alert onClose={() => { setGoodMsg("") }} severity="success">{goodMsg}</Alert>
                        <br></br>
                    </p>
                </section>
                <section>
                    {/**This is used to show the triger info to user */}
                    <p
                        className={triggerMessage ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        <div style={{ "display": "flex" }}>
                            <Alert
                                onClose={() => { setTriggerMessage("") }}
                                severity="info">{triggerMessage}</Alert>
                        </div>
                        <br></br>
                    </p>
                </section>
                <div className="search-inner">
                    {/* textfield where we enter the trigger name to be searched  */}
                    <TextField
                        className="enter-tkr"
                        type="text"
                        label="Enter Stock Name..."
                        value={searchTkr}
                        onChange={handleOnChageSearchTkr} />
                    <Button className="search-tkr" variant="contained" onClick={() => subscribeTkr(searchTkr)}>Search</Button>
                </div>
                <div className="dropdown">
                    {/* Logic for showing the drop from listed stock names */}
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
                {/* To show stock names from the list of subscribed stocks */}
                <FormControl
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
                {/* Price for trigger */}
                <TextField
                    style={{ "margin-top": "0px", "height": "1px" }}
                    id="outlined-basic"
                    label="Trigger Price..."
                    variant="outlined"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                />
                <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                >
                    {/* Type of Trigger StopLoss or Target */}
                    <InputLabel style={{ "margin-top": "0px" }} id="select-label">Trigger Type</InputLabel>
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
            <div className="trigger-container" style={{ position: "flex" }}>
                <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                >
                    {/* Type of Trigger StopLoss or Target */}
                    <InputLabel style={{ "margin-top": "0px" }} id="select-label">Remove Trigger</InputLabel>
                    <Select
                        labelId="select-label"
                        style={{ "margin-top": "15px" }}
                        value={unsubscribetriggerData}
                        onChange={(e) => setUnsubscribetriggerData(e.target.value)}
                    >
                        {subsTriggersList.map((triggerData) => {
                            return (
                                <MenuItem value={triggerData}>{triggerData.triggerType} for {triggerData.symbol} at price {triggerData.price}</MenuItem>
                            )
                        })}
                    </Select>
                    <Button
                        variant="contained"
                        onClick={removeTrigger}>
                        Submit
                    </Button>
                </FormControl>
            </div>
        </>
    );
}