import { Counter } from "k6/metrics";

const metricStatusCode200 = new Counter("status_code_200");
const metricStatusCode201 = new Counter("status_code_201");
const metricStatusCode204 = new Counter("status_code_204");
const metricStatusCode422 = new Counter("status_code_422");
const metricStatusCode500 = new Counter("status_code_500");

export function addMetricsStatusCode(statusCode) {
  switch (statusCode) {
    case 200:
      metricStatusCode200.add(1);
      break;
    case 201:
      metricStatusCode201.add(1);
      break;
    case 204:
      metricStatusCode204.add(1);
      break;
    case 422:
      metricStatusCode422.add(1);
      break;
    case 500:
      metricStatusCode500.add(1);
      break;

    default:
      break;
  }
}
