
(function() {
  'use strict';

  // Insert injected weather forecast here
  var initialWeatherForecast = {
    key: 'newyork',
    prime: 'My Prime',
    image: '/a-spot_NL_AgentCarter.jpg'
  };

  var app = {
    isLoading: true,
    hasRequestPending: false,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    url: '/pwa-sample/myprime-movies.json'
  };

  //get products list
  app.getProducts = function() {
    var url = app.url;
      // Make the XHR to get the data, then update the card
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            var response = JSON.parse(request.response);
            //console.log(response);
            app.hasRequestPending = false;
            console.log('[App] Forecast Updated From Network');
            app.updateProductsCard(response.results);
          }
        }
      };
      request.open('GET', url);
      request.send();
  };

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/
   document.getElementById('hamburger-button').addEventListener('click', function() {
    //console.log('click occure');
    document.getElementsByTagName('body')[0].className = "nav-mobile--open";
    //$('body').addClass('nav-mobile--open'); 
  });
  
  document.getElementById('nav-mobile__close').addEventListener('click', function() {
    //console.log('click occure');
    document.getElementsByTagName('body')[0].className = " ";
    //$('body').addClass('nav-mobile--open'); 
  });
  
  document.getElementById('add-to-home').addEventListener('click', function() {
    //console.log('click occure');
    document.getElementById('add-to-thome-overlay').className = 'record-view js-record-view record-view--visible';
    document.getElementById('add-to-thome-overlay').querySelector('.record-view__panel').style.width = "90%";
  });
  
  document.getElementById('add-to-thome-overlay').addEventListener('click', function() {
    //console.log('click occure');
    document.getElementById('add-to-thome-overlay').className = ' ';
    document.getElementById('add-to-thome-overlay').querySelector('.record-view__panel').style.width = "0%";
  });
  
  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  
  // Updates a weather card with the latest latest movies. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateProductsCard = function(data) {
    for (var key in data) {
       if (data.hasOwnProperty(key)) {
        var card = app.visibleCards[data[key]];
        if (!card && app.cardTemplate != null) {
          card = app.cardTemplate.cloneNode(true);
          card.classList.remove('cardTemplate');
          card.querySelector('.json').textContent = JSON.stringify(data[key]);
          card.querySelector('.movie-name').textContent = data[key].title;
          card.querySelector('.movie-year').textContent = data[key].year;
          var img = document.createElement('img');
          img.src = data[key].images;
          img.className = 'rig-img';
          card.querySelector('.image-tag').appendChild(img);
          card.removeAttribute('hidden');
          app.container.appendChild(card);
          app.visibleCards[data.key] = card;
        }
       }
    }
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
    };

  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  // Gets a forecast for a specific city and update the card with the data
  
  // Iterate all of the cards and attempt to get the latest forecast data
  /*app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getProducts(key);
    });
  };*/

 

  /*****************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this getting started guide, we've used localStorage.
   *   localStorage is a syncronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   *
   ****************************************************************************/

  app.MoviesList = localStorage.MoviesList;
  if (app.MoviesList) {
    app.MoviesList = JSON.parse(app.MoviesList);
    app.MoviesList.forEach(function(obj) {
      // todo aman
      //app.getForecast(city.key, city.label);
    });
  } else {
      var url = app.url;
     
      // Make the XHR to get the data, then update the card
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            var response = JSON.parse(request.response);
            app.hasRequestPending = false;
            console.log('[App] Movies updated from Network');
            app.updateProductsCard(response.mediaGroups);
          }
        }
      };
      request.open('GET', url);
      request.send();
  }

  // Add feature check for Service Workers here
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/pwa-sample/service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})();

