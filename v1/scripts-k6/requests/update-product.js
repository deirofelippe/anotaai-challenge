import { addMetricsStatusCode } from "../metrics/add-metrics-status-code.js";
import env from "../variables.js";
import faker from "k6/x/faker";
import { URL } from "../libs/url.js";
import http from "k6/http";
import { check } from "k6";

export function UpdateProduct(params) {
  const payload = JSON.stringify({
    owner: params.category.owner,
    category: params.updatedCategoryTitle,
    product: params.product.title,
    fields: {
      title: params.updatedProductTitle,
      description: params.product.description + " Atualizado",
      price: faker.number.float32Range(50, 5000).toFixed(2),
    },
  });

  const headers = {
    "Content-Type": "application/json",
  };

  const url = new URL(`${env.baseUrl}/v1/products/${params.product.title}`);

  const res = http.patch(url.toString(), payload, {
    headers,
  });

  check(res, {
    "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
  });

  addMetricsStatusCode(res.status);
}
