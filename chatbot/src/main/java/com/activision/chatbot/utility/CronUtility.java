package com.activision.chatbot.utility;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CronUtility {

	public static String cronConvertor(Instant time, ZoneId zoneId, Recurrence recurrence, List<String> days) {
		String cron = null;
		int hour = time.atZone(zoneId).getHour();
		int minute = time.atZone(zoneId).getMinute();
		if (Recurrence.DAILY.equals(recurrence)) {
			cron = toCronDaily(minute, hour);
		} else if (Recurrence.WEEKLY.equals(recurrence)) {
			cron = toCronWeekly(minute, hour, days);
		}
		return cron;
	}

	public static String toCronDaily(final int mins, final int hrs) {
		return String.format("0 %d %d * * ?", mins, hrs);
	}

	public static String toCronWeekly(final int mins, final int hrs, List<String> days) {
		Map<String, String> daysMap = Map.of("sunday", "1", "monday", "2", "tuesday", "3", "wednesday", "4", "thursday",
				"5", "friday", "6", "saturday", "7");

		String daysNumeric = days.stream().map(day -> daysMap.getOrDefault(day.toLowerCase(), ""))
				.filter(day -> !day.isEmpty()).collect(Collectors.joining(","));

		return String.format("0 %d %d ? * %s", mins, hrs, daysNumeric);
	}

	public static enum Recurrence {
		DAILY, WEEKLY
	}
}

