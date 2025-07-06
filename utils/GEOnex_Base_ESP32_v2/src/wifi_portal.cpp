#include "wifi_portal.h"
#include <WiFi.h>
#include <WiFiManager.h>
#include"config.h"

WiFiPortal::WiFiPortal(const char *apName, const char *apPassword, int resetButtonPin)
{
    _apName = apName;
    _apPassword = apPassword;
    _resetPin = resetButtonPin;

    if (_resetPin != -1)
    {
        pinMode(_resetPin, INPUT_PULLUP);
    }
}

void WiFiPortal::connect()
{
    Serial.begin(115200);
    delay(1000);

    WiFi.mode(WIFI_STA);

    WiFiManager wm;
    bool res = wm.autoConnect(_apName, _apPassword);

    if (!res)
    {
        Serial.println("Failed to connect to WiFi");
    }
    else
    {
        Serial.println("Connected to WiFi!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        digitalWrite(LED_WIFI, HIGH);
    }
}

void WiFiPortal::checkResetButton()
{
    if (_resetPin == -1)
        return;

    // Simple debounce using millis
    if (millis() - _lastCheck < 200)
        return;
    _lastCheck = millis();

    if (digitalRead(_resetPin) == HIGH && !_resetHandled)
    {
        _resetHandled = true; // prevent re-trigger

        Serial.println("[RESET] Resetting WiFi credentials via WiFiManager...");
        delay(300); // for stability

        WiFiManager wm;
        wm.resetSettings(); // clear stored credentials
        delay(500);
        ESP.restart(); // restart to re-init WiFi setup
    }

    // Reset flag if button released
    if (digitalRead(_resetPin) == LOW)
    {
        _resetHandled = false;
    }
}
