package common.type

import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle
import kotlin.time.Instant

// The dates of the API in the locale and time zone of the device

private fun format(instant: Instant, formatter: DateTimeFormatter): String =
  formatter.withZone(ZoneId.systemDefault()).format(java.time.Instant.ofEpochMilli(instant.toEpochMilliseconds()))

fun formatDate(instant: Instant): String = format(instant, DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM))

fun formatTime(instant: Instant): String = format(instant, DateTimeFormatter.ofLocalizedTime(FormatStyle.SHORT))

fun formatDateTime(instant: Instant): String = format(instant, DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM, FormatStyle.SHORT))
