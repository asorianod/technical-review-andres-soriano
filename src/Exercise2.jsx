import { useState, useRef, useCallback } from "react";
import "./App.css";
import getFixedRange from "./getFixedRange";

function Exercise2() {
  const [allowedValues, setAllowedValues] = useState([
    1.99, 5.99, 10.99, 30.99, 50.99, 70.99,
  ]);

  const FixedRange = ({ allowedValues = allowedValues, onChange }) => {
    const min = allowedValues[0];
    const max = allowedValues[allowedValues.length - 1];
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);
    const rangeRef = useRef(null);
    const thumbRef = useRef(null);

    const getPercent = (value) => ((value - min) / (max - min)) * 100;

    const handleMouseMove = useCallback(
      (event, thumb) => {
        if (!rangeRef.current) return;

        const rangeRect = rangeRef.current.getBoundingClientRect();
        const rangeWidth = rangeRect.width;
        const valuePerPixel = (max - min) / rangeWidth;

        let newValue = min + (event.clientX - rangeRect.left) * valuePerPixel;
        newValue = allowedValues.reduce((prev, curr) =>
          Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
        );

        if (
          thumb === "min" &&
          newValue < maxValue &&
          allowedValues.indexOf(newValue) < allowedValues.indexOf(maxValue)
        ) {
          setMinValue(newValue);
          if (onChange) {
            onChange({ min: newValue, max: maxValue });
          }
        } else if (
          thumb === "max" &&
          newValue > minValue &&
          allowedValues.indexOf(newValue) > allowedValues.indexOf(minValue)
        ) {
          setMaxValue(newValue);
          if (onChange) {
            onChange({ min: minValue, max: newValue });
          }
        }
      },
      [min, max, allowedValues, minValue, maxValue, onChange]
    );

    const handleMouseUp = useCallback(() => {
      document.removeEventListener("mousemove", thumbRef.current);
      document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    const handleMouseDown = (thumb) => () => {
      thumbRef.current = (e) => handleMouseMove(e, thumb);
      document.addEventListener("mousemove", thumbRef.current);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <>
        <ul
          style={{
            maxWidth: "700px",
            textAlign: "left",
            fontSize: "0.9rem",
            fontStyle: "italic",
          }}
        >
          <li>
            The component can't be a HTML5 input range. It has to be a custom
            one.
          </li>
          <li>
            Given a range of values: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
            the user will only be able to select those values in range.
          </li>
          <li>
            Provide a mocked http service that returns the array of numbers:
            [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]. Use h
            ttps://www.mockable.io/ or a custom mocked server.
          </li>
          <li>
            For this type of range, currency values are not input changable.
            They have to be only a label
          </li>
          <li>The user can drag two bullets through the range line.</li>
          <li>Min value and max value can't be crossed in range.</li>
          <li>{`For this example, provide a mocked service returning min and max values that
            have to be used in the component. Example: {rangeValues: []}`}</li>
          <li>Do as many unit tests as you can.</li>
        </ul>
        <div className="range-container">
          <div className="range-values">
            <div className="range-value">{minValue}€</div>
          </div>
          <div className="range-track" ref={rangeRef}>
            <div
              className="range-selected"
              style={{
                left: `${getPercent(minValue)}%`,
                width: `${getPercent(maxValue) - getPercent(minValue)}%`,
              }}
            />
            <div
              className="range-thumb min-thumb"
              style={{ left: `${getPercent(minValue)}%` }}
              onMouseDown={handleMouseDown("min")}
            />
            <div
              className="range-thumb max-thumb"
              style={{ left: `${getPercent(maxValue)}%` }}
              onMouseDown={handleMouseDown("max")}
            />
          </div>
          <div className="range-values">
            <div className="range-value">{maxValue}€</div>
          </div>
        </div>
        <p style={{ fontWeight: "bold" }}>
          The range is between {minValue}€ and {maxValue}€
        </p>
      </>
    );
  };

  const handleRangeChange = ({ min, max }) => {
    console.log("Selected range values:", { min, max });
  };

  const getRange = async () => {
    const response = await getFixedRange();
    setAllowedValues(response.data.rangeValues);
  };

  getRange();

  return (
    <div>
      <h3>Fixed Range</h3>
      <FixedRange allowedValues={allowedValues} onChange={handleRangeChange} />
    </div>
  );
}

export default Exercise2;
