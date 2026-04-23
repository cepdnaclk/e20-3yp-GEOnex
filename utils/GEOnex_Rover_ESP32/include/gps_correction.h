#ifndef GPS_CORRECTION_H
#define GPS_CORRECTION_H

struct GpsPosition
{
    double lat;
    double lon;
    bool valid;
};

void setManualBaseFixed(double lat, double lon);
void updateBaseFixed(double lat, double lon);
void updateBaseLive(double lat, double lon, String timestamp);
void updateRoverLive(double lat, double lon, String timestramp);
GpsPosition getCorrectedRoverPosition();

#endif
