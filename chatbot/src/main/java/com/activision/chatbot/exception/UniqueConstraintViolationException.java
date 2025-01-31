package com.activision.chatbot.exception;

public class UniqueConstraintViolationException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	public UniqueConstraintViolationException(String message) {
		super(message);
	}
    public UniqueConstraintViolationException(Throwable throwable) {
        super(throwable); 
    }
}
