
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
    url: '/pwa-sample/myPrime.json'
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
    console.log('click occure');
    document.getElementsByTagName('body')[0].className = "nav-mobile--open";
    //$('body').addClass('nav-mobile--open'); 
  });
  
  document.getElementsByClassName('.nav-mobile__close').addEventListener('click', function() {
    console.log('click occure');
    document.getElementsByTagName('body')[0].className = " ";
    //$('body').addClass('nav-mobile--open'); 
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
        if (!card) {
          card = app.cardTemplate.cloneNode(true);
          card.classList.remove('cardTemplate');
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
      //var url = 'https://api-public.guidebox.com/v1.43/US/rKxMt6EY45jo0jn1rY0tuTHSuoq9szkq/shows/all/50/10/all/all';
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
