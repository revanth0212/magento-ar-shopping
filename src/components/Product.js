/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import AFRAME from "aframe";
import Slider from "./Slider";

function ARView() {
  const [position, setPosition] = useState({ x: 0, y: 10, z: 0 });
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [element, setElement] = useState(null);

  const registerClickHandler = useCallback((event, self) => {
    // The raycaster gives a location of the touch in the scene
    const touchPoint = event.detail.intersection.point;

    if (!document.getElementById("model")) {
      // Create new entity for the new object
      const newElement = document.createElement("a-entity");
      setElement(newElement);

      const randomYRotation = Math.random() * 360;
      setRotation([rotation[0], randomYRotation, rotation[2]]);

      newElement.setAttribute("id", "model");
      newElement.setAttribute("draggable", "true");
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
    }
    setPosition({ ...touchPoint });
  }, []);

  const handleXRotation = useCallback(
    (_, newValue) => {
      const xRotation = Number(newValue);
      if (xRotation) {
        setRotation([xRotation, rotation[1], rotation[2]]);
      }
    },
    [rotation, setRotation]
  );

  const handleYRotation = useCallback(
    (_, newValue) => {
      const yRotation = Number(newValue);
      if (yRotation) {
        setRotation([rotation[0], yRotation, rotation[2]]);
      }
    },
    [rotation, setRotation]
  );

  const handleZRotation = useCallback(
    (_, newValue) => {
      const zRotation = Number(newValue);
      if (zRotation) {
        setRotation([rotation[0], rotation[1], zRotation]);
      }
    },
    [rotation, setRotation]
  );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(stream => {
        const video = document.getElementById("video");
        video.srcObject = stream;
      });

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

  useEffect(() => {
    if (element) {
      element.addEventListener("click", event => {
        console.log(event);
      });
    }
  }, [element]);

  return (
    <div>
      <div>
        <video
          id="video"
          autoPlay
          style={{
            width: "100%",
            height: "100%"
          }}
        ></video>
        <a-scene tap-place>
          <a-assets>
            <a-asset-item
              id="treeModel"
              src="./3d-models/Tree/Tree.glb"
            ></a-asset-item>
          </a-assets>

          <a-camera
            position="0 8 0"
            raycaster="objects: .cantap"
            cursor="fuse: false;rayOrigin: mouse;"
          ></a-camera>

          <a-entity camera look-controls mouse-cursor></a-entity>

          <a-entity
            light="type: directional;
               intensity: 0.8;"
            position="1 4.3 2.5"
          ></a-entity>

          <a-light type="ambient" intensity="1"></a-light>

          <a-entity
            id="ground"
            class="cantap"
            geometry={`primitive: plane; height: ${window.outerHeight}; width: ${window.outerWidth}`}
            material="color: #ffffff; transparent: true; opacity: 0.0"
            position="0 0 -10"
          ></a-entity>
        </a-scene>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "0%",
          width: "50%",
          height: "auto",
          paddingLeft: "25%"
        }}
      >
        <Slider
          label="X - Rotation"
          valueLabelDisplay="auto"
          name="x-rotation"
          defaultValue={0}
          min={-180}
          max={180}
          onChange={handleXRotation}
        />

        <Slider
          label="Y - Rotation"
          valueLabelDisplay="auto"
          name="y-rotation"
          defaultValue={0}
          min={-180}
          max={180}
          onChange={handleYRotation}
        />

        <Slider
          label="Z - Rotation"
          valueLabelDisplay="auto"
          name="z-rotation"
          defaultValue={0}
          min={-180}
          max={180}
          onChange={handleZRotation}
        />
      </div>
    </div>
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
