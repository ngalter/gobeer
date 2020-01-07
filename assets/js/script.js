$(document).ready(function () {
    console.log("ready!");
    var apiKEY = "AIzaSyANuAQZgJ5SljJk_tI26izHWpOwayzGpVg";
    var city = $("#city-input").val().trim();
    var cityScore = city.replace(/ /g, "_");
    var latlon = "";
    var gQuery = "";
    var init = false;
    var coords = { lat: 37.0475, long: -112.5263 };
    var myId = "";
    var map;
    var service;
    var infowindow;
    var barLat = 0;
    var barLon = 0;
    var myLatLng = "";
    var barName = "";

    $("#search").on("click", function (event) {
        event.preventDefault();
        $("#pubs").empty();
        city = $("#city-input").val().trim();
        cityScore = city.replace(/ /g, "_");
        getByCity();
    });

    //Get the button:
mybutton = document.getElementById("topBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
    // When the user clicks on the button, scroll to the top of the document
    $("#topBtn").on("click", function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

    
    function formatPhone(str) {
        str = str.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        return str;
    }

    function initMap() {
        //  var sydney = new google.maps.LatLng(-33.867, 151.195);
        var myCity = new google.maps.LatLng(barLat, barLon);
          
        infowindow = new google.maps.InfoWindow();

        map = new google.maps.Map(
            document.getElementById(myId), { center: myCity, zoom: 16 });
        var marker = new google.maps.Marker({
            position: myCity,
            map: map,
            title: "hello",
            content: "hello"      
        });
    }
    
    function getByCity() {
        $("#pubs").show();
        var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + cityScore + "&sort=+name&per_page=50";     
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        
            for (var i = 0; i < response.length; i++) {
                if (response[i].brewery_type !== "planning") {
                    barLat = 0;
                    barLon = 0;
                    barName = "";
                    bName = "";
                    nameLink = "";
                    var divCard = $("<div>").attr("id", i.toString());
                    var bname = response[i].name;
                    var burl = response[i].website_url.trim();
                    if (response[i].website_url.length !== 0) {
                        var nameLink = "<a href=\"" + burl + "\" target=\"_blank\" rel=\"noopener\">" + bname + "</a>";
                    } else {
                        nameLink = bname;
                    }
                    console.log(response[i].name, +", " + bname);
                    barName = $("<p>").html(nameLink);
                    $(barName).addClass("card-heading");
                    var barType = response[i].brewery_type;
                    $(barType).addClass("bar-type");
                    var barStreet = response[i].street;
                    var barCity = response[i].city;
                    var barState = response[i].state;
                    var barPostal = response[i].postal_code;
                    if (response[i].phone.length !== 0) {
                        bPhone = response[i].phone;
                        var barPhone = formatPhone(response[i].phone);
                    } else if (!bPhone) {
                        var barPhone = (" ");
                    }
                    var barAddress = $("<p>").html(barStreet + "<br>" + barCity + ", " + barState + " " + barPostal.slice(0, 5)+ "<br>" + barPhone+"<br>"+"Bar Type: "+ barType).addClass("bar-address");
                    if (response[i].latitude)
                    {
                        barLat = response[i].latitude;
                    }
                    if (response[i].longitude)
                    {
                        barLon = response[i].longitude;
                    }
                    var bPhone = response[i].phone;
                    if (barLat !== 0 && barLon !== 0)
                    {
                        myId = "map" + i.toString();
                        var mymap = $("<div>").attr("id", myId).addClass("my-map");
                        $("#pubs").append(mymap);
                        initMap();
                    }
                    $(divCard).append(barName, barAddress).addClass("card");
                    $("#pubs").append(divCard);

                }
            }
        });
     }
});
