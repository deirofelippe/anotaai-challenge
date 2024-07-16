import { group } from "k6";

import faker from "k6/x/faker";
import http from "k6/http";
import { sleep, check } from "k6";

import optionsLoadTest from "./options-load.json";
import optionsSmokeTest from "./options-smoke.json";
import optionsSpikeTest from "./options-spike.json";
import optionsStressTest from "./options-stress.json";

import { CreateCategory } from "./requests/create-category.js";

import { URL } from "./libs/url.js";
import { CreateProduct } from "./requests/create-product";

/*
rampup, metrics, refactor, foreach create product, scenario

https://k6.io/blog/learning-js-through-load-testing/
*/

export const options = optionsSmokeTest;

function generateCategory() {
  const category = {
    owner: faker.number.number(1, 15),
    title: faker.product.productName(),
    description: faker.product.productDescription(),
  };

  return category;
}

function generateProduct(category) {
  const product = {
    owner: category.owner,
    category: category.title,
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
    title: category.title,
  });

  let updatedCategoryTitle = "";
  let updatedProductTitle = "";

  group("1. Create new category", () => {
    CreateCategory(category);
    sleep(1);
  });

  group("2. Create new product", () => {
    CreateProduct(product);
    sleep(1);
  });

  group("3. Update category", () => {
    updatedCategoryTitle = category.title + " Atualizado";

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

    const url = new URL(`${baseUrl}/v1/categories/${category.title}`);

    const res = http.patch(url.toString(), payload, {
      headers,
    });

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });

  group("4. Update product", () => {
    updatedProductTitle = product.title + " Atualizado";

    const payload = JSON.stringify({
      owner: category.owner,
      category: updatedCategoryTitle,
      product: product.title,
      fields: {
        title: updatedProductTitle,
        description: product.description + " Atualizado",
        price: faker.number.float32Range(50, 5000).toFixed(2),
      },
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const url = new URL(`${baseUrl}/v1/products/${product.title}`);

    const res = http.patch(url.toString(), payload, {
      headers,
    });

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });

  group("5. Delete product", () => {
    const url = new URL(`${baseUrl}/v1/products`);
    url.searchParams.append("title", updatedProductTitle);
    url.searchParams.append("category", updatedCategoryTitle);
    url.searchParams.append("owner", category.owner);

    const res = http.del(url.toString());

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });

  group("6. Delete category", () => {
    const url = new URL(`${baseUrl}/v1/categories`);
    url.searchParams.append("title", updatedCategoryTitle);
    url.searchParams.append("owner", category.owner);

    const res = http.del(url.toString());

    check(res, {
      "is status code 2xx": (r) => `${r.status}`.startsWith("2"),
    });

    addMetricsStatusCode(res.status);

    sleep(1);
  });
}
