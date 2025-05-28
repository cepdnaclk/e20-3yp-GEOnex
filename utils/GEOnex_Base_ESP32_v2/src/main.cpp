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
#include "base_calibration.h"
#include "battery_manager.h"
#include "pin_manager.h"


void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);

  // Configures pin modes for LEDs and buttons
  setupPins();

  // Initialize WiFi and connect to network
  connectWiFi();

  // Initialize MQTT
  connectMQTT();

  // Initialize Battery monitor
  initBatteryMonitor();

  Serial.println("[INFO]  ESP32 Setup complete");

  // Base Calibration
  FIXEDData fix = computePrecisePosition();
  if (fix.isValid)
  {
    publishBaseFix(fix.latitude, fix.longitude);
  }
}

void loop()
{
  // Process GPS Data
  GPSData gpsInfo = processGPS();

  double lat, lon;
  int satellites;
  String time;


  if (gpsInfo.isValid)
  {
    lat = gpsInfo.latitude;
    lon = gpsInfo.longitude;
    satellites = gpsInfo.satellites;
    time = gpsInfo.time;

    // Print GPS data for testing
    Serial.printf("[Test]  Raw GPS: Lat: %.6f, Lon: %.6f, Satellites: %d, Time: %s\n", lat, lon, satellites, time.c_str());
  }
  else
  {
    lat = NAN;
    lon = NAN;
    satellites = -1;
    time = "";
    Serial.println("[Test]  No valid GPS data received.");
  }

  /* Publish data to MQTT  */
  publishGPSData(lat, lon, satellites, time);
  

  mqttLoop();

  checkButtonPresses();

  int batteryPercentage = getBatteryPercentage(readBatteryVoltage());
  Serial.printf("[Test]  Battery Percentage: %d%%\n", batteryPercentage);

  //Main loop delay
  delay(MAIN_LOOP_DELAY);
}