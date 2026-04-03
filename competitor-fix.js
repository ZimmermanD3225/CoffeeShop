// Competitor layer toggle fix - runs after DOM and map are ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if (typeof map === 'undefined' || typeof competitorConfig === 'undefined') return;

    var compLayers = {};
    var dataSources = {
      dutchbros: typeof dutchBrosLocations !== 'undefined' ? dutchBrosLocations : [],
      blackrock: typeof blackRockLocations !== 'undefined' ? blackRockLocations : [],
      hyper: typeof hyperLocations !== 'undefined' ? hyperLocations : []
    };
    var colors = { dutchbros: '#FF6B00', blackrock: '#4A5568', hyper: '#48BB78' };

    Object.keys(competitorConfig).forEach(function(key) {
      var data = dataSources[key] || [];
      var markers = data.map(function(loc) {
        return L.circleMarker([loc.lat, loc.lng], {
          radius: 5, fillColor: colors[key], color: '#fff', weight: 1, fillOpacity: 0.8
        }).bindPopup('<b>' + competitorConfig[key].name + '</b><br>' + loc.city + ', ' + loc.state);
      });
      compLayers[key] = L.layerGroup(markers);
    });

    // Find competitor row elements and wire click handlers
    var allDivs = document.querySelectorAll('div');
    allDivs.forEach(function(div) {
      var text = div.textContent;
      var key = null;
      if (text.indexOf('Dutch Bros') >= 0 && text.indexOf('1,181') >= 0) key = 'dutchbros';
      else if (text.indexOf('Black Rock') >= 0 && text.indexOf('~180') >= 0) key = 'blackrock';
      else if (text.indexOf('Hyper Energy') >= 0 && text.indexOf('11+') >= 0) key = 'hyper';

      if (key && !div.querySelector('h3') && div.children.length <= 5) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', function() {
          var layer = compLayers[key];
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            div.style.opacity = '0.5';
            div.style.borderColor = '#333';
          } else {
            layer.addTo(map);
            div.style.opacity = '1';
            div.style.borderColor = colors[key];
          }
        });
      }
    });

    window.toggleCompetitor = function(key) {
      var layer = compLayers[key];
      if (layer) {
        if (map.hasLayer(layer)) map.removeLayer(layer);
        else layer.addTo(map);
      }
    };

    console.log('Competitor layers initialized:', Object.keys(compLayers));
  }, 1000);
});
