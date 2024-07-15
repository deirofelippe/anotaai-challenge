import faker from "k6/x/faker";
import http from "k6/http";
import { sleep, check } from "k6";

function generateCategory() {
  const category = JSON.stringify({
    owner: faker.number.number(1, 15),
    title: faker.product.productName(),
    description: faker.product.productDescription(),
  });

  return category;
}

export function CreateCategory() {
  const payload = generateCategory();

  const headers = {
    "Content-Type": "application/json",
  };

  const res = http.post("http://localhost:3000/v1/categories", payload, {
    headers,
  });

  check(res, {
    "is status 200": (r) => r.status === 201,
  });

  sleep(1);
}

export function DeleteCategory() {}

export function UpdateCategory() {}
