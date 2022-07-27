<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-space />
          <q-btn color="purple" round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section> </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="priority_high" color="red" text-color="white" />
        <span class="q-ml-sm"
          >Esta seguro de eliminar el id: {{ idelim }} ?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="red" v-close-popup />
        <q-btn
          flat
          label="Confirmar"
          color="primary"
          @click="eliminar(idelim)"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--   <q-dialog v-model="verProduct" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <ViewProduct v-bind="sendProduct" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog> -->

  <!--   <pre>{{ data }}</pre> -->
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="allPedidos"
      :columns="columns"
      row-key="id"
      :filter="filter"
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
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
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
          <!-- Estado  -->
          <!-- <q-td key="state" :props="props">
            {{ props.row.state.name_state }}
          </q-td> -->
          <q-td key="state" :props="props">
            <!--    {{ estados[props.row.state_id - 1].estado }} -->
            {{ props.row.state.name_state }}
            <q-popup-edit
              v-model="props.row.state.name_state"
              v-slot="scope"
              title="estado"
              buttons
              label-set="Guardar"
              label-cancel="Cancelar"
              @save="
                (v, iv) => {
                  updatePedido(v.id, iv, props.row.id_order);
                }
              "
            >
              <q-select
                v-model="scope.value"
                :options="estados"
                option-value="id"
                option-label="estado"
                label="estado"
                behavior="menu"
                :rules="[(val) => val !== null || 'Debe seleccionar una state']"
              />
            </q-popup-edit>
          </q-td>

          <!-- fecha  -->
          <!-- <q-td key="application_date" :props="props">
            {{ props.row.application_date }}
          </q-td> -->
          <!-- Hora  -->
          <q-td key="time_order" :props="props">
            {{ props.row.time_order }}
          </q-td>
          <!-- <q-td key="request_time" :props="props">
            {{ props.row.request_time }}
          </q-td> -->
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
          <!-- <q-td key="payment_methods_id" :props="props">
            {{
              (qq = Payments.find((m) => m.id === props.row.payment_methods_id))
                .kind
            }}
          </q-td> -->
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
                  {{ producto.order_product.quantity_order_product }}

                  =
                  {{ producto.order_product.totalproductprice_order_product }}
                </div>
              </q-list>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { api } from "boot/axios";
import { ref, onMounted } from "vue";
import { useQuasar, SessionStorage } from "quasar";

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
    name: "state",
    align: "center",
    label: "Estado",
    field: "state",
    sortable: true,
  },
  /*  {
    name: "application_date",
    align: "center",
    label: "Fecha Pedido",
    field: "application_date",
    sortable: true,
  },
  {
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
  /* {
    name: "payment_methods_id",
    align: "center",
    label: "Medio de pago id",
    field: "payment_methods_id",
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
  },
  {
    id: 2,
    estado: "Confirmado",
  },
  {
    id: 3,
    estado: "Preparando",
  },
  {
    id: 4,
    estado: "Enviando",
  },
  {
    id: 5,
    estado: "Cancelado",
  },
  {
    id: 6,
    estado: "Entregado",
  },
];

export default {
  setup() {
    const $q = useQuasar();
    const token = SessionStorage.getItem("jwt");

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
          allPedidos.value = response.data.data;
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
          Payments.value = response.data.data;
          // return JSON.stringify(response.data.data);
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

    onMounted(() => {
      cargarMediosPagos();
      returnPedidos();
    });
    return {
      filter: ref(""),
      updatePedido(value, initialValue, id) {
        const estado = `{ "state": "${value}"  }`;
        console.log("value" + value + "id" + id);
        api
          .put(`orders/put/admin/${id}`, JSON.parse(estado), {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se actualizo al estado ${value} correctamente`,
              icon: "mood",
            });
            returnPedidos();
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "bottom",
              message: `Mensaje ${error}`,
              icon: "report_problem",
            });
          });
      },
      save(value, initialValue, id, field) {
        const pedido = `{ "${field}": "${value}"  }`;
        api
          .put(`orders/put/admin/${id}`, JSON.parse(pedido), {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se guardo el campo: ${field} con el nuevo valor ${value} correctamente`,
              icon: "mood",
            });
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "bottom",
              message: `Mensaje ${error}`,
              icon: "report_problem",
            });
          });
      },
      eliminar(id) {
        api
          .delete(`products/${id}`, {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se elimino el usuario id: ${this.idelim.value} correctamente`,
              icon: "mood",
            });
            returnProducts();
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "bottom",
              message: `Mensaje ${error}`,
              icon: "report_problem",
            });
          });
      },
      columns,
      rows: ref(allPedidos),
      allPedidos,
      Payments,
      estados,
      confirm: ref(false),
      // verProduct: ref(false),
      toolbar: ref(false),
      idelim: ref(0),

      // sendProduct: ref([]),
    };
  },
  components: {},
};
</script>
