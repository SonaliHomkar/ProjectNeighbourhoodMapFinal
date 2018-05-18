 // Create a styles array to use with the map.
    var styles = [
      {
          featureType: 'water',
          stylers: [
            { color: '#19a0d8' }
          ]
      }, {
          featureType: 'administrative',
          elementType: 'labels.text.stroke',
          stylers: [
            { color: '#ffffff' },
            { weight: 6 }
          ]
      }, {
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [
            { color: '#e85113' }
          ]
      }, {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            { color: '#efe9e4' },
            { lightness: -40 }
          ]
      }, {
          featureType: 'transit.station',
          stylers: [
            { weight: 9 },
            { hue: '#e85113' }
          ]
      }, {
          featureType: 'road.highway',
          elementType: 'labels.icon',
          stylers: [
            { visibility: 'off' }
          ]
      }, {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [
            { lightness: 100 }
          ]
      }, {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            { lightness: -100 }
          ]
      }, {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            { visibility: 'on' },
            { color: '#f0e4d3' }
          ]
      }, {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            { color: '#efe9e4' },
            { lightness: -25 }
          ]
      }
    ];


var map;
// Create a new blank array for all the listing markers.
var markers = [];
// This global polygon variable is to ensure only ONE polygon is rendered.
var polygon = null;


/*=============== Model =============*/
//List of Locations
var locations = [
         { title: 'Shivaji Nagar station', location: { lat: 18.532228, lng: 73.851724 } },
         { title: 'Wakdewadi', location: { lat: 18.538923, lng: 73.850851 } },
         { title: 'Kasarwadi', location: { lat: 18.607762, lng: 73.821064 } },
         { title: 'Khadki', location: { lat: 18.563181, lng: 73.840620 } },
         { title: 'Dapodi', location: { lat: 18.581548, lng: 73.832612 } },
         { title: 'Pimpri', location: { lat: 18.623447, lng: 73.802114 } },
         { title: 'Chinchwad', location: { lat: 18.639872, lng: 73.791822 } },
         { title: 'Akurdi', location: { lat: 18.648576, lng: 73.764702 } }
];


/*========= ViewModel ==========*/
var Location = function (data) {
    this.title = data.title;
    this.location = data.location;
   };

var ViewModel = function (){
    var self = this;
    var markers = [];
    var map;
    var drawingManager;
    // Create a new blank array for all the listing markers.
    
    // This global polygon variable is to ensure only ONE polygon is rendered.
    var polygon = null;
    //this.currentLocation = ko.observable(this.locationList()[0]);
    this.query = ko.observable('');
    


    self.locationList = ko.computed(function () {
        var result = [];
        var search = self.query().toLowerCase();
        if(search!="") {
            for(var i =0; i < this.markers.length;i++){
                var markerLocation = this.markers[i];
                //alert(markerLocation.title);
                if(markerLocation.title.toLowerCase().includes(search)){
                    this.markers[i].setVisible(true);;
                    result.push(markerLocation);
                }
                else{
                    this.markers[i].setVisible(false);;
                }

            }
            return result;
        
        } else {
            showListings();
            return locations;
        }
    });


    this.currentLocation = ko.observable(self.locationList()[0]);

    // This function creates markers for the location clicked from the list view
    this.setLocation = function (clickedLocation) {
        self.currentLocation(clickedLocation);
        google.maps.event.trigger(clickedLocation, 'click');

    };


    //this function shows all the markers when clicked button Show listing
    self.showListings = function(){
        showListings();
    }

    //this function hides all the markers when clicked button hide listing
    self.hideListings = function(){
        hideListings();
    }

    //this function sets the polygon when clicked button toggle-drawin
    /*self.toggleDrawing = function(){
        toggleDrawing(drawingManager);
    }*/

    //this function zooms the map to the location entered when clicked button zoom
   this.zoomtoareatext = ko.observable('');

   /*self.zoomtoareatext.subscribe(function(newValue) {
    alert("The new value is " + newValue);
        });*/

   
    //alert(this.zoomtoareatext);
    self.zoomToArea = function(){
        zoomToArea();
    }

    // this function displays the locations and their route if it is within
    // the range of any marker location 
    self.searchWithinTime = function(){
        searchWithinTime();
    }


    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place
    self.textSearchPlaces = function(){
        textSearchPlaces();
    }

    //Listen for the event  fired by button toggle drawing
    self.toggleDrawing = function(drawingManager){
        google.maps.event.trigger(toggleDrawing(drawingManager),'click',{});

    }

    
    


    };




// This function creates markers for each place found in either places search.
function createMarkers(place) {
    
    var largeInfowindow = new google.maps.InfoWindow();
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var bounds = new google.maps.LatLngBounds();
    i = 0;
    // Get the position from the location array.
    var position = place.location;
    var title = place.title;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: title
    });

    //commented following code for accomodating new zomato service
    /*marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow);
    });*/

    marker.addListener('click', function () {
            alert("into createmarker");
            getZomatoApi(this, largeInfowindow,this.position,this.title);
        });

        
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
    map.setCenter(marker.position);
    map.setZoom(11);
    marker.setMap(map);
    markers.push(marker);
   
 }


