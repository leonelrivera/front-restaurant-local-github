<template>
  <!--  <q-page class="flex column"> -->
  <div class="q-pa-md q-gutter-md">
    <q-list bordered class="rounded-borders" style="width: 100%">
      <!--    <q-item-label header>Google Inbox style</q-item-label>
 -->
      <q-item>
        <q-item-section avatar top>
          <q-btn size="15px" flat dense round icon="delete" />
          <!-- <q-icon name="account_tree" color="black" size="34px" /> -->
        </q-item-section>

        <!--    <q-item-section top class="col-2">
            <q-item-label class="q-mt-sm">Hamburguesa con huevo </q-item-label>

          </q-item-section> -->

        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium">
              Cod. {{ id_product }} - {{ name_product }} Hamburguesa con
              huevo</span
            >
            <span class="text-grey-8">
              - Precio Unidad: ${{ price_product }}</span
            >
          </q-item-label>
          <q-item-label caption lines="1">
            Pedido Cant.: {{ cantPedida }} total precio: $
            {{ cantPedida * price_product }}
          </q-item-label>
          <!--            <q-item-label caption lines="1"> </q-item-label>
            <q-item-label lines="1">
              <span class="cursor-pointer">Open in GitHub</span>
            </q-item-label> -->
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <!-- desde aca -->
            <!--    <div class="center" style="width: 100px">
              <q-input
                size="15px"
                type="text"
                dense
                rounded
                outlined
                bottom-slots
                v-model="cantPedida"
                :rules="[
                  (val) => val >= 0 || 'Debe ingresar un valor mayor a 1',
                ]"
                input-class="text-center"
              >
                <template v-slot:prepend>
                  <q-icon
                    name="remove"
                    @click="
                      (cantPedida = cantPedida - 1),
                        (cantPedida = cantPedida < 0 ? 0 : cantPedida)
                    "
                    :disabled="cantPedida === 0 ? '' : disabled"
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
            </div> -->
            <!-- hasta aca -->
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <!--   </q-page> -->
</template>
<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
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
    cantPedida: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    let paraPedir = ref([]);

    return {
      paraPedir,
      //  cantPedidas: props.cantPedida,
    };
  },
});
</script>
