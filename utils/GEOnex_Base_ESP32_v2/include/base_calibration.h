#ifndef BASE_CALIBRATION_H
#define BASE_CALIBRATION_H

#include "base_corrections.h"

// Structure to store base fixed position data
struct FIXEDData
{
    double latitude;
    double longitude;
    bool isValid;
};

FIXEDData computePrecisePosition();

#endif