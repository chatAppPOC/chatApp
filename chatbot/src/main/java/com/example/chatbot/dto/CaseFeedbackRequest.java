package com.example.chatbot.dto;

public class CaseFeedbackRequest {
	private Long playerRating;
	private String playerFeedbackComments;
	private Boolean issueResolved;
	private Boolean satisfiedWithSupport;

	public Long getPlayerRating() {
		return playerRating;
	}

	public void setPlayerRating(Long playerRating) {
		this.playerRating = playerRating;
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

	public Boolean getSatisfiedWithSupport() {
		return satisfiedWithSupport;
	}

	public void setSatisfiedWithSupport(Boolean satisfiedWithSupport) {
		this.satisfiedWithSupport = satisfiedWithSupport;
	}

	@Override
	public String toString() {
		return "CaseFeedbackRequest [playerRating=" + playerRating + ", playerFeedbackComments="
				+ playerFeedbackComments + ", issueResolved=" + issueResolved + ", satisfiedWithSupport="
				+ satisfiedWithSupport + "]";
	}
}
