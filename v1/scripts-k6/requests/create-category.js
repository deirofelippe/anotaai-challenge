import { addMetricsStatusCode } from "../metrics/add-metrics-status-code.js";
import env from "../variables.js";
import http from "k6/http";
import { check } from "k6";

export function CreateCategory(category) {
  const payload = JSON.stringify(category);

  const headers = {
    "Content-Type": "application/json",
  };

  const res = http.post(`${env.baseUrl}/v1/categories`, payload, {
    headers,
  });

  check(res, {
    "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
  });

  addMetricsStatusCode(res.status);
}
