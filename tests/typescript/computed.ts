import { Computed, computed, createStore } from 'easy-peasy';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductsModel {
  products: Product[];
  totalPrice: Computed<ProductsModel, number>;
  totalPriceVerbose: Computed<ProductsModel, number>;
  priceForProduct: Computed<ProductsModel, (id: number) => number>;
}

interface BasketModel {
  productIds: number[];
  products: Computed<BasketModel, Product[], StoreModel>;
}

interface StoreModel {
  products: ProductsModel;
  baskets: BasketModel;
  one: string;
  two: boolean;
  three: number;
  four: Set<boolean>;
  five: Date;
  six: Map<string, number>;
  bigComputed: Computed<StoreModel, boolean>;
  dependentComputed: Computed<StoreModel, boolean>;
}

const model: StoreModel = {
  products: {
    products: [{ id: 1, name: 'boots', price: 20 }],
    totalPrice: computed((state) =>
      state.products.reduce((total, product) => total + product.price, 0),
    ),
    totalPriceVerbose: computed([(state) => state.products], (products) => {
      return products.reduce((total, product) => total + product.price, 0);
    }),
    priceForProduct: computed((state) => (id) => state.products[id].price),
  },
  baskets: {
    productIds: [1],
    products: computed(
      [
        (state) => state.productIds,
        (state, storeState) => storeState.products.products,
      ],
      (productIds, products) =>
        productIds.reduce<Product[]>((acc, id) => {
          const product = products.find((p) => p.id === id);
          if (product) {
            acc.push(product);
          }
          return acc;
        }, []),
    ),
  },
  one: 'one',
  two: true,
  three: 3,
  four: new Set(),
  five: new Date(),
  six: new Map(),
  bigComputed: computed(
    [
      (state) => state.one,
      (state) => state.two,
      (state) => state.three,
      (state) => state.four,
      (state) => state.five,
      (state) => state.six,
    ],
    (one, two, three, four, five, six) => {
      `${one}foo`;
      two === true;
      three + 3;
      four.has(true);
      five.getMilliseconds();
      six.set('foo', 6);
      return true;
    },
  ),
  dependentComputed: computed(
    [(state) => state.bigComputed],
    (bigComputed) => bigComputed,
  ),
};

const store = createStore(model);

store.getState().products.priceForProduct(1) + 1;
store.getState().products.totalPrice + 1;
