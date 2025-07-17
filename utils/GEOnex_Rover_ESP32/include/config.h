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

// #define WIFI_SSID "Eng-Student"
// #define WIFI_PASS "3nG5tuDt"

// #define WIFI_SSID "Malinga' internet"
// #define WIFI_PASS "tgfb6053"

#define WIFI_SSID "Lord of the Ping"
#define WIFI_PASS "GS200123"

// MQTT Broker
#define MQTT_HOST "a1qulasp0wzg24-ats.iot.eu-north-1.amazonaws.com"
#define MQTT_PORT 8883
#define DEVICE_ID "rover123"

// MQTT Topics (subscribed)
#define MQTT_TOPIC_COMMAND "GEOnex/siteSurvey/commands/" DEVICE_ID

// MQTT Topics (published)
// #define MQTT_TOPIC_DATA_LIVE "GEOnex/siteSurvey/data/" DEVICE_ID "/gps/live"
// #define MQTT_TOPIC_DATA_LIVE "esp8266/pub"
#define MQTT_TOPIC_DATA_LIVE "tracking/r/live/rover123/data"
#define MQTT_TOPIC_DATA_UTILS "update/d/status/rover123/data"

#define MQTT_TOPIC_SUB_LIVE "tracking/r/live/device123/data"
#define MQTT_TOPIC_SUB_FIXED "fixing/b/live/device123/data"

// Hardware Pins
#define GPS_RX 16
#define GPS_TX 17

// LED Pins
#define LED_POWER 4 // Power Indicator (Always ON)
#define LED_WIFI 2  // WiFi Status (ON if connected, blinks if connecting)
#define LED_MQTT 5 // MQTT Publish Indicator (Blinks on publish)
#define LED_GPS 18   // GPS RTK Fix Indicator (ON when fix, blinks in float mode)

// BUTTON Pins
#define BUTTON_RESET_WIFI 13 // Reset WiFi
#define BUTTON_SEND_GPS 14   // Manually Send GPS Data

// MPU9250 Pins
#define SDA 21 
#define SCL 22

// Battery Monitor Pin
#define BATTERY_PIN 35 // ADC pin for battery voltage monitoring

// Angle Convertions 
#define RAD_TO_DEG 57.295779513082320876798154814105
#define DEG_TO_RAD 0.017453292519943295769236907684886
#define RAD_TO_MIL 3437.746775
#define MIL_TO_RAD 0.0002908882086657216

// poleHeight (in meters)
#define POLE_HEIGHT 1.0 // Height of the GPS pole in meters

// Publishing Intervals (ms)
#define PUBLISH_INTERVAL 2000  

// Delay Settings
#define POWERUP_DELAY 5000         // Delay for power-up (in milliseconds)
#define MAIN_LOOP_DELAY 500        // Delay for main loop (in milliseconds)
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

// GPS time Settings
#define UTCOFFSETHOURS 5
#define UTCOFFSETMINS 30

#endif // CONFIG_H



