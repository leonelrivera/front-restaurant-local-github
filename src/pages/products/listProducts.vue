<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-space />
          <q-btn color="purple" round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <AddProduct />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="priority_high" color="red" text-color="white" />
        <span class="q-ml-sm"
          >Esta seguro de eliminar el id_product: {{ idelim }} ?</span
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

  <q-dialog v-model="verProduct" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <ViewProduct v-bind="sendProduct" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!--   <pre>{{ data }}</pre> -->
  <div class="q-pa-md">
    <q-btn
      class="q-mb-md"
      round
      color="purple"
      icon="add"
      @click="toolbar = true"
    />

    <q-table
      title="Lista Productos"
      :rows="rows"
      :columns="columns"
      row-key="id_product"
      :filter="filter"
      binary-state-sort
    >
      <template v-slot:top>
        <div class="col-2 q-table__title">Productos</div>
        <q-space />
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
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
              round
              color="red"
              glossy
              @click="(confirm = !confirm), (idelim = props.key)"
              icon="delete"
          /></q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              round
              color="accent"
              glossy
              @click="
                (verProduct = !verProduct),
                  (sendProduct = {
                    id_product: props.key,
                    name_product: props.row.name_product,
                    price_product: props.row.price_product,
                  })
              "
              icon="visibility"
          /></q-td>
          <q-td key="id_product" :props="props">
            {{ props.row.id_product }}
            <!--      <q-popup-edit v-model="props.row.id_product" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter />
            </q-popup-edit> -->
          </q-td>
          <q-td key="name_product" :props="props">
            {{ props.row.name_product }}
            <q-popup-edit
              v-model="props.row.name_product"
              v-slot="scope"
              title="Descripcion"
              buttons
              label-set="Guardar"
              label-cancel="Cancelar"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'name');
                }
              "
            >
              <q-input type="text" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="price_product" :props="props">
            <div class="text-pre-wrap">{{ props.row.price_product }}</div>
            <q-popup-edit
              v-model="props.row.price_product"
              v-slot="scope"
              title="Precio"
              buttons
              label-set="Guardar"
              label-cancel="Cancelar"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'price');
                }
              "
            >
              <q-input type="text" v-model="scope.value" dense autofocus />
            </q-popup-edit>
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
import AddProduct from "../../components/product/AddProduct.vue";
import ViewProduct from "src/components/product/viewProduct.vue";

const columns = [
  {
    name: "id_product",
    required: true,
    label: "Id",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "name_product",
    align: "center",
    label: "Descripcion",
    field: "name_product",
    sortable: true,
  },
  {
    name: "price_product",
    label: "Precio",
    field: "price_product",
    sortable: true,
    style: "width: 10px",
  },
];

export default {
  setup() {
    const $q = useQuasar();
    const token =
      SessionStorage.getItem("jwt") === null
        ? ""
        : SessionStorage.getItem("jwt");
    const data = ref([]);
    function returnProducts() {
      console.log(`token ${token}`);
      api
        .get("products", {
          headers: {
            accept: "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          /* console.log("datos " + JSON.stringify(response.data.data)); */
          data.value = response.data.data;
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
      returnProducts();
    });
    return {
      filter: ref(""),
      save(value, initialValue, id_product, field) {
        const product = `{ "${field}": "${value}"  }`;
        console.log(`product ${product}`);
        api
          .put(`products/${id_product}`, JSON.parse(product), {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(`product actualizado `);
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se guardo el campo: ${field} con el nuevo valor ${value} correctamente`,
              icon: "mood",
            });
          })
          .catch((error) => {
            console.log(`product no actualizado ${error}`);
            $q.notify({
              color: "negative",
              position: "bottom",
              message: `Mensaje ${error}`,
              icon: "report_problem",
            });
          });
      },
      eliminar(id_product) {
        console.log(`url usuarios/${id_product}`);
        api
          .delete(`products/${id_product}`, {
            headers: {
              accept: "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(`Registro eliminado`);
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se elimino el usuario id_product: ${this.idelim.value} correctamente`,
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
      rows: ref(data),
      data,
      confirm: ref(false),
      verProduct: ref(false),
      toolbar: ref(false),
      idelim: ref(0),
      sendProduct: ref([]),
    };
  },
  components: { AddProduct, ViewProduct },
};
</script>
