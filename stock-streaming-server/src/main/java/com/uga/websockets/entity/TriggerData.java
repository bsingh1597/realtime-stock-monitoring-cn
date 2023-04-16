package com.uga.websockets.entity;


public class TriggerData {
	
	private String symbol;
	
	private String price;
	
	private TriggerType triggerType;
	
	public TriggerData() {}
	
	public TriggerData(String symbol, String price, TriggerType triggerType) {
		super();
		this.symbol = symbol;
		this.price = price;
		this.triggerType = triggerType;
	}



	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
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
	
	@Override
	public int hashCode() {
		
		int prime = 0;
		int price = Double.valueOf(this.price).intValue();
		if(this.triggerType.equals(TriggerType.StopLoss)) 
			prime = 7;
		else
			prime = 11;
		
		return prime*price;
		
	}

	@Override
	public boolean equals(Object obj) {
		 // If the object is compared with itself then return true 
        if (obj == this) {
            return true;
        }
 
        /* Check if o is an instance of Complex or not
          "null instanceof [type]" also returns false */
        if (!(obj instanceof TriggerData)) {
            return false;
        }
         
        // typecast o to Complex so that we can compare data members
        TriggerData data = (TriggerData) obj;
         
        // Compare the data members and return accordingly
        return symbol.equals(data.getSymbol()) && price.equals(data.getPrice()) && triggerType.equals(data.getTriggerType());
	}

}
