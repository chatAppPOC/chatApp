package com.activision.chatbot.dto;

import java.util.List;

public class FeedbackRequest {
	private String playerFeedbackComments;
	private Boolean issueResolved;
	private List<QuestionAndAnswerReq> questionAndAnswer;
	
	public static class QuestionAndAnswerReq {
		private String question;
		private String Answer;
		private Long score;

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

		@Override
		public String toString() {
			return "[question=" + question + ", Answer=" + Answer + ", score=" + score + "]";
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
