import axios from "axios";
const GET_FIXED_RANGE = "https://demo1633259.mockable.io/fixedrange";

const getFixedRange = () => {
  const range = axios.get(GET_FIXED_RANGE);

  return range;
};

export default getFixedRange;
