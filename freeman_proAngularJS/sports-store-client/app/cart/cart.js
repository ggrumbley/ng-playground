angular
  .module('app.cart', [])
  .factory("CartService", CartService)
  .directive("cartSummary", cartSummary);

function CartService() {
  let cartData = [];

  return {
    addProduct: (id, name, price) => {
      let addedToExistingItem = false;
      cartData.map((i) => {
        if (i.id == id) {
          i.count++;
          addedToExistingItem = true;
        }
      });

      if (!addedToExistingItem) cartData.push({ count: 1, id, price, name });
    },
    removeProduct: (id) => {
      cartData.map((i) => {
        if (i.id == id) cartData.splice(i, 1);
      })
    },

    getProducts: () => cartData
  }
}

function cartSummary(CartService) {

  function CartSummaryController() {
    const cs = this;

    const cartData = CartService.getProducts();

    cs.total = () => cartData.reduce((total, x) => total += (x.price * x.count), 0);

    cs.itemCount = () => cartData.reduce((total, x) => total += x.count, 0);

  }

  const directive = {
    restrict: "E",
    templateUrl: "app/cart/_cart-Summary.html",
    controller: CartSummaryController,
    controllerAs: 'cs',
    bindToController: true
  };
  return directive;
};
