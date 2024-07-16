import { addMetricsStatusCode } from "../metrics/add-metrics-status-code";
import { baseUrl } from "../variables.json";

export function CreateProduct(product) {
  const payload = JSON.stringify(product);

  const headers = {
    "Content-Type": "application/json",
  };

  const res = http.post(`${baseUrl}/v1/products`, payload, {
    headers,
  });

  check(res, {
    "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
  });

  addMetricsStatusCode(res.status);
}