var idbSupported = false;
var db;
document.addEventListener("DOMContentLoaded", function(){
    if("indexedDB" in window) {
        idbSupported = true;
    }
    if(idbSupported) {
        var openRequest = indexedDB.open("movies-pwa",1);
        openRequest.onupgradeneeded = function(e) {
            console.log("running onupgradeneeded");
            var thisDB = e.target.result;
            if(!thisDB.objectStoreNames.contains("watchList")) {
	    	//thisDB.createObjectStore("watchList", {autoIncrement:true});
		thisDB.createObjectStore("watchList", {keyPath:"id"});
            }
        }
        openRequest.onsuccess = function(e) {
            console.log("Success!");
            db = e.target.result;
	    readAll();
        }
        openRequest.onerror = function(e) {
            console.log("Error");
            console.dir(e);
        }
    }
},false);
$("#watchList-link").click(function(){
    var myObj = JSON.parse(document.querySelector('.movie-json').textContent);
    //console.log("About to add "+myObj);
    var transaction = db.transaction(["watchList"],"readwrite");
    var store = transaction.objectStore("watchList");
    //Perform the add
    var request = store.add(myObj);
	
    request.onerror = function(e) {
        console.log("Error",e.target.error.name);
        //some type of error handler
    }
    request.onsuccess = function(e) {
        console.log("Woot! Did it");
	document.querySelector('.watchList-link-added').classList.add('watchlist-hide');
	document.getElementById("watchList-link-added").classList.remove('watchlist-hide');
    }
});
/* remove item from db */
$("#watchList-link-added").click(function(){
    	var myObj = JSON.parse(document.getElementById("watchList-link").querySelector('.movie-json').textContent);
        var request = db.transaction(["watchList"], "readwrite")
            .objectStore("watchList")
            .delete(myObj.id);
            request.onsuccess = function(event) {
               alert("removed from db.");
            };
	document.querySelector('.watchList-link-added').classList.remove('watchlist-hide');
	document.getElementById("watchList-link-added").classList.add('watchlist-hide');
});

function readAll() {
    var objectStore = db.transaction("watchList").objectStore("watchList");
    objectStore.openCursor().onsuccess = function(event) {
    	var cursor = event.target.result;
       if (cursor) {
	  console.log(cursor.value);
	  var favTemplate = document.querySelector('.favoriteTemplate')
	  if (favTemplate != null) {
		  var card = favTemplate.cloneNode(true);
		  card.classList.remove('favoriteTemplate');
		  card.querySelector('.json').textContent = JSON.stringify(cursor.value);
		  card.querySelector('.movie-name').textContent = cursor.value.title;
		  card.querySelector('.movie-year').textContent = cursor.value.year;
		  var img = document.createElement('img');
		  img.src = cursor.value.images;
		  img.className = 'rig-img';
		  card.querySelector('.image-tag').appendChild(img);
		  card.removeAttribute('hidden');
		  document.querySelector('.main').appendChild(card);
		}
	  cursor.continue();
       }
       else {
	  console.log("No more entries!");
       }
    };
 }

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

function highlight(elem) {	
	var myObj = JSON.parse(elem.querySelector('.json').textContent);
	var card = document.getElementById("myNav");
	card.querySelector('.movie-json').textContent = JSON.stringify(myObj);
	card.querySelector('.details-image').src = myObj.images;
        card.querySelector('.movie-name').textContent = myObj.title;
	card.querySelector('.movie-time').textContent = "Duration : "+(myObj.duration/60).toFixed(2) +" min";
	card.querySelector('.movie-genre').textContent = "Genre : "+myObj.categories[0].title;
	
	var cast = "";
	myObj.cast.forEach(function(item){
    		cast += item+", ";
	});
	card.querySelector('.movie-cast').textContent = "CAST & CREW : "+cast;
	card.querySelector('.movie-description').textContent = myObj.longDescription;
	/* check whether movie is already in fav list */
	if(isFav(myObj.id)){
		document.querySelector('.watchList-link-added').classList.add('watchlist-hide');
		document.getElementById("watchList-link-added").classList.remove('watchlist-hide');
	}
	openNav();
}
function isFav(idm){
	console.log(idm);
    var transaction = db.transaction(["watchList"]);
    var objectStore = transaction.objectStore("watchList");
    var request = objectStore.get(idm);
    request.onerror = function(event) {
       console.log("Unable to retrieve daa from database!");
    };
    request.onsuccess = function(event) {
       // Do something with the request.result!
       if(request.result) {
	  return true;
       }
       else {
	  return false
       }
    };
}
