import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import SelectResolution from "./select/Resolution";
import SelectCamera from "./Camera";
import SelectShape from "./select/Shape";

const { electronAPI } = window;

const squareResolutionOptions = [
  {
    value: "100px",
    label: "100 X 100",
  },
  {
    value: "150px",
    label: "150 X 150",
  },
  {
    value: "200px",
    label: "200 X 200",
  },
  {
    value: "250px",
    label: "250 X 250",
  },
  {
    value: "300px",
    label: "300 X 300",
  },
  {
    value: "350px",
    label: "350 X 350",
  },
  {
    value: "400px",
    label: "400 X 400",
  },
];

const rectangleResolutionOptions = [
  {
    value: "320px|180px",
    label: "320 x 180",
  },
  {
    value: "480px|270px",
    label: "480 x 270",
  },
  {
    value: "640px|360px",
    label: "640 x 360",
  },
  {
    value: "800px|450px",
    label: "800 x 450",
  },
  {
    value: "1024px|576px",
    label: "1024 x 576",
  },
  {
    value: "1280px|720px",
    label: "1280 x 720",
  },
  {
    value: "1920px|1080px",
    label: "1920 x 1080",
  },
];

const shapes = [
  {
    value: "rectangle",
    label: "Rectangle",
  },
  {
    value: "square",
    label: "Square",
  },
  {
    value: "circle",
    label: "Circle",
  },
];

function CamSection() {
  const [resolutionOptions, setResolutionOptions] = useState(
    rectangleResolutionOptions
  );

  const [selectedShape, setSelectedShape] = useState("rectangle");

  const handleResolutionChange = (e) => {
    const size = e.target.value;
    let [width, height] = [size, size];
    if (selectedShape === "rectangle") {
      [width, height] = size.split("|");
    }
    electronAPI.sendSync("shared-window-channel", {
      type: "set-camera-resolution",
      payload: { width, height },
    });
  };

  const handleShapeChange = (e) => {
    const shape = e.target.value;
    const style = {};
    setSelectedShape(shape);
    switch (shape) {
      case "circle":
        setResolutionOptions(squareResolutionOptions);
        style.borderRadius = "50%";
        style.width = "100px";
        style.height = "100px";
        break;
      case "square":
        setResolutionOptions(squareResolutionOptions);
        style.borderRadius = "0";
        style.width = "100px";
        style.height = "100px";
        break;
      case "rectangle":
        setResolutionOptions(rectangleResolutionOptions);
        style.width = "320px";
        style.height = "180px";
        style.borderRadius = "5px";
        break;
      default:
        break;
    }
    electronAPI.sendSync("shared-window-channel", {
      type: "set-camera-shape",
      payload: style,
    });
  };

  const handleMirrorChange = (e) => {
    const mirror = e.target.checked;
    const style = {};
    if (mirror) {
      style.transform = "scaleX(-1)";
      style["-webkit-transform"] = "-webkit-scaleX(-1)";
    } else {
      style.transform = "scaleX(1)";
      style["-webkit-transform"] = "scaleX(1)";
    }
    electronAPI.sendSync("shared-window-channel", {
      type: "set-camera-mirror",
      payload: style,
    });
  };

  return (
    <Container className="p-3">
      <Card>
        <Card.Body>
          <Card.Title>Cam</Card.Title>

          <SelectCamera />
          <SelectResolution
            resolutions={resolutionOptions}
            onChange={handleResolutionChange}
          />
          <SelectShape
            shapes={shapes}
            defaultShape={selectedShape}
            onChange={handleShapeChange}
          />
          <Card.Text as="div">
            <Form.Group controlId="formFlipVideo">
              <label>
                <Form.Label>Flip</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Mirror Recording"
                  onChange={handleMirrorChange}
                />
              </label>
            </Form.Group>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CamSection;
