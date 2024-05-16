import faker from "k6/x/faker";
import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 10,
  duration: "5s",
};

export default function () {
  const payload = JSON.stringify({
    owner: faker.number.number(1, 15),
    title: faker.product.productName(),
    description: faker.product.productDescription(),
  });

  const headers = {
    "Content-Type": "application/json",
  };

  http.post("http://localhost:3000/v1/categories", payload, { headers });

  sleep(1);
}
