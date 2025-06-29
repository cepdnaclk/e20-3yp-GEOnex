#include "time_utils.h"

unsigned long timeStringToMillis(const String &timeStr)
{
    int hours = timeStr.substring(0, 2).toInt();
    int minutes = timeStr.substring(3, 5).toInt();
    int seconds = timeStr.substring(6, 8).toInt();
    int millisec = timeStr.substring(9).toInt();

    return ((hours * 3600UL + minutes * 60UL + seconds) * 1000UL) + millisec;
}
