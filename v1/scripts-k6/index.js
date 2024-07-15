import { group } from "k6";
import exec from "k6/execution";
import { Counter } from "k6/metrics";

import faker from "k6/x/faker";
import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "1s", target: 25 },
    { duration: "1s", target: 25 },
    { duration: "1s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95) < 2000"], // 95% das requisições devem responder em até 2s
    http_req_failed: ["rate < 0.01"], // 1% das requisições podem falhar
  },
};

const url = "http://localhost:3000";

const metricStatusCode200 = new Counter("status_code_200");
const metricStatusCode201 = new Counter("status_code_201");
const metricStatusCode204 = new Counter("status_code_204");
const metricStatusCode422 = new Counter("status_code_422");
const metricStatusCode500 = new Counter("status_code_500");

function addMetricsStatusCode(statusCode) {
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

function generateCategory() {
  const category = {
    owner: faker.number.number(1, 15),
    title: faker.product.productName(),
    description: faker.product.productDescription(),
  };

  return category;
}

function generateProduct(catalog) {
  const product = {
    owner: catalog.owner,
    category: catalog.category,
    title: faker.product.productName(),
    description: faker.product.productDescription(),
    price: faker.number.float32Range(50, 5000).toFixed(2),
  };

  return product;
}

export default function () {
  const category = generateCategory();
  const product = generateProduct({
    owner: category.owner,
    category: category.title,
  });
  let updatedCategoryTitle = "";

  group("1. Create new category", () => {
    const payload = JSON.stringify(category);

    const headers = {
      "Content-Type": "application/json",
    };

    const res = http.post(`${url}/v1/categories`, payload, {
      headers,
    });

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });

  group("2. Create new product", () => {
    const payload = JSON.stringify(product);

    const headers = {
      "Content-Type": "application/json",
    };

    const res = http.post(`${url}/v1/products`, payload, {
      headers,
    });

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });

  group("3. Update category", () => {
    updatedCategoryTitle = category.title + " Atualizado";

    const payload = JSON.stringify({
      owner: category.owner,
      category: category.title,
      fields: {
        title: updatedCategoryTitle,
        description: category.description + " Atualizado",
      },
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const res = http.patch(`${url}/v1/categories`, payload, {
      headers,
    });

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });

  group("4. Update product", () => {
    const payload = JSON.stringify({
      owner: category.owner,
      category: updatedCategoryTitle,
      product: product.title,
      fields: {
        title: product.title + " Atualizado",
        description: product.description + " Atualizado",
        price: faker.number.float32Range(50, 5000).toFixed(2),
      },
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const res = http.patch(`${url}/v1/products`, payload, {
      headers,
    });

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });

  // group("5. Delete category", () => {
  //   CreateCategory();
  // });

  // group("6. Delete product", () => {
  //   CreateCategory();
  // });
}