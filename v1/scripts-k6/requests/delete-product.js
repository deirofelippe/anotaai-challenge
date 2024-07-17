import { addMetricsStatusCode } from "../metrics/add-metrics-status-code.js";
import env from "../variables.js";
import { URL } from "../libs/url.js";
import http from "k6/http";
import { check } from "k6";

export function DeleteProduct(params) {
  const url = new URL(`${env.baseUrl}/v1/products`);
  url.searchParams.append("title", params.updatedProductTitle);
  url.searchParams.append("category", params.updatedCategoryTitle);
  url.searchParams.append("owner", params.category.owner);

  const res = http.del(url.toString());

  check(res, {
    "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
  });

  addMetricsStatusCode(res.status);
}
