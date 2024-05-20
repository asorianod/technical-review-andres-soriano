import { useState, useRef, useCallback } from "react";
import "./App.css";
import getNormalRange from "./getNormalRange";

function Exercise1() {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);

  const RangeWithMinMax = ({ min = 1, max = 100, step = 1, onChange }) => {
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);
    const [tempMinValue, setTempMinValue] = useState(min);
    const [tempMaxValue, setTempMaxValue] = useState(max);
    const [editingMin, setEditingMin] = useState(false);
    const [editingMax, setEditingMax] = useState(false);
    const [error, setError] = useState(null);
    const rangeRef = useRef(null);

    const getPercent = (value) => ((value - min) / (max - min)) * 100;

    const handleMouseMove = useCallback(
      (event, thumb) => {
        if (!rangeRef.current) return;
        const rangeRect = rangeRef.current.getBoundingClientRect();
        const rangeWidth = rangeRect.width;
        let newValue =
          ((event.clientX - rangeRect.left) / rangeWidth) * (max - min) + min;
        newValue = Math.round(newValue / step) * step;
        newValue = Math.min(Math.max(newValue, min), max);

        if (thumb === "min" && newValue <= maxValue - 1) {
          setMinValue(newValue);
          setTempMinValue(newValue);
          if (onChange) {
            onChange({ min: newValue, max: maxValue });
          }
        } else if (thumb === "max" && newValue >= minValue + 1) {
          setMaxValue(newValue);
          setTempMaxValue(newValue);
          if (onChange) {
            onChange({ min: minValue, max: newValue });
          }
        }
      },
      [min, max, step, minValue, maxValue, onChange]
    );

    const handleMouseUp = useCallback(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = (thumb) => (event) => {
      setError(null);
      const moveHandler = (e) => handleMouseMove(e, thumb);
      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", moveHandler);
        handleMouseUp();
      });
      moveHandler(event);
    };

    const handleMinInputChange = (event) => {
      setTempMinValue(event.target.value);
      setError(null);
    };

    const handleMaxInputChange = (event) => {
      setTempMaxValue(event.target.value);
      setError(null);
    };

    const handleMinBlur = () => {
      let newValue = parseInt(tempMinValue, 10);
      if (isNaN(newValue) || newValue < min || newValue > maxValue - 1) {
        setError("El valor mínimo no es válido");
        setTempMinValue(minValue);
      } else {
        setMinValue(newValue);
        setError(null);
        if (onChange) {
          onChange({ min: newValue, max: maxValue });
        }
      }
      setEditingMin(false);
    };

    const handleMaxBlur = () => {
      let newValue = parseInt(tempMaxValue, 10);
      if (isNaN(newValue) || newValue > max || newValue < minValue + 1) {
        setError("El valor máximo no es válido");
        setTempMaxValue(maxValue);
      } else {
        setMaxValue(newValue);
        setError(null);
        if (onChange) {
          onChange({ min: minValue, max: newValue });
        }
      }
      setEditingMax(false);
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
          <li>The user can drag two bullets through the range line.</li>
          <li>
            The user can click on both currency number label values (min or max)
            and set a new value.
          </li>
          <li>
            The user can click on both currency number label values (min or max)
            and set a new value.
          </li>
          <li>
            When some bullet is on hover, this bullet has to be bigger and
            change cursor's type into draggable.
          </li>
          <li>Dragging a bullet turns cursor to dragging</li>
          <li>Min value and max value can't be crossed in range</li>
          <li>{`For this example, provide a mocked http service returning min and max values
            that have to be used in the component. Example: {min: 1, max: 100}. Use
            https://www.mockable.io/ or a custom mocked
            server.`}</li>
          <li>Do as many unit tests as you can.</li>
        </ul>
        <div className="range-container">
          <div className="range-values">
            {editingMin ? (
              <>
                <input
                  type="number"
                  className="range-input"
                  value={tempMinValue}
                  onChange={handleMinInputChange}
                  onBlur={handleMinBlur}
                  autoFocus
                />
                €
              </>
            ) : (
              <div className="range-value" onClick={() => setEditingMin(true)}>
                {minValue}€
              </div>
            )}
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
            {editingMax ? (
              <>
                <input
                  type="number"
                  className="range-input"
                  value={tempMaxValue}
                  onChange={handleMaxInputChange}
                  onBlur={handleMaxBlur}
                  autoFocus
                />
                €
              </>
            ) : (
              <div className="range-value" onClick={() => setEditingMax(true)}>
                {maxValue}€
              </div>
            )}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
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
    const response = await getNormalRange();
    setMinValue(response.data.min);
    setMaxValue(response.data.max);
  };

  getRange();

  return (
    <>
      <h3>Normal Range</h3>
      <div>
        <RangeWithMinMax
          min={minValue}
          max={maxValue}
          step={1}
          onChange={handleRangeChange}
        />
      </div>
    </>
  );
}

export default Exercise1;
