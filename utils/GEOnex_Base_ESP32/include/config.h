#ifndef CONFIG_H
#define CONFIG_H

// Serial Communications
#define SERIAL_BAUD_RATE 115200
#define GNSS_BAUD_RATE 9600


// WiFi Credentials
// #define WIFI_SSID "Ministry Of Wifi"
// #define WIFI_PASS "ExpectoRouter"

// #define WIFI_SSID "Samuditha's iPhone"
// #define WIFI_PASS "Gnpss2001"

#define WIFI_SSID "Eng-Student"
#define WIFI_PASS "3nG5tuDt"

// MQTT Broker
#define MQTT_HOST "a1qulasp0wzg24-ats.iot.eu-north-1.amazonaws.com"
#define MQTT_PORT 8883
#define DEVICE_ID "rover1234"

// MQTT Topics (subscribed)
#define MQTT_TOPIC_COMMAND "GEOnex/siteSurvey/commands/" DEVICE_ID

// MQTT Topics (published)
// #define MQTT_TOPIC_DATA_LIVE "GEOnex/siteSurvey/data/" DEVICE_ID "/gps/live"
#define MQTT_TOPIC_DATA_LIVE "esp8266/pub"

// Hardware Pins
#define GPS_RX 16
#define GPS_TX 17

// LED Pins
#define LED_POWER 2 // Power Indicator (Always ON)
#define LED_WIFI 4  // WiFi Status (ON if connected, blinks if connecting)
#define LED_MQTT 5 // MQTT Publish Indicator (Blinks on publish)
#define LED_GPS 18   // GPS RTK Fix Indicator (ON when fix, blinks in float mode)

// BUTTON Pins
#define BUTTON_RESET_WIFI 19 // Reset WiFi
#define BUTTON_SEND_GPS 23   // Manually Send GPS Data

// Publishing Intervals (ms)
#define PUBLISH_INTERVAL 2000  

// Delay Settings
#define POWERUP_DELAY 5000         // Delay for power-up (in milliseconds)
#define MAIN_LOOP_DELAY 2000        // Delay for main loop (in milliseconds)
#define WIFI_RETRY_DELAY 1000       // Delay for WiFi connection retries (in milliseconds)
#define MQTT_RETRY_DELAY 1000       // Delay for MQTT connection retries (in milliseconds)
#define GPS_UPDATE_DELAY 2000       // Delay between GPS updates (in milliseconds)
#define BUTTON_DEBOUNCE_DELAY 50    // Debounce delay for buttons (in milliseconds)
#define MQTT_LED_DELAY 200          // Delay for MQTT LED blink (in milliseconds)
#define GPS_LED_DELAY 200           // Delay for GPS LED blink (in milliseconds)
#define GPS_FIX_TIMEOUT 30000       // Timeout for GPS fix (in milliseconds)
#define MQTT_PUBLISH_DELAY_MOCK 1000     // Delay for MQTT publish (in milliseconds)

// GPS Settings
#define MIN_SATELLITES 5           // Minimum number of satellites required for RTK fix

// Timeouts
#define WIFI_TIMEOUT 30000          // Timeout for WiFi connection (in milliseconds)
#define MQTT_TIMEOUT 30000          // Timeout for MQTT connection (in milliseconds)

//Base Calibration
#define BUFFER_SIZE 50

#endif // CONFIG_H



