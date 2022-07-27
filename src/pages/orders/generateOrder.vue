<template>
  <q-page>
    <div class="q-pa-md">
      <q-dialog v-model="verProduct" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <!-- lista de products en el pedido -->
            <q-list style="width: 100%" class="rounded-borders">
              <div
                class="flex column"
                v-for="pedido in paraPedir"
                :key="pedido.id_product"
              >
                <q-item>
                  <q-item-section avatar top> </q-item-section>
                  <q-item-section
                    top
                    style="min-width: 400px; max-width: 600px"
                  >
                    <q-item-label lines="1">
                      <span class="text-weight-medium">
                        Cod. {{ pedido.id_product }} - {{ pedido.name_product }}
                      </span>
                      <span class="text-grey-8">
                        - Precio Unidad: ${{ pedido.price_product }}
                      </span>
                    </q-item-label>
                    <q-item-label caption lines="1">
                      Pedido Cant.: {{ pedido.cantPedida }} total precio: $
                      {{ pedido.cantPedida * pedido.price_product }}
                    </q-item-label>
                    <!-- <q-item-label caption lines="1"> </q-item-label>
                              <q-item-label lines="1">
                                <span class="cursor-pointer">Open in GitHub</span>
                              </q-item-label> -->
                    <!-- <q-input
                      dense
                      v-model="pedido.observaciones"
                      filled
                      label="Observaciones"
                      type="text"
                    /> -->
                  </q-item-section>

                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <!-- desde aca -->
                      <div class="center" style="width: 100px">
                        <q-input
                          readonly
                          type="text"
                          dense
                          rounded
                          outlined
                          bottom-slots
                          v-model="pedido.cantPedida"
                          :rules="[
                            (val) =>
                              val >= 0 || 'Debe ingresar un valor mayor a 1',
                          ]"
                          input-class="text-center"
                        >
                          <template v-slot:prepend>
                            <q-icon
                              name="remove"
                              @click="
                                (pedido.cantPedida = pedido.cantPedida - 1),
                                  (this.precioTotal =
                                    pedido.cantPedida < 0
                                      ? this.precioTotal
                                      : this.precioTotal -
                                        pedido.price_product),
                                  (pedido.cantPedida =
                                    pedido.cantPedida < 0
                                      ? 0
                                      : pedido.cantPedida)
                              "
                            />
                          </template>
                          <template v-slot:append>
                            <q-icon
                              name="add"
                              @click="
                                (pedido.cantPedida = pedido.cantPedida + 1),
                                  (this.precioTotal =
                                    this.precioTotal + pedido.price_product)
                              "
                              class="cursor-pointer"
                            />
                          </template>
                        </q-input>
                      </div>
                      <!-- hasta aca -->
                    </div>
                  </q-item-section>
                </q-item>
                <!-- </div> -->

                <q-separator />
              </div>
            </q-list>

            <!-- fin lista -->
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div style="width: 100%">
        <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
          <q-tab
            class="text-blue"
            name="pedidos"
            icon="store"
            label="Pedidos"
          />
          <q-tab
            class="text-green"
            name="carrito"
            icon="shopping_cart"
            label="Carrito"
            v-if="totalCarrito > 0"
          >
            <q-badge color="green" floating>{{ totalCarrito }} </q-badge>
          </q-tab>
          <q-tab class="text-teal" name="mispedidos" label="Mis Pedidos" />
        </q-tabs>

        <div class="q-gutter-y-sm">
          <!-- Productos -->
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="scale"
            transition-next="scale"
            class="bg-blue-2 text-black text-center"
          >
            <q-tab-panel name="pedidos">
              <div class="text-h6">Pedidos</div>
              <div class="q-gutter-y-md flex column" style="width: 100%">
                <q-input rounded bottom-slots v-model="text" @keyup="filtro">
                  <template v-slot:append>
                    <q-avatar>
                      <img src="~assets/boy-avatar.png" />
                    </q-avatar>
                  </template>
                </q-input>
              </div>
              <div class="row">
                <div v-for="product in allProducts" :key="product.id_product">
                  <ViewProduct v-bind="product" @addCard="getToCart" />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <!-- Carrito -->
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="fade"
            transition-next="fade"
            class="bg-green-1 text-red text-center"
          >
            <q-tab-panel name="carrito" class="">
              <div class="row">
                <q-space />
                <div class="text-h6">Carrito de compras</div>
                <q-space />
              </div>
              <q-separator />
              <q-list style="width: 100%" class="rounded-borders">
                <div
                  class="flex column"
                  v-for="pedido in paraPedir"
                  :key="pedido.id_product"
                >
                  <q-item>
                    <q-item-section avatar top>
                      <q-btn
                        flat
                        dense
                        round
                        icon="delete"
                        @click="
                          removeToCart({
                            id_product: pedido.id_product,
                            name_product: pedido.name_product,
                            price_product: pedido.price_product,
                            cantPedida: pedido.cantPedida,
                          })
                        "
                      />
                      <!-- <q-icon name="account_tree" color="black" size="34px"/> -->
                    </q-item-section>

                    <!-- <q-item-section top class="col-2">
                            <q-item-label class="q-mt-sm">Hamburguesa con huevo </q-item-label>
                          </q-item-section> -->
                    <q-item-section
                      top
                      style="min-width: 400px; max-width: 600px"
                    >
                      <q-item-label lines="1">
                        <span class="text-weight-medium">
                          Cod. {{ pedido.id_product }} -
                          {{ pedido.name_product }}
                        </span>
                        <span class="text-grey-8">
                          - Precio Unidad: ${{ pedido.price_product }}
                        </span>
                      </q-item-label>
                      <q-item-label caption lines="1">
                        Pedido Cant.: {{ pedido.cantPedida }} total precio: $
                        {{ pedido.cantPedida * pedido.price_product }}
                      </q-item-label>
                      <!-- <q-item-label caption lines="1"> </q-item-label>
                              <q-item-label lines="1">
                                <span class="cursor-pointer">Open in GitHub</span>
                              </q-item-label> -->
                      <!-- <q-input
                        dense
                        v-model="pedido.observaciones"
                        filled
                        label="Observaciones"
                        type="text"
                      /> -->
                    </q-item-section>

                    <q-item-section top side>
                      <div class="text-grey-8 q-gutter-xs">
                        <!-- desde aca -->
                        <div class="center" style="width: 100px">
                          <q-input
                            readonly
                            type="text"
                            dense
                            rounded
                            outlined
                            bottom-slots
                            v-model="pedido.cantPedida"
                            :rules="[
                              (val) =>
                                val >= 0 || 'Debe ingresar un valor mayor a 1',
                            ]"
                            input-class="text-center"
                          >
                            <template v-slot:prepend>
                              <q-icon
                                name="remove"
                                @click="
                                  (pedido.cantPedida = pedido.cantPedida - 1),
                                    (this.precioTotal =
                                      pedido.cantPedida < 0
                                        ? this.precioTotal
                                        : this.precioTotal -
                                          pedido.price_product),
                                    (pedido.cantPedida =
                                      pedido.cantPedida < 0
                                        ? 0
                                        : pedido.cantPedida)
                                "
                              />
                            </template>
                            <template v-slot:append>
                              <q-icon
                                name="add"
                                @click="
                                  (pedido.cantPedida = pedido.cantPedida + 1),
                                    (this.precioTotal =
                                      this.precioTotal + pedido.price_product)
                                "
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                        <!-- hasta aca -->
                      </div>
                    </q-item-section>
                  </q-item>
                  <!-- </div> -->

                  <q-separator />
                </div>
              </q-list>
              <div class="row">
                <q-btn
                  class="full-width"
                  color="teal"
                  push
                  @click="visible = !visible"
                >
                  <div class="row items-center no-wrap">
                    <q-icon left name="payment" />
                    <div class="text-center">
                      Total Pagar:
                      {{ precioTotal }}
                    </div>
                  </div>
                </q-btn>
                <q-slide-transition>
                  <div v-show="visible">
                    <q-form>
                      <div class="row full-width">
                        <div class="full-width">
                          <q-select
                            v-model="idPago"
                            :options="Payments"
                            label="Medios de Pago"
                            option-value="id_payment"
                            option-label="name_payment"
                            option-disable="inactive"
                            emit-value
                            map-options
                            lazy-rules
                            :rules="[
                              (val) =>
                                val !== null ||
                                `Please use maximum 3 characters - ${val}`,
                            ]"
                          >
                            <template v-slot:prepend>
                              <q-icon name="payment" />
                            </template>
                          </q-select>
                        </div>
                        <div class="full-width">
                          <q-input
                            square
                            clearable
                            v-model="address_order"
                            type="string"
                            label="Direccion de envio"
                          >
                            <template v-slot:prepend>
                              <q-icon name="home" />
                            </template>
                            {{ user.address_user }}
                          </q-input>
                        </div>
                        <div class="full-width">
                          <q-btn
                            unelevated
                            size="lg"
                            color="purple-4"
                            class="full-width text-white"
                            label="Guardar"
                            @click="addPedido"
                          />
                        </div>
                      </div>
                    </q-form>
                  </div>
                </q-slide-transition>
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <!-- Pedidos -->

          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="jump-up"
            transition-next="jump-down"
            class="bg-teal text-white text-center"
          >
            <q-tab-panel name="mispedidos">
              <div class="text-h6">Mis pedidos</div>
              <div class="q-pa-md">
                <q-table
                  title="Treats"
                  :rows="allPedidos"
                  :columns="columns"
                  row-key="id"
                  :filter="filter"
                  :loading="loading"
                >
                  <template v-slot:top>
                    <q-space />
                    <q-input
                      borderless
                      dense
                      debounce="300"
                      color="primary"
                      v-model="filter"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>

                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th auto-width />
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-btn
                          size="sm"
                          color="accent"
                          round
                          dense
                          @click="props.expand = !props.expand"
                          :icon="props.expand ? 'visibility_off' : 'visibility'"
                        />
                      </q-td>
                      <!-- id -->
                      <q-td key="id_order" :props="props">
                        {{ props.row.id_order }}
                      </q-td>

                      <!-- Pay -->
                      <q-td key="paygateway" :props="props">
                        <q-btn
                          v-if="props.row.state.name_state === 'Nuevo'"
                          color="lima-1"
                          icon="img:/icons/mpago.png"
                          @click="
                            paygateway(
                              props.row.totaltopay_order,
                              props.row.id_order
                            )
                          "
                        />
                        <q-btn
                          color="lima-1"
                          icon="img:/icons/paypal.png"
                          @click="
                            paypal(
                              props.row.totaltopay_order,
                              props.row.id_order
                            )
                          "
                          v-if="props.row.state.name_state == 'Nuevo'"
                        >
                        </q-btn>
                      </q-td>

                      <!-- Estado  -->
                      <q-td key="state" :props="props">
                        {{ props.row.state.name_state }}
                      </q-td>

                      <!-- Hora  -->
                      <q-td key="time_order" :props="props">
                        {{ props.row.time_order }}
                      </q-td>
                      <!-- direccion envio  -->
                      <q-td key="address_order" :props="props">
                        {{ props.row.address_order }}
                      </q-td>
                      <!-- Total a pagar  -->
                      <q-td key="totaltopay_order" :props="props">
                        {{ props.row.totaltopay_order }}
                      </q-td>
                      <!-- Medio de pago -->
                      <q-td key="payment" :props="props">
                        {{ props.row.payment.name_payment }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left">
                          <q-list style="width: 100%" class="rounded-borders">
                            <div
                              class="flex column"
                              v-for="producto in props.row.products"
                              :key="producto.name_product"
                            >
                              {{ producto.name_product }}:
                              {{
                                producto.order_product.quantity_order_product
                              }}

                              =
                              {{
                                producto.order_product
                                  .totalproductprice_order_product
                              }}
                            </div>
                          </q-list>
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { api } from "boot/axios";
import { ref, onMounted } from "vue";
import { useQuasar, SessionStorage } from "quasar";
import ViewProduct from "src/components/product/viewProduct.vue";
/* import ShoppingCart from "src/components/order/shoppingCart.vue"; */

const columns = [
  {
    name: "id_order",
    required: true,
    label: "Nro Pedido",
    align: "left",
    field: (row) => row.id_order,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "paygateway",
    align: "center",
    label: "Pago",
    field: "paygateway",
    sortable: true,
  },
  {
    name: "state",
    align: "center",
    label: "Estado",
    field: "state",
    sortable: true,
  },

  /* {
    name: "application_date",
    align: "center",
    label: "Fecha Pedido",
    field: "application_date",
    sortable: true,
  }, */
  /* {
    name: "request_time",
    align: "center",
    label: "Hora Pedido",
    field: "request_time",
    sortable: true,
  }, */
  {
    name: "time_order",
    align: "center",
    label: "Hora Pedido",
    field: "time_order",
    sortable: true,
  },
  {
    name: "address_order",
    align: "center",
    label: "Direccion de entrega",
    field: "address_order",
    sortable: true,
  },
  {
    name: "totaltopay_order",
    align: "center",
    label: "Total a Pagar",
    field: "totaltopay_order",
    sortable: true,
  },
  /*   {
    name: "users_id",
    align: "center",
    label: "User id",
    field: "users_id",
    sortable: true,
  }, */
  {
    name: "payment",
    align: "center",
    label: "Medio de pago id",
    field: "payment",
    sortable: true,
  },
];
let estados = [
  {
    id: 1,
    estado: "Nuevo",
    detalle: "cuando el usuario inicia su pedido.",
  },
  {
    id: 2,
    estado: "Preparación",
    detalle: "cuando el administrador comienza a preparar el pedido.",
  },
  {
    id: 3,
    estado: "Confirmado",
    detalle: "cuando el usuario cierra su pedido.",
  },
  {
    id: 4,
    estado: "Cancelado",
    detalle: "cuando el usuario cancela su pedido.",
  },
  {
    id: 5,
    estado: "Enviado",
    detalle: "cuando el administrador envía el pedido.",
  },
  {
    id: 6,
    estado: "Entregado",
    detalle: "cuando el administrador entrega el pedido.",
  },
];

export default {
  setup() {
    const step = ref(1);

    let data = ref([]);
    let user = ref([]);
    const $q = useQuasar();
    let allProducts = ref([]);
    let text = ref();
    let paraPedir = ref([]);
    let totalCarrito = ref(0);
    let precioTotal = ref(0);
    let address_order = ref("");
    const idPago = ref(1);

    const token = SessionStorage.getItem("jwt");
    const Payments = ref(null);
    async function cargarMediosPagos() {
      api
        .get("payments", {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          console.log("PAYMENT GET" + JSON.stringify(response.data.data));
          Payments.value = response.data.data;
          //    return JSON.stringify(response.data.data);
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `code: ${error.response.status} - Mensaje ${error}`,
            icon: "report_problem",
          });
        });
    }

    function returnProducts() {
      paraPedir.value.splice(0, paraPedir.value.length);
      totalCarrito.value = 0;
      precioTotal.value = 0;

      api
        .get("products", {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          console.log("PRODUCT GET " + JSON.stringify(response.data.data));
          data.value = response.data.data;
          allProducts.value = response.data.data;
          //    return JSON.stringify(response.data.data);
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `code: ${error.response.status} - Mensaje ${error}`,
            icon: "report_problem",
          });
        });
    }

    function getUsers() {
      api
        .get("users/list", {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          /* console.log(
            "USER GET LIST " + JSON.stringify(response.data.payload.dataUser)
          );
          console.log(
            "ADDRESS ORDER GET " +
              JSON.stringify(response.data.payload.dataUser.address_order)
          ); */

          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].state_user == 1) {
              data.value = response.data.data[i];
              /* console.log("USER DATA VALUE " + JSON.stringify(data.value)); */

              user.value = data.value;
              address_order.value = data.value.address_user;
              /* console.log(
                "USER  VALUE " +
                  JSON.stringify(user.value) +
                  "address user " +
                  JSON.stringify(address_order.value)
              ); */
              /* console.log("data value " + JSON.stringify(data.value)); */
            }
          }

          return JSON.stringify(response.data.data);
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: ` Mensaje ${error}`,
            icon: "report_problem",
          });
        });
    }

    let allPedidos = ref([]);

    function returnPedidos() {
      api
        .get("orders/get/user", {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          // data.value = response.data.data;
          console.log("order get" + JSON.stringify(response.data.data));
          allPedidos.value = response.data.data;
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `ORDER GET code: ${error.response.status} - Mensaje ${error}`,
            icon: "report_problem",
          });
        });
    }

    onMounted(() => {
      getUsers();
      returnProducts();
      cargarMediosPagos();
      returnPedidos();
    });

    const loading = ref(false);
    const filter = ref("");
    const rowCount = ref(10);
    const rows = ref([allPedidos]);
    let tab = ref("pedidos");

    return {
      async paygateway(totaltopay_order, id_order) {
        location.href =
          "http://localhost:4000/paygateway/mpago" +
          "?totaltopay_order=" +
          totaltopay_order +
          "&id_order=" +
          id_order;
      },

      async paypal(totaltopay_order, id_order) {
        const totalPagar = {
          precioPagar: totaltopay_order,
          id: id_order,
        };
        await api
          .post("paygateway/paypal/create-payment", totalPagar, {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            location.href = response.data.links[1].href;
            return true;
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "bottom",
              message: "No se pudo guardar el nuevo usuario",
              icon: "sentiment_very_dissatisfied",
            });
          });
      },

      async addPedido() {
        const pedidoNew = {
          address: address_order.value,
          payment: idPago.value,
        };

        await api
          .post("orders", pedidoNew, {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then(async (response) => {
            await paraPedir.value.forEach((producto) => {
              console.log(
                `idorden: ${response.data.id}, idProducto: ${producto.id_product}, cant_pedido: ${producto.cantPedida}`
              );
              let addProduct = {
                quantity: producto.cantPedida,
                /* observaciones: producto.observaciones, */
              };
              console.log("ORDER POST " + JSON.stringify(response.data.id));
              api
                .post(
                  `orders/${response.data.id}/products/${producto.id_product}`,
                  addProduct,
                  {
                    headers: {
                      accept: "application/json",
                      Authorization: token,
                    },
                  }
                )
                .then((response) => {
                  //  console.log(`euuu entre`);
                })
                .catch((error) => {
                  $q.notify({
                    color: "negative",
                    position: "bottom",
                    message: "No se pudo guardar la nueva orden",
                    icon: "sentiment_very_dissatisfied",
                  });
                });
            }),
              $q.notify({
                color: "positive",
                position: "bottom",
                message: `Se creo la orden ${address_order.value}`,
                icon: "mood",
              });

            return JSON.stringify(response.data);
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "bottom",
              message: "No se pudo guardar el nuevo usuario",
              icon: "sentiment_very_dissatisfied",
            });
          });
        // Recarga los pedidos
        returnProducts();
        setTimeout(() => {
          returnPedidos();
        }, 2000);
        tab.value = "mispedidos";
      },

      filtro() {
        allProducts.value = data.value.filter((row) =>
          row.name_product.includes(text.value)
        );
      },

      allProducts,
      paraPedir,
      text,
      data,
      step,
      tab,
      visible: ref(false),
      totalCarrito,
      precioTotal,
      Payments,
      idPago,
      user,
      address_order,

      // tabla
      columns,
      rows,
      loading,
      filter,
      rowCount,
      allPedidos,
      estados,
      verProduct: ref(false),
    };
  },
  methods: {
    getToCart(datos) {
      let pos = this.allProducts
        .map(function (e) {
          console.log("e id " + e.id + "e id_product " + e.id_product);
          console.log("cantPedida " + datos.cantPedida);
          return e.id_product;
        })
        .indexOf(datos["id_product"]);
      this.allProducts.splice(pos, 1);
      this.paraPedir.push(datos); // { nombre: data.nombre, apellido: data.apellido };
      this.totalCarrito = this.paraPedir.length;
      this.precioTotal =
        this.precioTotal + datos["cantPedida"] * datos["price_product"];
    },
    removeToCart(datos) {
      let pos = this.paraPedir
        .map(function (e) {
          return e.id_product;
        })
        .indexOf(datos["id_product"]);
      this.precioTotal =
        this.precioTotal - datos["cantPedida"] * datos["price_product"];
      this.paraPedir.splice(pos, 1);
      this.allProducts.push(datos); // { nombre: data.nombre, apellido: data.apellido };
      this.totalCarrito = this.paraPedir.length;
      if (this.totalCarrito === 0) {
        this.tab = "pedidos";
      }
    },
  },
  components: { ViewProduct /* ShoppingCart */ },
};
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
</style>
