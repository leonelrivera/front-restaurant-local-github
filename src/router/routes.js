const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Index.vue"),
      },
      /*  {
        path: "login",
        name: "login",
        component: () => import("src/pages/login/login.vue"),
      }, */
      /* {
        path: "mediosPagos",
        name: "mediosPagos",
        component: () => import("src/pages/payments/listPayments.vue"),
      }, */
      {
        path: "nuevoPedido",
        name: "nuevoPedido",
        component: () => import("src/pages/orders/AddOrders.vue"),
      },
      {
        path: "productos",
        name: "productos",
        component: () => import("src/pages/products/listProducts.vue"),
      },
      {
        path: "users",
        name: "users",
        component: () => import("pages/users/listUsers.vue"),
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("src/pages/orders/generateOrder.vue"),
      },
      {
        path: "/orderStates",
        name: "orderStates",
        component: () => import("src/pages/orders/orderEstados.vue"),
      },
      {
        path: "/payments",
        name: "payments",
        component: () => import("pages/payments/payments.vue"),
      },
      {
        path: "/payments/create",
        name: "paymentscreate",
        component: () => import("pages/payments/create.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/login/login.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