// This function creates markers for each place found in either places search.
function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
        });
        
        var placeInfoWindow = new google.maps.InfoWindow();
        // If a marker is clicked, do a place details search on it in the next function.
        marker.addListener('click', function () {
            getPlacesDetails(this, placeInfoWindow);
        });

        markers.push(marker);
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}


// This function initializes map when the page is loaded
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 18.532225, lng: 73.851796 },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    
    // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));

    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('zoom-to-area-text'));

    //Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);

    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());


    initializeMaker();
    initializeDrawingManager();

   /* document.getElementById('toggle-drawing').addEventListener('click', function () {
        toggleDrawing(drawingManager);
    }); */

    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.
    searchBox.addListener('places_changed', function () {
        searchBoxPlaces(this);
    });

    ko.applyBindings(new ViewModel());
}

//end initmap function

function initializeDrawingManager(){
    // Initialize the drawing manager.
        drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
              google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });
        // Add an event listener so that the polygon is captured,  call the
        // searchWithinPolygon function. This will show the markers in the polygon,
        // and hide any outside of it.
    
      drawingManager.addListener('overlaycomplete', function (event) {
            
        // First, check if there is an existing polygon.
        // If there is, get rid of it and remove the markers
        if (polygon) {
            polygon.setMap(null);
            hideListings(markers);
        }
        // Switching the drawing mode to the HAND (i.e., no longer drawing).
        drawingManager.setDrawingMode(null);
        // Creating a new editable polygon from the overlay.
        polygon = event.overlay;
        polygon.setEditable(true);
        // Searching within the polygon.
        searchWithinPolygon();
        // Make sure the search is re-done if the poly is changed.
        polygon.getPath().addListener('set_at', searchWithinPolygon);
        polygon.getPath().addListener('insert_at', searchWithinPolygon);
    });


}


function initializeMaker(){
    var largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            
        });
        
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        //commented following code for accomodating new zomato service
        /*
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });*/

        marker.addListener('click', function () {
            //alert("into initializemarker");
            getZomatoApi(this, largeInfowindow,this.position,this.title);
        });

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
    }
}


// This function creates marker for the places searched
function createMarkersForPlace(locations) {
    
    
    var largeInfowindow = new google.maps.InfoWindow();
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var bounds = new google.maps.LatLngBounds();
    
    
    i = 0;
        // Get the position from the location array.
        var position = locations.location;
        var title = locations.title;
        
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: title
        });
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
        
        marker.addListener('mouseover', function () {
                this.setIcon(highlightedIcon);
            });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
        map.setCenter(marker.position);
        marker.setMap(map);
        markers.push(marker);

}


// This function creates icons for markers
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                  nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                  document.getElementById('pano'), panoramaOptions);
                
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                  '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
         streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}


// This function shows all the markers
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        markers[i].setVisible(true);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);


}// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


// This shows and hides (respectively) the drawing options.
function toggleDrawing(drawingManager) {
    if (drawingManager.map) {
        drawingManager.setMap(null);
        // In case the user drew anything, get rid of the polygon
        if (polygon !== null) {
            polygon.setMap(null);
        }
    } else {
        drawingManager.setMap(map);
    }
}


// and shows only the ones within it. This is so that the
// user can specify an exact area of search.
function searchWithinPolygon() {
    for (var i = 0; i < markers.length; i++) {
        if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
            markers[i].setMap(map);
        } else {
            markers[i].setMap(null);
        }
    }
}


