#include "wifi_portal.h"
#include <WiFi.h>
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager

WiFiPortal::WiFiPortal(const char *apName, const char *apPassword)
{
    _apName = apName;
    _apPassword = apPassword;
}

void WiFiPortal::connect()
{
    Serial.begin(115200);
    delay(1000);

    WiFi.mode(WIFI_STA); // Station mode only

    WiFiManager wm;

    // Optional: Uncomment this if you want to reset saved credentials
    // wm.resetSettings();

    bool res = wm.autoConnect(_apName, _apPassword);

    if (!res)
    {
        Serial.println("❌ Failed to connect to WiFi");
        // Optionally restart or go to deep sleep
        // ESP.restart();
    }
    else
    {
        Serial.println("✅ Connected to WiFi!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
    }
}
