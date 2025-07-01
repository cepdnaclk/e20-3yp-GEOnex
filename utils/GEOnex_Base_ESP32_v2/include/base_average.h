#ifndef BASE_AVERAGE_H
#define BASE_AVERAGE_H

#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include "base_corrections.h"

// Structure to store base fixed position data
struct AVEGData
{
    double latitude;
    double longitude;
    int satellites;
    String time;
    bool isValid;
};

AVEGData computeAveragePosition();

#endif