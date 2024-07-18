import { group } from "k6";
import faker from "k6/x/faker";
import { sleep } from "k6";

import optionsLoadTest from "./options-load.js";
import optionsSmokeTest from "./options-smoke.js";
import optionsSpikeTest from "./options-spike.js";
import optionsStressTest from "./options-stress.js";

import { CreateCategory } from "./requests/create-category.js";
import { CreateProduct } from "./requests/create-product.js";
import { DeleteProduct } from "./requests/delete-product.js";
import { DeleteCategory } from "./requests/delete-category.js";
import { UpdateProduct } from "./requests/update-product.js";
import { UpdateCategory } from "./requests/update-category.js";

export const options = optionsStressTest;

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

  const updatedCategoryTitle = category.title + " Atualizado";
  const updatedProductTitle = product.title + " Atualizado";

  group("1. Create new category", () => {
    CreateCategory(category);
    sleep(1);
  });

  group("2. Create new product", () => {
    CreateProduct(product);
    sleep(1);
  });

  group("3. Update category", () => {
    UpdateCategory(category, updatedCategoryTitle);
    sleep(1);
  });

  group("4. Update product", () => {
    UpdateProduct({
      category,
      updatedCategoryTitle,
      product,
      updatedProductTitle,
    });
    sleep(1);
  });

  group("5. Delete product", () => {
    DeleteProduct({
      category,
      updatedCategoryTitle,
      updatedProductTitle,
    });
    sleep(1);
  });

  group("6. Delete category", () => {
    DeleteCategory({
      category,
      updatedCategoryTitle,
    });
    sleep(1);
  });
}
