import { addMetricsStatusCode } from "../metrics/add-metrics-status-code.js";
import env from "../variables.js";
import { URL } from "../libs/url.js";
import http from "k6/http";
import { check } from "k6";

export function UpdateCategory(category, updatedCategoryTitle) {
  const payload = JSON.stringify({
    owner: category.owner,
    fields: {
      title: updatedCategoryTitle,
      description: category.description + " Atualizado",
    },
  });

  const headers = {
    "Content-Type": "application/json",
  };

  const url = new URL(`${env.baseUrl}/v1/categories/${category.title}`);

  const res = http.patch(url.toString(), payload, {
    headers,
  });

  check(res, {
    "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
  });

  addMetricsStatusCode(res.status);
}
