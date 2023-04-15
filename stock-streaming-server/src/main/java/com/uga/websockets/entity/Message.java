package com.uga.websockets.entity;

public class Message {
	
	private String senderName;
	private String receiverName;
	private String message;
	private Status status;
	
	public Message() {}

	public Message(String senderName, String receiverName, String message, String date, Status status) {
		super();
		this.senderName = senderName;
		this.receiverName = receiverName;
		this.message = message;
		this.status = status;
	}
	
	public Message(MessageBuilder messageBuilder) {
		this.senderName = messageBuilder.senderName;
		this.receiverName = messageBuilder.receiverName;
		this.message = messageBuilder.message;
		this.status = messageBuilder.status;
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}

	public String getReceiverName() {
		return receiverName;
	}

	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "Message [senderName=" + senderName + ", receiverName=" + receiverName + ", message=" + message
				+ ", status=" + status + "]";
	}
	
	public static class MessageBuilder {
		
		private String senderName;
		private String receiverName;
		private String message;
		private Status status;
		
		public MessageBuilder() {}

		public static MessageBuilder getInstance() {
			return new MessageBuilder();
		}
		
		public MessageBuilder setSenderName(String senderName) {
			this.senderName = senderName;
			return this;
		}
		
		public MessageBuilder setReceiverName(String receiverName) {
			this.receiverName = receiverName;
			return this;
		}
		
		public MessageBuilder setMessage(String message) {
			this.message = message;
			return this;
		}
		
		public MessageBuilder setStatus(Status status) {
			this.status = status;
			return this;
		}
		
		public Message build() {
			return new Message(this);
		}
		
	}
	
}
