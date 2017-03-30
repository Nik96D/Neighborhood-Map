// harcoded array of place objects
var places = [{
    title: "Marburger Schloss",

    location: {
        lat: 50.8101305,
        lng: 8.767128400000047
    }
}, {
    title: "Elisabethkirche",

    location: {
        lat: 50.8148856,
        lng: 8.77011749999997
    }
}, {
    title: "Spiegelslustturm",
    wikiName: "Spiegelslustturm",
    location: {
        lat: 50.814991,
        lng: 8.789190
    }
}, {
    title: "Philipps Universit\u00e4t ",

    location: {
        lat: 50.808299,
        lng: 8.771940
    }
}, {
    title: "Hexenturm",

    location: {
        lat: 50.810682,
        lng: 8.765831
    }
}, {
    title: "Hirsefeldsteg",

    location: {
        lat: 50.803662,
        lng: 8.772469
    }
}];
var menueButton = 0;


// declare viewmodel as an object literal
var viewModel = {
    places: ko.observable(places),
    query: ko.observable(''),
    wikiText: ko.observable(),

    // connects the list item with the markers  
    markerAction: function() {
        var marker = this.marker;
        google.maps.event.trigger(marker, "click");
    },

    // hides the left side-bar
    hamburgerHide: function() {

        if (menueButton == 0) {
            document.getElementsByClassName("list")[0].style.display = "none";
            google.maps.event.trigger(map, "resize");
            menueButton = 1;
        } else {
            document.getElementsByClassName("list")[0].style.display = "";
            menueButton = 0;
        }
    },
};

// filters search
viewModel.searchResults = ko.computed(function() {

    var query = viewModel.query().toLowerCase();
    return viewModel.places().filter(function(place) {

        var title = place.title.toLowerCase();
        var match = title.indexOf(query) >= 0;
        var marker = place.marker;

        if (marker) {
            marker.setVisible(match);
        };
        return match;
    });

});
ko.applyBindings(viewModel);

var map;
var styles = [{
    elementType: "geometry",
    stylers: [{
        color: "#ebe3cd"
    }]
}, {
    elementType: "labels.text.fill",
    stylers: [{
        color: "#523735"
    }]
}, {
    elementType: "labels.text.stroke",
    stylers: [{
        color: "#f5f1e6"
    }]
}, {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{
        color: "#c9b2a6"
    }]
}, {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [{
        color: "#dcd2be"
    }]
}, {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#ae9e90"
    }]
}, {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{
        color: "#dfd2ae"
    }]
}, {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{
        color: "#dfd2ae"
    }]
}, {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#93817c"
    }]
}, {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{
        color: "#a5b076"
    }]
}, {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#447530"
    }]
}, {
    featureType: "road",
    elementType: "geometry",
    stylers: [{
        color: "#f5f1e6"
    }]
}, {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{
        color: "#fdfcf8"
    }]
}, {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{
        color: "#f8c967"
    }]
}, {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{
        color: "#e9bc62"
    }]
}, {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{
        color: "#e98d58"
    }]
}, {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [{
        color: "#db8555"
    }]
}, {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#806b63"
    }]
}, {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{
        color: "#dfd2ae"
    }]
}, {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#8f7d77"
    }]
}, {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [{
        color: "#ebe3cd"
    }]
}, {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{
        color: "#dfd2ae"
    }]
}, {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{
        color: "#b9d3c2"
    }]
}, {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#92998d"
    }]
}];
var markers = [];

// makes google maps error message
function googleError() {
    var error = document.getElementById('map');
    error.innerHTML = error.innerHTML + 'Map failed to load.';
};

//initializes the google map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        styles: styles,
        zoom: 15,
        mapTypeControl: false,
        center: {
            lat: 50.812311,
            lng: 8.772312
        }
    });

    var bounds = new google.maps.LatLngBounds();
    var defaultIcon = createMarker('E62117');
    var highlightedIcon = createMarker('0091ff');
    var markerInfoPopup = new google.maps.InfoWindow();

    // this loop creates the marker objects
    for (var i = 0; i < places.length; i++) {
        var title = places[i].title;
        var position = places[i].location;

        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            map: map,
            icon: defaultIcon,
            id: i

        });

        places[i].marker = marker;
        viewModel.places()[i].marker = marker;

        // the marker you have clicked starts bouncing because of this function
        function bouncingMarker(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);

            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null)
                }, 2100);
            }
        }
        markers.push(marker);

        //changes the marker color when you hover over it with your mouse
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        //opens the marker infowindow when you click a marker
        marker.addListener('click', function() {
            openmarkerInfoPopup(this, markerInfoPopup);
            bouncingMarker(this);
        });

        // changes the marker color to the default color when move your mouse away from it
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }
}

// makes marker infowindow and generates streetview-image
function openmarkerInfoPopup(marker, infoPopup) {
    if (infoPopup.marker != marker) {
        infoPopup.marker = marker;
        infoPopup.setContent('');
        infoPopup.addListener('closeclick', function() {
            infoPopup.marker = null;
        });
        var popupRadius = 62;
        var PictureStreetView = new google.maps.StreetViewService();

        //opens wikipedia article  
        function loadWikipedia() {
            var wikiUrl = 'http://de.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
            var wikiRequestTimeout = setTimeout(function() {
                $wikiElem.text("failed to get wikipedia resources");
            }, 7000);
            $.ajax({
                url: wikiUrl,
                dataType: "jsonp",
                
                success: function(response) {
                    console.log(response[2][0]);
                    var myText = response[2][0];
                    var articleList = marker.title;

                    if (myText) {
                        viewModel.wikiText(myText);
                    } else {
                        viewModel.wikiText("no response received");
                    }
                    clearTimeout(wikiRequestTimeout);
                }
            });
        }
        loadWikipedia();

        //opens a google streetview image when within the marker infowindow
        function OpenStreetViewPicture(data, condition) {
            if (condition == google.maps.StreetViewStatus.OK) {
                var streetViewPosition = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    streetViewPosition, marker.position);
                infoPopup.setContent('<div>' + marker.title + '</div><div id="popup"></div>');
                var popupStyle = {
                    position: streetViewPosition,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('popup'), popupStyle);
            } else {
                infoPopup.setContent('<div>' + marker.title + '</div>' + '<div>(no street-view)</div>');
            }
        }
        PictureStreetView.getPanoramaByLocation(marker.position, popupRadius, OpenStreetViewPicture);
        infoPopup.open(map, marker);
    }
}

// creates the marker icon
function createMarker(markerColor) {
    var markerIcon = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(25, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(11, 35),
        new google.maps.Size(25, 34));
    return markerIcon;
}