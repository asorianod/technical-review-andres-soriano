import axios from "axios";
const GET_NORMAL_RANGE = "https://demo1633259.mockable.io/normalrange";

const getNormalRange = () => {
  const range = axios.get(GET_NORMAL_RANGE);

  return range;
};

export default getNormalRange;
