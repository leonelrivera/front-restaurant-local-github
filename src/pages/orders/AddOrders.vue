<template>
  <div class="full-width row wrap justify-center items-start content-start">
    <div class="column q-pa-lg">
      <q-badge color="secondary" multi-line> Model: "{{ idPago }}" </q-badge>
      <q-card square class="shadow-24" style="width: 300px; height: 100%">
        <q-card-section class="bg-deep-purple-7">
          <h4 class="text-h5 text-white q-my-md">Nuevo Pedido</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="q-px-sm q-pt-xl q-pb-lg">
            <q-select
              v-model="idPago"
              :options="mediosPagos"
              label="Medios de Pago"
              option-value="id"
              option-label="kind"
              option-disable="inactive"
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="payment" />
              </template>
            </q-select>
            <br />
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
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-lg">
          <q-btn
            unelevated
            size="lg"
            color="purple-4"
            class="full-width text-white"
            label="Guardar"
            @click="addPedido"
          />
        </q-card-actions>
        <!--    <q-card-section class="text-center q-pa-sm">
          <p class="text-grey-6">Return to login</p>
        </q-card-section> -->
      </q-card>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, defineComponent } from "vue";
import { api } from "boot/axios";
import { useQuasar, SessionStorage } from "quasar";
export default defineComponent({
  name: "AddProduct",
  setup() {
    const $q = useQuasar();
    const token = SessionStorage.getItem("jwt");
    const address_order = ref(null);
    const idPago = ref(null);
    const mediosPagos = ref(null);
    async function cargarMediosPagos() {
      api
        .get("payments", {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          /* console.log("datos " + JSON.stringify(response.data.data)); */
          mediosPagos.value = response.data.data;
          //    return JSON.stringify(response.data.data);
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `code: ${error.response.status} - Mensaje ${error}`,
            icon: "report_problem",
          });
          /* } */
          console.log(error);
        });
    }

    onMounted(() => {
      cargarMediosPagos();
    });

    return {
      async addPedido() {
        const pedidoNew = {
          address: address_order.value,
          id_payment: idPago.value,
        };
        console.log(`pedido ${JSON.stringify(pedidoNew)}`);

        await api
          .post("orders", pedidoNew, {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se creo el usuario ${address_order.value}`,
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
            console.log("error", error);
          });
      },
      mediosPagos,
      address_order,
      idPago,
    };
  },
});
</script>
