document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	
	$('#deviceready').css('display', 'block');
	
	//shake.startWatch(onShake);
	onShake();
}

function onShake() {
	
	//shake.endWatch();
	
	$('#deviceready').fadeOut(600);
	navigator.geolocation.getCurrentPosition(positionFound, error);
	
}

function positionFound(position) {

	var radius = 2000;
	
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	var loc = new google.maps.LatLng(lat,lon);

	map = new google.maps.Map(document.getElementById('map'), {
	      center: loc,
	      zoom: 15
	    });
	
	service = new google.maps.places.PlacesService(map);
	var request = {
		location: loc,
		radius: radius,
		types: ['park', 'campground']
	}
	service.nearbySearch(request, renderResults);
	
}

function renderResults(results, status) {
	
	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    
		var container = $("#content");
		
		$("#content").html(results[0].photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35}));
		
		var template = Handlebars.compile($("#searchContent").html());
		container.append (template(results));
		container.fadeIn(500);
	
	} else error();
	
}

function error() {
	
	$('#content').html("No connection");
	
}