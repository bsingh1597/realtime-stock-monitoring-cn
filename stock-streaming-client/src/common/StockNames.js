
export const STOCK_LIST = ["Apple", "Amazon", "Google", "Microsoft", "IBM", "Sony",
    "Bitcoin USD", "Tesla", "JP Morgan", "AMD", "Netflix", "CITI Group", "Bank Of America", "Nvidia",
    "Costian Group", "Goldman Sachs", "Salesforce", "Intel", "Zoom",
    "Walt Disney", "Meta", "AT&T", "Ford Motors"]

export const SYMBOL_MAP = {
    "Apple": "AAPL",
    "Amazon": "AMZN",
    "Google": "GOOG",
    "Microsoft": "MSFT",
    "IBM": "IBM",
    "Sony": "SONY",
    "Bitcoin USD": "BINANCE:BTCUSDT",
    "Tesla": "TSLA",
    "JP Morgan": "JPM",
    "AMD": "AMD",
    "Netflix": "NFLX",
    "CITI Group": "C",
    "Bank Of America": "BAC",
    "Nvidia": "NVDA",
    "Costian Group": "COST.L",
    "Goldman Sachs": "GS",
    "Salesforce": "CRM",
    "Intel": "INTC",
    "Zoom": "ZM",
    "Walt Disney": "DIS",
    "Meta": "META",
    "AT&T": "T",
    "Ford Motors": "F"
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

export const TRIGGER_MESSAGE_TEMPLATE = '{0} for Stock {1} at price {2}';

export const INITIAL_STOCK_LIST = ['Amazon', 'Bitcoin USD']