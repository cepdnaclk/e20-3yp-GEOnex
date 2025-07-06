#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"
#include "gnss_esp.h"
#include "config.h"
#include "button_manager.h"
#include "mpu_manager.h"
#include "mpu_correction.h"
#include "pin_manager.h"
#include "battery_manager.h"
#include "wifi_strength.h"
#include "mqtt_callback.h"
#include "gps_correction.h"
#include "gnss_config.h"
#include "wifi_portal.h"

IMUManager mpu(SDA, SCL);

// GNSS configuration
GNSSConfig gnss;

WiFiPortal wifi("GeoNex-Setup", "12345678", BUTTON_RESET_WIFI);

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);
  // Serial1.begin(GNSS_BAUD_RATE);

  // // Enable GNSS systems: GPS + Galileo + BeiDou +  GLONASS
  // gnss.enableGNSS(Serial1);
  // delay(2000); // Allow GPS to process config

  // Configures pin modes for LEDs and buttons
  setupPins();

  // Initialize WiFi and connect to network
  // connectWiFi();  // Normal method to connect to wifi
  wifi.connect();  // Use WiFiPortal to connect to WiFi

  // Initialize MQTT
  connectMQTT();

  // Initialize MPU module
  mpu.begin();

  // Initialize Battery monitor
  initBatteryMonitor();

  Serial.println("[INFO]  ESP32 Setup complete");

  // Set known fixed base location manually
  // Comment this line to use the auto base fixed location
  setManualBaseFixed(6.1042425, 80.222473);
}

void loop()
{
  GPSData gpsInfo = processGPS();  // Process GPS Data

  mpu.update(); // Update MPU data test

  double lat, lon;
  int satellites;
  String time;

  if (gpsInfo.isValid)
  {
    lat = gpsInfo.latitude;
    lon = gpsInfo.longitude;
    satellites = gpsInfo.satellites;
    time = gpsInfo.time;

    // Print GPS data for tesing
    Serial.print("[Test]  Raw GPS: ");
    Serial.print(lat, 8);
    Serial.print(", ");
    Serial.print(lon, 8);
    Serial.print(", ");
    Serial.print(satellites);
    Serial.print(", ");
    Serial.print(time);

    // Correct GPS coordinates using MPU data
    float pitch = mpu.getPitch();
    float roll = mpu.getRoll();
    correctGPSCoordinates(lat, lon, pitch, roll, POLE_HEIGHT);

    Serial.print("[Test] MPU Corrected GPS: ");
    Serial.print(lat, 8);
    Serial.print(", ");
    Serial.println(lon, 8);

    updateRoverLive(lat, lon, time); // Trigger correction

    GpsPosition corrected = getCorrectedRoverPosition();
  }
  else
  {
    lat = NAN;
    lon = NAN;
    satellites = -1;
    time = "";

    Serial.println("[Test]  GPS data invalid, sent null values.");
  }

  int wifiquality = get_signal_quality();
  Serial.printf("[Test]  WiFi Quality: %d\n", wifiquality);

  int batteryPercentage = getBatteryPercentage(readBatteryVoltage());
  Serial.printf("[Test]  Battery Percentage: %d%%\n", batteryPercentage);

  /* Publish data to MQTT  */


  // Uncomment the next line to enable GPS data publishing
  // publishGPSData(lat, lon, satellites, time);
  // publish_wifi_strength();

  publishData(DEVICE_ID, "OK", lat, lon, satellites, time, 0.0, 0.0, batteryPercentage, wifiquality);

  mqttLoop();
  checkBaseTimeout();

  checkButtonPresses();
  wifi.checkResetButton();

  // Read battery voltage
  // Uncomment the next line to enable battery voltage reading
  // float batteryVoltage = readBatteryVoltage();
  // int batteryPercentage = getBatteryPercentage(batteryVoltage);
  // Serial.printf("[INFO]  Battery Voltage: %.2fV, Percentage: %d%%\n", batteryVoltage, batteryPercentage);

  //Main loop delay
  delay(MAIN_LOOP_DELAY);
}

