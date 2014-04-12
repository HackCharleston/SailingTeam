document.addEventListener('deviceready', onDeviceReady, false);
var map;
function onDeviceReady() {
	
	$('#deviceready').css('display', 'block');
	
	shake.startWatch(onShake);
	$('#deviceready').on('tap', function(event) {
		onShake();
	});
	
}

function onShake() {
	
	shake.endWatch();
	
	$('#deviceready').fadeOut(600);
	$('header').animate({
		top: '0px',
		opacity: 1
	}, 600);
	$('#loading').css('display', 'block');
	
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

		var template = Handlebars.compile($("#searchContent").html());
		$("#search-list").append (template(results));
		var template = Handlebars.compile($("#page-temp").html());
		$('#search-page').append (template(results));
		
		renderHome(results);
	
	} else error();
	
}

function renderHome(results) {
	
	var container = $("#search-list");
	
	$('#loading').css('display', 'none');
	container.fadeIn(500);
	
	$('#search-list li').on('tap', function(event) {
		
		container.css('display', 'none');
		var index = $(this).data('index');
		
		$('header').css('display', 'none');
		renderMap(index, results);
		
	});
	
}

function renderMap(index, results) {
	
	$('#map, #mapcover').css('display', 'block');
	google.maps.event.trigger(map, 'resize');
	map.setCenter(results[index].geometry.location);
	var marker = new google.maps.Marker({
		position: results[index].geometry.location,
		map: map,
		title: results[index].name
	});
	
	$('.page').eq(index).css('display', 'block');
	
	$('.page button').on('tap', function(event) {
		$('.page').eq(index).css('display', 'none');
		$('#map, #mapcover').css('display', 'none');
		$('header').css('display', 'block');
		marker.setMap(null);
		renderHome(results);
	});
	
	
}

function error() {
	
	$('#content').html("No connection");
	
}