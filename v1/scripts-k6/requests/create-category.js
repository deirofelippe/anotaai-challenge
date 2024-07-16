import { addMetricsStatusCode } from "../metrics/add-metrics-status-code";
import { baseUrl } from "../variables.json";

export function CreateCategory(category) {
  const payload = JSON.stringify(category);

  const headers = {
    "Content-Type": "application/json",
  };

  const res = http.post(`${baseUrl}/v1/categories`, payload, {
    headers,
  });

  check(res, {
    "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
  });

  addMetricsStatusCode(res.status);
}
