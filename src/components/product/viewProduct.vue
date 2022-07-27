<template>
  <div class="row q-pa-md items-start q-gutter-md">
    <q-card class="my-card">
      <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="add_shopping_cart"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
          v-if="cantPedida > 0"
          @click="setToCart"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ name_product }}</div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <!--  <q-icon name="place" /> -->
            Cod. {{ id_product }}
          </div>
        </div>

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="fit row wrap justify-start items-center content-stretch">
          <div class="col text-h6 ellipsis" style="width: 200px">
            Precio ${{ price_product }}
          </div>
          <!-- <div class="text-subtitle1" >$ {{ price_product }}</div> -->
          <div style="width: 120px">
            <q-input
              dense
              rounded
              outlined
              bottom-slots
              v-model="cantPedida"
              :rules="[(val) => val >= 0 || 'Debe ingresar un valor mayor a 1']"
              input-class="text-center"
            >
              <template v-slot:prepend>
                <q-icon
                  name="remove"
                  @click="
                    (cantPedida = cantPedida - 1),
                      (cantPedida = cantPedida < 0 ? 0 : cantPedida)
                  "
                />
              </template>
              <template v-slot:append>
                <q-icon
                  name="add"
                  @click="cantPedida = cantPedida + 1"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
        </div>

        <div class="col text-h9 ellipsis text-grey text-right">
          Precio Total {{ cantPedida * price_product }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <!--   <q-btn flat round icon="event" /> -->
        <q-space />

        <!--         <q-btn flat color="primary" v-if="cantPedida > 0"> Perdir </q-btn>
 -->
        <!--  <q-btn flat color="primary" v-if="cantPedida == 0"> Cancelar </q-btn> -->
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ViewProduct",
  props: {
    id_product: {
      type: Number,
      required: true,
    },
    name_product: {
      type: String,
      required: true,
    },

    price_product: {
      type: Number,
      default: 0,
    },
  },

  setup() {
    return {
      cantPedida: ref(1),
      stars: ref(4),
    };
  },
  methods: {
    setToCart() {
      this.$emit("addCard", {
        id_product: this.id_product,
        name_product: this.name_product,
        price_product: this.price_product,
        cantPedida: this.cantPedida,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 300px
</style>
