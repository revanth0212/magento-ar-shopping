import React from "react";

const ARView = () => {
  return (
    <a-scene embedded arjs="sourceType: webcam;">
      <a-box
        color="red"
        position="0 2 -5"
        rotation="0 45 45"
        scale="2 2 2"
      ></a-box>
    </a-scene>
  );
};
const ImageViewer = ({ showArView }) => {
  if (showArView) {
    return <ARView />;
  } else {
    return <>Image View</>;
  }
};

const Product = () => {
  return (
    <div style={{ margin: "0px", overflow: "hidden" }}>
      <ImageViewer showArView={true} />
    </div>
  );
};

export default Product;
