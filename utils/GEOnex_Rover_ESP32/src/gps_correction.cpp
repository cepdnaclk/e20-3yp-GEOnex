#include <Arduino.h>
#include <math.h>
#include "gps_correction.h"
#include "time_utils.h"

float baseFixedLat = 0, baseFixedLon = 0;
float baseLiveLat = 0, baseLiveLon = 0;
float roverLiveLat = 0, roverLiveLon = 0;

bool hasBaseFixed = false;
bool hasBaseLive = false;
bool hasRoverLive = false;

String baseLiveTime;
String roverLiveTime;
unsigned long basetimestamp = 0;
unsigned long rovertimestamp = 0;

void updateBaseFixed(float lat, float lon)
{
    if (!hasBaseFixed)
    {
        baseFixedLat = lat;
        baseFixedLon = lon;
        hasBaseFixed = true;
        Serial.println("[INFO] Base fixed position stored");
    }
}

void updateBaseLive(float lat, float lon, String timestamp)
{
    baseLiveLat = lat;
    baseLiveLon = lon;
    baseLiveTime = timestamp;
    hasBaseLive = true;
    basetimestamp = timeStringToMillis(baseLiveTime);

    Serial.print("[INFO] Base live timestamp in ms: ");
    Serial.println(basetimestamp);
}

void updateRoverLive(float lat, float lon, String timestamp)
{
    roverLiveLat = lat;
    roverLiveLon = lon;
    roverLiveTime = timestamp;
    hasRoverLive = true;
    rovertimestamp = timeStringToMillis(roverLiveTime);

    Serial.print("[INFO] Rover live timestamp in ms: ");
    Serial.println(rovertimestamp);

}

GpsPosition getCorrectedRoverPosition()
{
    GpsPosition result;
    result.valid = false;

    if (hasBaseFixed && hasBaseLive && hasRoverLive)
    {
        long timeDiff = abs((long)(rovertimestamp - basetimestamp));

        if (timeDiff <= 2000)
        { // ≤ 500 ms allowed
            float deltaLat = baseLiveLat - baseFixedLat;
            float deltaLon = baseLiveLon - baseFixedLon;

            result.lat = roverLiveLat - deltaLat;
            result.lon = roverLiveLon - deltaLon;
            result.valid = true;

            Serial.print("[CORRECTED] Lat: ");
            Serial.print(result.lat, 6);
            Serial.print(", Lon: ");
            Serial.println(result.lon, 6);
        }
        else
        {
            Serial.print("[SYNC FAIL] Base and Rover timestamps differ by ");
            Serial.print(timeDiff);
            Serial.println(" ms — skipping correction.");
        }
    }
    else{
        Serial.println("[WARNING] Not enough data to correct rover location.");
    }
    return result;
}
// GpsPosition getCorrectedRoverPosition()
// {
//     GpsPosition result;
//     result.valid = false;

//     if (hasBaseFixed && hasBaseLive && hasRoverLive)
//     {
//         float deltaLat = baseLiveLat - baseFixedLat;
//         float deltaLon = baseLiveLon - baseFixedLon;

//         result.lat = roverLiveLat - deltaLat;
//         result.lon = roverLiveLon - deltaLon;
//         result.valid = true;

//         Serial.println("[RESULT] Corrected Rover Position:");
//         Serial.print("Lat: ");
//         Serial.print(result.lat, 6);
//         Serial.print(" | Lon: ");
//         Serial.println(result.lon, 6);
//     }
//     else
//     {
//         Serial.println("[WARNING] Not enough data to correct rover location.");
//     }

//     return result;
// }
