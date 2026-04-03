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

    window.toggleCompetitor = function(key) {
      var layer = compLayers[key];
      if (!layer) return;
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      } else {
        layer.addTo(map);
      }
    };

    var labels = document.querySelectorAll('label.comp-toggle');
    labels.forEach(function(label) {
      var text = label.textContent;
      var key = null;
      if (text.indexOf('Dutch') >= 0) key = 'dutchbros';
      else if (text.indexOf('Black') >= 0) key = 'blackrock';
      else if (text.indexOf('Hyper') >= 0) key = 'hyper';
      if (key) {
        label.style.cursor = 'pointer';
        label.addEventListener('click', function(e) {
          e.preventDefault();
          toggleCompetitor(key);
          if (map.hasLayer(compLayers[key])) {
            label.style.opacity = '1';
            label.style.borderLeft = '4px solid ' + colors[key];
          } else {
            label.style.opacity = '0.5';
            label.style.borderLeft = '4px solid transparent';
          }
        });
      }
    });

    console.log('Competitor layers initialized:', Object.keys(compLayers));
  }, 1000);
});
