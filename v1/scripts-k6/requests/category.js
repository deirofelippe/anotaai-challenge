import faker from "k6/x/faker";
import http from "k6/http";
import { sleep } from "k6";

function generateCategory() {
  const category = JSON.stringify({
    owner: faker.number.number(1, 15),
    title: faker.product.productName(),
    description: faker.product.productDescription(),
    itens: [],
  });

  return category;
}

export function createCategory() {
  const payload = generateCategory();

  const headers = {
    "Content-Type": "application/json",
  };

  http.post("http://localhost:3000/v1/categories", payload, { headers });
}

export function deleteCategory() {}

export function updateCategory() {}
