$(document).ready(function() {
    $('#getSunriseSunset').on('click', function() {
        searchLocation();
    });

    $('#useCurrentLocation').on('click', function() {
        getCurrentLocation();
    });

    function searchLocation() {
        const location = $('#searchLocation').val();
        const apiKey = 'AIzaSyBwAMKFRjZPRybeLrNOIHX9NrAK-U2l7vo';

        // Geocode API request
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`;

        $.ajax({
            url: geocodeUrl,
            method: 'GET',
            success: function(data) {
                if (data.results && data.results.length > 0) {
                    const result = data.results[0].geometry.location;

                    // Get sunrise and sunset data using the obtained coordinates
                    getSunriseSunset(result.lat, result.lng);
                } else {
                    displayError("Location not found.");
                }
            },
            error: function(error) {
                displayError("Error fetching data from Geocode API.");
            }
        });
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Get sunrise and sunset data using the obtained coordinates
                getSunriseSunset(latitude, longitude);
            }, function(error) {
                displayError("Error getting current location.");
            });
        } else {
            displayError("Geolocation is not supported by this browser.");
        }
    }

    function getSunriseSunset(latitude, longitude) {
        // Sunrise Sunset API request
        const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0`;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(data) {
                if (data.results) {
                    const result = data.results;
                    displaySunriseSunset(result);
                } else {
                    displayError("Error fetching sunrise and sunset data.");
                }
            },
            error: function(error) {
                displayError("Error fetching data from Sunrise Sunset API.");
            }
        });
    }

    function displaySunriseSunset(result) {
        // Display today information
        $('#todayResult').html(`
            <p><strong>Sunrise:</strong> ${result.sunrise}</p>
            <p><strong>Sunset:</strong> ${result.sunset}</p>
            <p><strong>Dawn:</strong> ${result.dawn}</p>
            <p><strong>Dusk:</strong> ${result.dusk}</p>
            <p><strong>Day Length:</strong> ${result.day_length} seconds</p>
            <p><strong>Solar Noon:</strong> ${result.solar_noon}</p>
            <p><strong>Timezone:</strong> ${result.timezone}</p>
        `);

        // Display tomorrow information
        $('#tomorrowResult').html(`
            <p><strong>Sunrise:</strong> ${result.sunrise}</p>
            <p><strong>Sunset:</strong> ${result.sunset}</p>
            <p><strong>Dawn:</strong> ${result.dawn}</p>
            <p><strong>Dusk:</strong> ${result.dusk}</p>
            <p><strong>Day Length:</strong> ${result.day_length} seconds</p>
            <p><strong>Solar Noon:</strong> ${result.solar_noon}</p>
            <p><strong>Timezone:</strong> ${result.timezone}</p>
        `);
    }

    function displayError(message) {
        $('#todayResult').html(`<p class="error">${message}</p>`);
        $('#tomorrowResult').html(''); // Clear tomorrow result on error
    }
});
