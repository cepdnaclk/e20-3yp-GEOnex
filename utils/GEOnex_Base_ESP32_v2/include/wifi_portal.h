#ifndef WIFI_PORTAL_H
#define WIFI_PORTAL_H

#include <Arduino.h>

class WiFiPortal
{
public:
    WiFiPortal(const char *apName = "GeoNex-Setup", const char *apPassword = "12345678", int resetButtonPin = -1);
    void connect();
    void checkResetButton(); // Call this in loop()

private:
    const char *_apName;
    const char *_apPassword;
    int _resetPin;
    bool _resetHandled = false;
    unsigned long _lastCheck = 0;
};

#endif
