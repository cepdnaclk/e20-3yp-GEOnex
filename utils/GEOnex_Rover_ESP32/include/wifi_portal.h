#ifndef WIFI_PORTAL_H
#define WIFI_PORTAL_H

#include <Arduino.h>

class WiFiPortal
{
public:
    WiFiPortal(const char *apName = "GeoNex-Setup", const char *apPassword = "12345678");
    void connect();

private:
    const char *_apName;
    const char *_apPassword;
};

#endif
