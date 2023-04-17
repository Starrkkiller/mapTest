import { Map, Placemark, useYMaps, ZoomControl } from "@pbe/react-yandex-maps";
import { useEffect } from "react";
import { createLayout } from "./layout";
import { mapSize_MAP } from "./mapSize";
import "./styles.css";

export default function App() {
  const handleChange = ({ pers, size, halfPercentage, quadrantPercentage }) => {
    const root = document.documentElement;
    root.style.setProperty("--startPercentage", `${pers}deg`);
    root.style.setProperty("--size", `${size}deg`);
    root.style.setProperty("--halfPercentage", `${halfPercentage}deg`);
    root.style.setProperty(
      "--halfPercentageEnd",
      `${halfPercentage + size}deg`
    );
    root.style.setProperty("--quadrantPercentage", `${quadrantPercentage}deg`);
    root.style.setProperty(
      "--quadrantPercentageEnd",
      `${quadrantPercentage + size}deg`
    );
  };

  const size = 30; // размер области в градусах
  let percentage = 0; // стартовая позиция в градусах
  let halfPercentage = 0;
  let quadrantPercentage = 0;
  let halfForward = true;
  let quadrantForward = true;

  useEffect(() => {
    const interval = setInterval(() => {
      if (percentage >= 360) {
        percentage = 0;
      }
      if (halfPercentage + size >= 180 || halfPercentage < 0) {
        halfForward = !halfForward;
      }
      if (quadrantPercentage + size >= 90 || quadrantPercentage < 0) {
        quadrantForward = !quadrantForward;
      }
      percentage += 5;

      halfPercentage = halfForward ? halfPercentage + 5 : halfPercentage - 5;
      quadrantPercentage = quadrantForward
        ? quadrantPercentage + 5
        : quadrantPercentage - 5;

      handleChange({
        pers: percentage,
        size: size,
        halfPercentage,
        quadrantPercentage
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const ymaps = useYMaps(["templateLayoutFactory"]);

  var createChipsLayout = function (calculateSize, className) {
    var Chips = ymaps?.templateLayoutFactory.createClass(
      `<div class=${className}></div>`,
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
              `${className}`
            )[0],
            circleShape = {
              type: "Circle",
              coordinates: [0, 0],
              radius: size / 2
            };
          element.style.width = element.style.height = size + "px";
          element.style.marginLeft = element.style.marginTop = -size / 2 + "px";
          options.set("shape", circleShape);
        }
      }
    );

    return Chips;
  };

  return (
    <div className="App">
      <Map
        defaultState={{
          center: [51.369758, 80.180898],
          zoom: 15,
          controls: [],
          type: 'yandex#satellite'
        }}
        style={{ width: "600px", height: "400px" }}
      >
        <ZoomControl options={{ float: "right" }} />
        <Placemark
          geometry={[51.369758, 80.180898]}
          options={{
            iconLayout: createChipsLayout(function (zoom) {
              return (50 / mapSize_MAP[zoom]) * 100;
            }, "pie-chart")
          }}
        />
        <Placemark
          geometry={[51.3687, 80.1839]}
          options={{
            iconLayout: createChipsLayout(function (zoom) {
              return (50 / mapSize_MAP[zoom]) * 100;
            }, "semiCircle")
          }}
        />
        <Placemark
          geometry={[51.369758, 80.183]}
          options={{
            iconLayout: createChipsLayout(function (zoom) {
              return (50 / mapSize_MAP[zoom]) * 100;
            }, "quadrant")
          }}
        />
      </Map>
    </div>
  );
}
