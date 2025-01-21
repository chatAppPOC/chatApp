package com.activision.chatbot.exception;

public class PlayerNotFoundException extends RuntimeException{

	private static final long serialVersionUID = 1L;
    private String additionalInfo;
    
    
	public PlayerNotFoundException(String additionalInfo) {
		this.additionalInfo = additionalInfo;
	}


	public String getAdditionalInfo() {
		return additionalInfo;
	}


	public void setAdditionalInfo(String additionalInfo) {
		this.additionalInfo = additionalInfo;
	}
	
	

}
