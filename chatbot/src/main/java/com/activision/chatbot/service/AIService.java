package com.activision.chatbot.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class AIService {

	private static final String HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/MoritzLaurer/deberta-v3-base-zeroshot-v1";

	@Value("${huggingface.api.key}")
	private String huggingFaceApiKey;

	private final OkHttpClient client = new OkHttpClient();

	/**
	 * Classifies the issue content using Hugging Face zero-shot classification API.
	 * Returns one of: Login Issue, Ban Appeal, Technical Issue, Billing Issue,
	 * General Inquiry
	 */
	public String classifyIssue(String messageContent) throws Exception {
		String[] candidateLabels = { "Login Issue", "Game Related Issue", "Ban Appeal", "Technical Issue", "Billing Issue",
				"General Inquiry" };
		JSONObject requestBody = new JSONObject();
		requestBody.put("inputs", messageContent);
		JSONObject parameters = new JSONObject();
		parameters.put("candidate_labels", new JSONArray(candidateLabels));
		requestBody.put("parameters", parameters);
		Request request = new Request.Builder().url(HUGGINGFACE_API_URL)
				.addHeader("Authorization", "Bearer " + huggingFaceApiKey).addHeader("Content-Type", "application/json")
				.post(RequestBody.create(requestBody.toString(), MediaType.parse("application/json"))).build();
		try (Response response = client.newCall(request).execute()) {
			String responseBody = response.body() != null ? response.body().string() : "";
			if (!response.isSuccessful()) {
				throw new RuntimeException(
						"Hugging Face API call failed with status: " + response.code() + ", body: " + responseBody);
			}
			JSONObject responseJson = new JSONObject(responseBody);
			JSONArray labels = responseJson.getJSONArray("labels");
			return labels.getString(0).trim();
		}
	}
}
