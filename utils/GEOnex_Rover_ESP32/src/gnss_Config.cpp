#include "gnss_config.h"

// UBX-CFG-GNSS: Enable GPS + Galileo + BeiDou (disable others)
uint8_t ubxGNSSConfig[] = {
    0xB5, 0x62, // UBX header
    0x06, 0x3E, // Class + ID: CFG-GNSS
    0x20, 0x00, // Payload length: 32 bytes (0x20)

    0x00, // msgVer
    0x03, // numTrkChHw
    0x00, // numTrkChUse
    0x07, // numConfigBlocks

    // GNSS config blocks (7 × 4 bytes each)
    0x00, 0x00, 0x10, 0x01, // GPS      (enabled)
    0x01, 0x00, 0x03, 0x00, // SBAS     (disabled)
    0x02, 0x00, 0x08, 0x01, // Galileo  (enabled)
    0x03, 0x00, 0x08, 0x00, // BeiDou   (enabled)
    0x04, 0x00, 0x00, 0x00, // IMES     (disabled)
    0x05, 0x00, 0x03, 0x00, // QZSS     (disabled)
    0x06, 0x00, 0x10, 0x01,  // GLONASS (enabled)

    0x00,
    0x00 // Placeholder for checksum
};

void calcChecksum(uint8_t *msg, size_t len, uint8_t &ckA, uint8_t &ckB)
{
    ckA = 0;
    ckB = 0;
    for (size_t i = 2; i < len - 2; i++) // Skip 0xB5 0x62 and checksum bytes
    {
        ckA += msg[i];
        ckB += ckA;
    }
}

void sendUBX(uint8_t *msg, size_t len, Stream &serial)
{
    uint8_t ckA, ckB;
    calcChecksum(msg, len, ckA, ckB);
    msg[len - 2] = ckA;
    msg[len - 1] = ckB;

    serial.write(msg, len);
}

void GNSSConfig::enableGNSS(Stream &serial)
{
    sendUBX(ubxGNSSConfig, sizeof(ubxGNSSConfig), serial);
    Serial.println("[INFO]  GNSS systems enabled: GPS, Galileo, BeiDou, GLONASS");
}
