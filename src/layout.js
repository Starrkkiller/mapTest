export const createLayout = function (ymap, calculateSize, className) {
  console.log(className);
  var Chips = ymap?.templateLayoutFactory.createClass(
    "<div class=`${className}`></div>",
    {
      build: function () {
        Chips?.superclass.build.call(this);
        var map = this.getData().geoObject.getMap();
        if (!this.inited) {
          this.inited = true;
          var zoom = map.getZoom();
          map.events.add(
            "boundschange",
            function () {
              var currentZoom = map.getZoom();
              if (currentZoom !== zoom) {
                zoom = currentZoom;
                this.rebuild();
              }
            },
            this
          );
        }
        var options = this.getData().options,
          size = calculateSize(map.getZoom()),
          element = this.getParentElement().getElementsByClassName(
            "pie-chart"
          )[0],
          circleShape = {
            type: "Circle",
            coordinates: [0, 0],
            radius: size / 2
          };
        console.log("el", element);
        element.style.width = element.style.height = size + "px";
        element.style.marginLeft = element.style.marginTop = -size / 2 + "px";
        options.set("shape", circleShape);
      }
    }
  );

  return Chips;
};