// This function zoom out map for the place searched
function zoomToArea() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder;
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-to-area-text').value;
    
    if (address == '') {
        window.alert('You must enter an area or address');
    }
    else {
        // Geocode the address/area entered to get the center. Then, center the map
        // on it and zoom in
        geocoder.geocode({

            address: address
            //componentRestrictions: { locality: 'New York' }
        }, function (result, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(result[0].geometry.location);
                map.setZoom(15);
            } else {
                window.alert('We could not find that location - try entering a more' +
                            ' specific place.');
            }
        });

    }

}
// This function allows the user to input a desired travel time, in
// minutes, and a travel mode, and a location - and only show the listings
// that are within that travel time (via that travel mode) of the location
function searchWithinTime() {
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-within-time-text').value;

    // Check to make sure the place entered isn't blank
    if (address == '') {
        window.alert('Please enter address');
    } else {
        hideListings();
        var origins = [];
        for (var i = 0; i < markers.length; i++) {
            origins[i] = markers[i].position;
        }
        var destination = address;
        var mode = document.getElementById('mode').value;

        distanceMatrixService.getDistanceMatrix({
            origins: origins,
            destinations: [destination],
            travelMode: google.maps.TravelMode[mode],
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                window.alert('Error was : ' + status)
            } else {
                displayMarkersWithinTime(response);
            }
        }
        )

    }

}
// This function will go through each of the results, and,
// if the distance is LESS than the value in the picker, show it on the map.
function displayMarkersWithinTime(response) {
    var maxDuration = document.getElementById('max-duration').value;
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var atLeastOne = false;

    for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < destinations.length; j++) {
            var element = results[j];
            if (element.status === "OK") {
                var distanceText = element.distance.text;
                var duration = element.duration.value / 60;
                var durationText = element.duration.text;

                if (duration <= maxDuration) {
                    markers[i].setMap(map);
                    atLeastOne = true;

                    var infowindow = new google.maps.InfoWindow({
                        content: durationText + ' away, ' + distanceText +
                            '<div><input type=\"button\" value=\"View Route \" onclick=' +
                            '\"displayDirections(&quot;' + origins[i] + '&quot;);\">' +
                            '</input></div>'
                    });

                    infowindow.open(map, markers[i]);

                    markers[i].infowindow = infowindow;
                    google.maps.event.addListener(markers[i], 'click', function () {
                        this.infowindow.close();
                    });
                }
            }
        }
    }

    if (!atLeastOne) {
        window.alert('We could not find any locations within that distance!');
    }
}
// This function displays the direction for the route from the selected place to the markers within the range
function displayDirections(origin) {
    hideListings();
    var directionsService = new google.maps.DirectionsService;
    var destinationAddress = document.getElementById('search-within-time-text').value;
    var mode = document.getElementById('mode').value;
    directionsService.route({
        origin: origin,
        destination: destinationAddress,
        travelMode: google.maps.TravelMode[mode]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'green'
                }
            });
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

// This function fires when the user selects a searchbox picklist item.
// It will do a nearby search using the selected query string or place.
function searchBoxPlaces(searchBox) {
    hideListings(markers);
    var places = searchBox.getPlaces();
    createMarkersForPlaces(places);
    if (places.length == 0) {
        window.alert('We did not find any places matching that search!');
    }
}

// This function firest when the user select "go" on the places search.
// It will do a nearby search using the entered query string or place.
function textSearchPlaces() {
    var bounds = map.getBounds();
    hideListings(markers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
        query: document.getElementById('places-search').value,
        bounds: bounds
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results);
        }
    });
}
// This function creates markers for each place found in either places search.
function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
        });
        
        var placeInfoWindow = new google.maps.InfoWindow();
        // If a marker is clicked, do a place details search on it in the next function.
        marker.addListener('click', function () {
            getPlacesDetails(this, placeInfoWindow);
        });

        markers.push(marker);
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}
// This function displays infowindow with place details
function getPlacesDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again.
            infowindow.marker = marker;
            var innerHTML = '<div>';
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
                innerHTML += '<br><br><strong>Hours:</strong><br>' +
                    place.opening_hours.weekday_text[0] + '<br>' +
                    place.opening_hours.weekday_text[1] + '<br>' +
                    place.opening_hours.weekday_text[2] + '<br>' +
                    place.opening_hours.weekday_text[3] + '<br>' +
                    place.opening_hours.weekday_text[4] + '<br>' +
                    place.opening_hours.weekday_text[5] + '<br>' +
                    place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                    { maxHeight: 100, maxWidth: 200 }) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    });
}




window.googleError = function () {
  document.getElementById("errormsg").innerHTML = "There has been an error loading the map. Please refresh the page to try again";
};

// Fetches place description from Wikipedia
function getZomatoApi(marker,infowindow,position,title) {
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    
        var appUrl = "https://developers.zomato.com/api/v2.1/locations?apikey=1bdc7a9f5488e30c040d0be53e316511&radius&query=" + title + "&lat=" + position.lat 
                    + "&lon=" + position.lng + "&count=5";
        
        
        $.ajax({
            method : "GET",
            url: appUrl,
            success: function(data) {
                    placeId: marker.id
                    infowindow.marker = marker;
                    var innerHTML = '<div><b>Nearest places</b><br>';
                    for(var i =0;i< data.location_suggestions.length;i++)
                    {
                        
                        if (data.location_suggestions[i].title) {
                            innerHTML += data.location_suggestions[i].title + '<br>';
                        }
                    }
                    innerHTML += '</div>';
                    infowindow.setContent(innerHTML);
                    infowindow.open(map, marker);
                    // Make sure the marker property is cleared if the infowindow is closed.
                    infowindow.addListener('closeclick', function () {
                        infowindow.marker = null;
                    });   
            },
            error: function(xhr, status, error) {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                  '<div>No places found</div>');
            }
        });

        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            marker.setAnimation(null);
            }).bind(marker), 1400);

    }
}

