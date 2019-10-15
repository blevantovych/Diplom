const BASE_URL = PRODUCTION
  ? "https://minmax-approximation.herokuapp.com"
  : `http://localhost:5000`;

const MINMAX_URL = `${BASE_URL}/minmax?`;

const LSSQ_URL = `${BASE_URL}/least_squares?`;

const LSSQ_DISCRETE_URL = `${BASE_URL}/least_squares_discrete?`;

const MINMAX_DISCRETE_URL = `${BASE_URL}/minmax_discrete?`;

const SPLINE_MINMAX_URL = `${BASE_URL}/spline_minmax?`;

const CONTINUOUS_SPLINE_MINMAX_URL = `${BASE_URL}/spline_minmax?`;

const CONTINUOUS_SPLINE_MINMAX_SEGMENTS_SPECIFIED_URL = `${BASE_URL}/continuous_spline_minmax_segments_specified?`;

const MINMAX_SPLINE_DISCRETE_URL = `${BASE_URL}/spline_minmax_discrete?`;
// GET

const MINMAX_DISCRETE_URL_GET = `${BASE_URL}/minmax_discrete_get_results`;

const MINMAX_URL_GET = `${BASE_URL}/minmax_get_results`;

const LSSQ_URL_GET = `${BASE_URL}/least_squares_get_results`;

const LSSQ_DISCRETE_URL_GET = `${BASE_URL}/least_squares_discrete_get_results`;

export {
  MINMAX_URL,
  LSSQ_URL,
  LSSQ_DISCRETE_URL,
  MINMAX_DISCRETE_URL,
  MINMAX_DISCRETE_URL_GET,
  MINMAX_URL_GET,
  LSSQ_URL_GET,
  LSSQ_DISCRETE_URL_GET,
  SPLINE_MINMAX_URL,
  CONTINUOUS_SPLINE_MINMAX_URL,
  CONTINUOUS_SPLINE_MINMAX_SEGMENTS_SPECIFIED_URL,
  MINMAX_SPLINE_DISCRETE_URL
};
