#include <math.h>
#include "config.h"
#include "mpu_correction.h"

void correctGPSCoordinates(double &lat, double &lon, float pitch, float roll, float poleHeight)
{

    // Invert pitch and roll because MPU is upside down
    float correctedPitch = -pitch;
    float correctedRoll = -roll;

    // Normalize roll to [-180, 180]
    if (correctedRoll > 180.0f)
        correctedRoll -= 360.0f;
    if (correctedRoll < -180.0f)
        correctedRoll += 360.0f;

        
    double earthRadius = 6378137.0; // meters
    float pitchRad = correctedPitch * DEG_TO_RAD;
    float rollRad = correctedRoll * DEG_TO_RAD;

    // Compute horizontal offsets
    double offsetNorth = poleHeight * sin(pitchRad); // meters
    double offsetEast = poleHeight * sin(rollRad);   // meters

    // Convert to latitude/longitude offsets
    double dLat = offsetNorth / earthRadius * RAD_TO_DEG;
    double dLon = offsetEast / (earthRadius * cos(lat * DEG_TO_RAD)) * RAD_TO_DEG;

    lat += dLat;
    lon += dLon;
}
