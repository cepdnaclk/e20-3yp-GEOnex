import proj4 from 'proj4';

// Define projections once
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
proj4.defs("EPSG:5235", "+proj=tmerc +lat_0=7 +lon_0=80.7717111111111 +k=0.9999238418 +x_0=500000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");

/**
 * Converts WGS84 coordinates to SLD99 (Sri Lanka Grid 1999).
 * @param {number} latitude - Latitude in decimal degrees.
 * @param {number} longitude - Longitude in decimal degrees.
 * @returns {{easting: number, northing: number}} - Easting and Northing in meters.
 */
function transformToSLD99(latitude, longitude) {
    const [easting, northing] = proj4('EPSG:4326', 'EPSG:5235', [longitude, latitude]);
    return {
        easting: parseFloat(easting.toFixed(3)),
        northing: parseFloat(northing.toFixed(3))
    };
}


export {transformToSLD99};