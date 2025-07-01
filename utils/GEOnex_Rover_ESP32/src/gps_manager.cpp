#include "gps_manager.h"
#include "mqtt_manager.h"
#include <gnss_esp.h>
#include "config.h"

GPSModule gpsModule(GPS_RX, GPS_TX, GNSS_BAUD_RATE);

GPSData processGPS()
{
  gpsModule.processGPSData();
  Serial.println("\n[INFO] Processing GPS data...");

  GPSData gpsdata = {0.0, 0.0, 0, "null", false};

  if (gpsModule.hasNewLocation())
  {

    gpsdata.latitude = gpsModule.getLatitude();
    gpsdata.longitude = gpsModule.getLongitude();
    gpsdata.satellites = gpsModule.getSatellites();
    gpsdata.time = gpsModule.getLocalTime(UTCOFFSETHOURS, UTCOFFSETMINS);
    gpsdata.isValid = true;

    Serial.print("Latitude: ");
    Serial.print(gpsdata.latitude, 8);

    Serial.print(", Longitude: ");
    Serial.print(gpsdata.longitude, 8);

    Serial.print(" Satellites: ");
    Serial.print(gpsdata.satellites);

    Serial.print(" Time: ");
    Serial.println(gpsdata.time);

    handleGPSLED(gpsdata.satellites);
  }
  else
  {
    digitalWrite(LED_GPS, LOW);
    Serial.println("[WAIT]  Waiting for GPS fix...");
    delay(GPS_LED_DELAY);
    digitalWrite(LED_GPS, HIGH);
    //digitalWrite(LED_GPS, !digitalRead(LED_GPS)); // Blink in float mode
  }
  return gpsdata; // Return the struct containing GPS values
}

void handleGPSLED(int sat)
{
  if (sat >= MIN_SATELLITES)
  {
    digitalWrite(LED_GPS, HIGH);
  }
  else
  {
    digitalWrite(LED_GPS, !digitalRead(LED_GPS)); // Blink in float mode
  }
}
