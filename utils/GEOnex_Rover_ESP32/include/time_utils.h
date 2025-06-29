#ifndef TIME_UTILS_H
#define TIME_UTILS_H

#include <Arduino.h>

// Converts "HH:MM:SS.mmm" → milliseconds since midnight
unsigned long timeStringToMillis(const String &timeStr);

#endif
