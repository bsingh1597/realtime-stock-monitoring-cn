package com.uga.websockets.response;



public class ServiceResponse {
	
	private String token;
	private String message;

	public ServiceResponse(String token, String message) {
		this.token = token;
		this.message = message;
	}

	public ServiceResponse(ServiceResponseBuilder responseBuilder) {
		this.token = responseBuilder.token;
		this.message = responseBuilder.message;
	}

	public String getToken() {
		return token;
	}


	public String getMessage() {
		return message;
	}

	public static class ServiceResponseBuilder {

		private String token;
		private String message;

		public ServiceResponseBuilder setToken(String token) {
			this.token = token;
			return this;
		}


		public ServiceResponseBuilder setMessage(String message) {
			this.message = message;
			return this;
		}

		public ServiceResponse build() {
			return new ServiceResponse(this);
		}
	}

}
