
export const STOCK_LIST = ["Apple", "Amazon", "Google", "Microsoft", "IBM", "Sony",
    "Bitcoin USD", "TESLA", "JPMORGAN", "AMD", "NETFLIX", "CITIGROUP", "BANK OF AMERICA CORP", "NVIDIA CORP",
    "COSTAIN GROUP PLC", "GOLDMAN SACHS GROUP INC", "SALESFORCE INC", "INTEL CORP", "ZOOM VIDEO COMMUNICATIONS",
    "WALT DISNEY CO", "META PLATFORMS", "AT & T", "FORD MOTOR CO"]

export const SYMBOL_MAP = {
    "Apple": "AAPL",
    "Amazon": "AMZN",
    "Google": "GOOG",
    "Microsoft": "MSFT",
    "IBM": "IBM",
    "Sony": "SONY",
    "Bitcoin USD": "BINANCE:BTCUSDT",
    "TESLA": "TSLA",
    "JPMORGAN": "JPM",
    "AMD": "AMD",
    "NETFLIX": "NFLX",
    "CITIGROUP": "C",
    "BANK OF AMERICA CORP": "BAC",
    "NVIDIA CORP": "NVDA",
    "COSTAIN GROUP PLC": "COST.L",
    "GOLDMAN SACHS GROUP INC": "GS",
    "SALESFORCE INC": "CRM",
    "INTEL CORP": "INTC",
    "ZOOM VIDEO COMMUNICATIONS": "ZM",
    "WALT DISNEY CO": "DIS",
    "META PLATFORMS": "META",
    "AT & T": "T",
    "FORD MOTOR CO": "F"
}

export const SYMBOL_MAP_REVERSE = {
    "AAPL": "Apple",
    "AMZN": "Amazon",
    "GOOG": "Google",
    "MSFT": "Microsoft",
    "IBM": "IBM",
    "SONY": "Sony",
    "BINANCE:BTCUSDT": "Bitcoin USD",
    "TSLA": "TESLA",
    "JPM": "JPMORGAN",
    "AMD": "AMD",
    "NFLX": "NETFLIX",
    "C": "CITIGROUP",
    "BAC": "BANK OF AMERICA CORP",
    "NVDA": "NVIDIA CORP",
    "COST.L": "COSTAIN GROUP PLC",
    "GS": "GOLDMAN SACHS GROUP INC",
    "CRM": "SALESFORCE INC",
    "INTC": "INTEL CORP",
    "ZM": "ZOOM VIDEO COMMUNICATIONS",
    "DIS": "WALT DISNEY CO",
    "META": "META PLATFORMS",
    "T": "AT & T",
    "F": "FORD MOTOR CO"
}

export const FINHUB_TOKEN = "cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0"

export const FINHUB_WS_API = "wss://ws.finnhub.io?token="

export const SUBSCRIBE_TEMPLATE = '{"type":"subscribe","symbol":"{0}"}'

export const TRIGGER_TYPES = ['StopLoss', 'Target']