package com.uga.websockets.entity;


public class TriggerData {
	
	private String symbol;
	
	private Double price;
	
	private TriggerType triggerType;

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
	
	public TriggerType getTriggerType() {
		return triggerType;
	}

	public void setTriggerType(TriggerType triggerType) {
		this.triggerType = triggerType;
	}

	@Override
	public String toString() {
		return "TriggerData [symbol=" + symbol + ", price=" + price + ", triggerType=" + triggerType + "]";
	}

}
