function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 }
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));


    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    dragElement(document.getElementById(("floating-panel")));
    document.getElementById('submitButton').addEventListener('click', onChangeHandler);
    document.getElementById('addWaypointButton').addEventListener('click', waypointHandler);
}

function waypointHandler(){
    var form = document.getElementById('routesForm');
    var end = document.getElementById('end');
    var template = document.getElementById('waypointTemplate');
    var item = template.content.querySelector('.waypoint');
    var newWaypoint = document.importNode(item, true);
    form.insertBefore(newWaypoint, end);
}

function concatAddress(container) {
    var street = container.querySelector('.street').value;
    var city = container.querySelector('.city').value;
    var state = container.querySelector('.state').value;
    street = street.replace(' ', '+');
    return street + '+' + city + '+' + state;
}

function createWaypointsArray () {
    var waypoints = document.querySelectorAll('.waypoint');
    var waypointsArray = [];

    waypoints.forEach(function(waypoint) {
        var obj = {location: concatAddress(waypoint)};

        waypointsArray.push(obj);
    });

    console.log(waypointsArray);
    return waypointsArray;
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypointsArray = [];
    
    directionsService.route({
        origin: concatAddress(document.getElementById('start')),
        destination: concatAddress(document.getElementById('end')),
        waypoints: createWaypointsArray(),
        travelMode: document.getElementById('mode').value

    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
