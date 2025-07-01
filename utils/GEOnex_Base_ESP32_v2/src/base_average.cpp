#include <Arduino.h>
#include "gnss_esp.h"
#include "WiFi.h"
#include "TinyGPSPlus.h"
#include <BasicLinearAlgebra.h>
#include "config.h"
#include "gps_manager.h"
#include "base_average.h"

// Create GPS module instance

double lat_ave_buffer[AVERAGE_SAMPLES];
double lon_ave_buffer[AVERAGE_SAMPLES];
double sat_ave_buffer[AVERAGE_SAMPLES];
String time_ave_buffer[AVERAGE_SAMPLES];
double aveLat, aveLon;

AVEGData computeAveragePosition()
{
    AVEGData avegdata = {0.0, 0.0, 0, "null", false};
    int i = 0;

    while (i < AVERAGE_SAMPLES)
    {
        GPSData gpssample = processGPS();
        if (gpssample.satellites > 6)
        {
            lat_ave_buffer[i] = gpssample.latitude;
            lon_ave_buffer[i] = gpssample.longitude;
            sat_ave_buffer[i] = gpssample.satellites;
            time_ave_buffer[i] = gpssample.time;
            i++;
            Serial.print("Sample collected: ");
            Serial.println(i);
            delay(500);
        }
    }

    if (i == AVERAGE_SAMPLES)
    {
        avegdata.latitude = calculateMean(lat_ave_buffer, AVERAGE_SAMPLES);
        avegdata.longitude = calculateMean(lon_ave_buffer, AVERAGE_SAMPLES);
        avegdata.satellites = calculateMean(sat_ave_buffer, AVERAGE_SAMPLES);
        avegdata.time = time_ave_buffer[AVERAGE_SAMPLES / 2]; // Take the middle time

        Serial.println("Base Station Position Stabilized! mean calculation");
        Serial.print("Final Coordinates: ");
        Serial.print(avegdata.latitude, 8);
        Serial.print(", ");
        Serial.print(avegdata.longitude, 8);
        Serial.print(", ");
        Serial.print("Satellites: ");
        Serial.print(avegdata.satellites);
        Serial.print(", ");
        Serial.print("Time: ");
        Serial.println(avegdata.time);

        // fixeddata.latitude = kalmanFilter(lat_buffer, BUFFER_SIZE);
        // fixeddata.longitude = kalmanFilter(lon_buffer, BUFFER_SIZE);

        // Serial.println("Base Station Position Stabilized! kalmanFilter");
        // Serial.print("Final Coordinates: ");
        // Serial.print(fixeddata.latitude, 8);
        // Serial.print(", ");
        // Serial.println(fixeddata.longitude, 8);

        avegdata.isValid = true;
    }
    return avegdata;
}