import faker from "k6/x/faker";
import http from "k6/http";
import { sleep } from "k6";

/*
url dinamica: adicione tags na url PostsItemURL

http.get(`http://example.com/posts/${id}`, {
  tags: { name: 'PostsItemURL' },
}); */

export const options = {
  vus: 1,
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% das requisições devem responder em até 2s
    http_req_failed: ["rate<0.01"], // 1% das requisições podem falhar
  },
};

export const options = {
  stages: [
    { target: 5, duration: "5s" },
    { target: 10, duration: "10s" },
  ],
};

//cenario 1: cria owner, cria categoria, produto
//cenario 2: atualiza categoria, adiciona produto
//cenario 3: deleta produto, categoria
//cenario 4: atualiza categoria, deleta produto

//owner novo e owner antigo? cria categoria, cria produto

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

export function contacts() {
  http.get("https://test.k6.io/contacts.php", {
    tags: { my_custom_tag: "contacts" },
  });
}

function generateProduct() {
  return product;
}

function generateCategory() {}
