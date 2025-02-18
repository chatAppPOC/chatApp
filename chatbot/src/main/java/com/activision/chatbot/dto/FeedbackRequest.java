package com.activision.chatbot.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

public class FeedbackRequest {
	private String playerFeedbackComments;
	private Boolean issueResolved;
	@JsonProperty("questionAndAnswer")
	private List<QuestionAndAnswerReq> questionAndAnswer;
	
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class QuestionAndAnswerReq {
		private String question;
		private String Answer;
		private Long score;
		private List<String> responses;
		private Map<String, Integer> options;
		
		public QuestionAndAnswerReq() {}

		public String getQuestion() {
			return question;
		}

		public void setQuestion(String question) {
			this.question = question;
		}

		public String getAnswer() {
			return Answer;
		}

		public void setAnswer(String answer) {
			Answer = answer;
		}

		public Long getScore() {
			return score;
		}

		public void setScore(Long score) {
			this.score = score;
		}

		public List<String> getResponses() {
			return responses;
		}

		public void setResponses(List<String> responses) {
			this.responses = responses;
		}

		public Map<String, Integer> getOptions() {
			return options;
		}

		public void setOptions(Map<String, Integer> options) {
			this.options = options;
		}

		@Override
		public String toString() {
			return "QuestionAndAnswerReq [question=" + question + ", Answer=" + Answer + ", score=" + score
					+ ", responses=" + responses + "]";
		}
	}

	public String getPlayerFeedbackComments() {
		return playerFeedbackComments;
	}

	public void setPlayerFeedbackComments(String playerFeedbackComments) {
		this.playerFeedbackComments = playerFeedbackComments;
	}

	public Boolean getIssueResolved() {
		return issueResolved;
	}

	public void setIssueResolved(Boolean issueResolved) {
		this.issueResolved = issueResolved;
	}
	
	public List<QuestionAndAnswerReq> getQuestionAndAnswer() {
		return questionAndAnswer;
	}

	public void setQuestionAndAnswer(List<QuestionAndAnswerReq> questionAndAnswer) {
		this.questionAndAnswer = questionAndAnswer;
	}

	@Override
	public String toString() {
		return "FeedbackRequest [playerFeedbackComments=" + playerFeedbackComments + ", issueResolved=" + issueResolved
				+ ", questionAndAnswer=" + questionAndAnswer + "]";
	}
}
