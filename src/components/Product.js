import React, { useState, useEffect, useCallback } from "react";

import AFRAME from "aframe";

function ARView() {
  const [position, setPosition] = useState({ x: 0, y: 10, z: 0 });
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [element, setElement] = useState(null);

  const registerClickHandler = useCallback((event, self) => {
    // Create new entity for the new object
    const newElement = document.createElement("a-entity");
    setElement(newElement);

    // The raycaster gives a location of the touch in the scene
    const touchPoint = event.detail.intersection.point;
    setPosition({ ...touchPoint });

    const randomYRotation = Math.random() * 360;
    setRotation([rotation[0], randomYRotation, rotation[2]]);

    newElement.setAttribute("visible", "false");
    newElement.setAttribute("scale", "0.0001 0.0001 0.0001");

    newElement.setAttribute("gltf-model", "#treeModel");
    self.el.sceneEl.appendChild(newElement);

    newElement.addEventListener("model-loaded", () => {
      // Once the model is loaded, we are ready to show it popping in using an animation
      newElement.setAttribute("visible", "true");
      newElement.setAttribute("animation", {
        property: "scale",
        to: "0.01 0.01 0.01",
        easing: "easeOutElastic",
        dur: 800
      });
    });
  }, []);

  useEffect(() => {
    AFRAME.registerComponent("tap-place", {
      init: function() {
        const ground = document.getElementById("ground");
        ground.addEventListener("click", event => {
          registerClickHandler(event, this);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (element) {
      element.setAttribute("position", position);
      element.setAttribute("rotation", rotation.join(" "));
    }
  }, [element, position, rotation]);

  return (
    <a-scene tap-place xrweb>
      <a-assets>
        <a-asset-item
          id="treeModel"
          src="./3d-models/Tree/Tree.glb"
        ></a-asset-item>
      </a-assets>

      <a-camera
        position="0 8 0"
        raycaster="objects: .cantap"
        cursor="
          fuse: false;
          rayOrigin: mouse;"
      ></a-camera>

      <a-entity
        light="type: directional;
               intensity: 0.8;"
        position="1 4.3 2.5"
      ></a-entity>

      <a-light type="ambient" intensity="1"></a-light>

      <a-entity
        id="ground"
        class="cantap"
        geometry="primitive: box"
        material="color: #ffffff; transparent: true; opacity: 0.0"
        scale="1000 2 1000"
        position="0 -1 0"
      ></a-entity>
    </a-scene>
  );
}

function ImageView() {
  return <div />;
}

function Product({ showARView }) {
  if (showARView) {
    return <ARView />;
  } else {
    return <ImageView />;
  }
}

export default Product;
