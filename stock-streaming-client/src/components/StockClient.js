import React, { ReactDOM, useEffect, useState, useRef } from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { format } from 'react-string-format';
import { InputLabel, Button, Select, MenuItem, FormControl, TextField } from "@mui/material";
import Table from "./Table";
import "../styles/SearchBar.css"
import "../styles/StockClient.css"
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
    const [triggerPrice, setTriggerPrice] = useState("")
    const [triggerStock, setTriggerStock] = useState("")

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

    const handleSetTriggerSubmit = () => {
        console.log("trigger price: "+ triggerPrice)
        console.log("trigger stock: "+ triggerStock)
        if(triggerPrice && triggerStock) {
            console.log("trigger val")
        }
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
                <div className="trigger-cell">
                <FormControl style={{height:"25px"}} variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="select-label">Set Trigger</InputLabel>
                    <Select
                        labelId="select-label"
                        value={triggerStock}
                        onChange={(e) => setTriggerStock(e.target.value)}
                    >
                        {currentSubsTkr.map((stockname) => {
                            return(
                             <MenuItem value={StockConstant.SYMBOL_MAP[stockname]}>{stockname}</MenuItem>
                        )
                        })}
                    </Select>
                </FormControl>
                <TextField 
                    style={{height:"25px"}}
                    id="outlined-basic" 
                    label="Trigger Price..." 
                    variant="outlined"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    >
                </TextField>
                <Button
                        variant="outlined"
                        onClick={handleSetTriggerSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </>
    );
}