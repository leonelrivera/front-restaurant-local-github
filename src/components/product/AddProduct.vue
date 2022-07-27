<template>
  <div class="full-width row wrap justify-center items-start content-start">
    <div class="column q-pa-lg">
      <q-card square class="shadow-24" style="width: 300px; height: 100%">
        <q-card-section class="bg-deep-purple-7">
          <h4 class="text-h5 text-white q-my-md">Nuevo Producto</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="q-px-sm q-pt-xl q-pb-lg">
            <q-input
              square
              clearable
              v-model="name"
              type="name"
              label="Descripción"
            >
              <template v-slot:prepend>
                <q-icon name="inventory" />
              </template>
            </q-input>

            <q-input
              square
              clearable
              v-model="price"
              type="price"
              label="price"
            >
              <template v-slot:prepend>
                <q-icon name="price_change" />
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
            @click="addUser"
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
import { ref, defineComponent } from "vue";
import { api } from "boot/axios";
import { useQuasar, SessionStorage } from "quasar";
export default defineComponent({
  name: "AddProduct",
  setup() {
    const $q = useQuasar();
    const token = SessionStorage.getItem("jwt");
    const name = ref(null);
    const price = ref(null);
    const datos = ref(null);

    return {
      async addUser() {
        const productNew = {
          name_product: name.value,
          price_product: price.value,
        };
        console.log(`user ${JSON.stringify(productNew)}`);
        await api
          .post("products", productNew, {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            console.log("datos " + JSON.stringify(response.data));

            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se creo el producto ${name.value}`,
              icon: "mood",
            });
            return JSON.stringify(response.data);
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "bottom",
              message: "No se pudo guardar el nuevo producto",
              icon: "sentiment_very_dissatisfied",
            });
            console.log("error", error);
          });
        console.log(datos);
      },
      datos,
      name_produ,
    };
  },
});
</script>
