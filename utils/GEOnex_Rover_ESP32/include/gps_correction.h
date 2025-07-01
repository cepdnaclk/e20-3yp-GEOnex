#ifndef GPS_CORRECTION_H
#define GPS_CORRECTION_H

struct GpsPosition
{
    float lat;
    float lon;
    bool valid;
};

void setManualBaseFixed(float lat, float lon);
void updateBaseFixed(float lat, float lon);
void updateBaseLive(float lat, float lon, String timestamp);
void updateRoverLive(float lat, float lon, String timestramp);
GpsPosition getCorrectedRoverPosition();

#endif
