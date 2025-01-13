package com.activision.chatbot.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ControllerExceptionHandler extends ResponseEntityExceptionHandler{

	@ExceptionHandler(UniqueConstraintViolationException.class)
	public ResponseEntity<Object> handleDuplicateNames(UniqueConstraintViolationException ex) {
	    Map<String, Object> body = new LinkedHashMap<>();
	    body.put("message", "Duplicate names are not allowed");
	    return new ResponseEntity<>(body, HttpStatus.CONFLICT);
	}
}