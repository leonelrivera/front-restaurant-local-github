<template>
  <q-page padding>
    <!-- <pre>{{ rows }}</pre>
    <pre>{{ data }}</pre> -->

    <div class="q-pa-md">
      <q-table title="Payments" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-btn color="primary" label="Create" @click="add = true" />

          <q-dialog v-model="add" persistent>
            <q-card>
              <q-card-section>
                <q-input
                  ref="nameRef"
                  filled
                  name="name_payment"
                  v-model="name"
                  label="Name Payment"
                  hint="Name  payment"
                  lazy-rules
                  :rules="nameRules"
                />
              </q-card-section>
              <q-card-section class="q-gutter-sm">
                <q-btn label="Create" color="primary" @click="onSubmit()" />
                <q-btn color="primary" label="Cancel" @click="add = false" />
              </q-card-section>
            </q-card>
          </q-dialog>

          <!-- <q-dialog v-model="edit" persistent>
            <q-card>
              <q-card-section>
                <q-input
                  ref="nameRef"
                  filled
                  name="name_payment"
                  v-model="name"
                  label="Name Payment"
                  hint="Name  payment"
                  lazy-rules
                  :rules="nameRules"
                />
              </q-card-section>
              <q-card-section class="q-gutter-sm">
                <q-btn label="Update" color="primary" @click="onSubmit()" />
                <q-btn color="primary" label="Cancel" @click="edit = false" />
              </q-card-section>
            </q-card>
          </q-dialog> -->
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id_payment" :props="props">{{
              props.row.id_payment
            }}</q-td>
            <q-td key="name_payment" :props="props">
              {{ props.row.name_payment }}
              <q-popup-edit
                v-model="props.row.name_payment"
                title="Edit the Name Payment"
                auto-save
                buttons
                label-set="save"
                label-cancel="cancel"
                @save="
                  (v, iv) => {
                    onSave(v, iv, props.row.id_payment);
                  }
                "
                v-slot="scope"
              >
                <q-input
                  name="name_payment"
                  type="text"
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="
                    scope.set && editPayments(props.row.id_payment, scope.value)
                  "
                />
              </q-popup-edit>
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-gutter-sm">
                <!-- <q-btn
                  color="yellow"
                  text-color="black"
                  label="Edit"
                  @click="editPayments(props.row.id_payment)"
                ></q-btn> -->
                <q-btn
                  color="red"
                  text-color="black"
                  label="Delete"
                  @click="deleteOption(props.row.id_payment)"
                />
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn
                color="yellow"
                text-color="black"
                label="Edit"
                @click="captureId(props.row.id_payment) && (edit = true)"
              ></q-btn>
              <q-btn
                color="red"
                text-color="black"
                label="Delete"
                @click="deleteOption(props.row.id_payment)"
              />
            </div>
          </q-td>
        </template> -->
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const columns = [
  {
    name: "id_payment",
    required: true,
    label: "Id Payment",
    align: "left",
    field: (row) => row.id_payment,
    sortable: true,
  },
  {
    name: "name_payment",
    align: "center",
    label: "Name Payment",
    field: "name_payment",
    sortable: true,
  },
  //BOTON EDITAR ELEIMINAR
  {
    name: "actions",
    align: "center",
    label: "Actions",
  },
];

export default {
  setup() {
    const $q = useQuasar();

    const router = useRouter();
    const route = useRoute();

    //add payment
    const name = ref(null);
    const nameRef = ref(null);

    //lista payment
    let rows = ref([]);

    //list payment
    function payments() {
      api
        .get("payments", {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("datos " + JSON.stringify(response.data.data));
          rows.value = response.data.data;
          // return JSON.stringify(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    //add payment
    function addPayments() {
      api
        .post("payments", {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          name_payment: name.value,
        })
        .then((response) => {
          //console.log(response);
          console.log("name " + name.value);
          payments();
          name.value = "";
        })
        .catch((error) => {
          console.log(error);
        });
    }

    //onSave
    function onSave(name_payment, datoviejo, id_payment) {
      console.log("id_payment " + id_payment + " name_payment " + name_payment);
      editPayments(id_payment, name_payment);
    }

    //edit payment
    function editPayments(id_payment, name_payment) {
      api
        .put("payments/" + id_payment, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          name_payment: name_payment,
        })
        .then((response) => {
          //console.log(response);
          console.log("edit name " + name_payment + " id " + id_payment);
          payments();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    //delete payment
    function deleteOption(id_payment) {
      $q.dialog({
        title: "Delete Payment",
        message: "Do you want to delete payment method?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        console.log(">>>> OK");
        deletePayment(id_payment);
      });
    }

    function deletePayment(id_payment) {
      api
        .delete("payments/" + id_payment, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("datos " + JSON.stringify(response.data.data));
          console.log("id_payment " + id_payment);
          payments();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    /* function captureId(id_payment) {
      console.log("id_payment " + id_payment);
      const idCapture = id_payment;
      console.log("idCapture " + idCapture);
      return idCapture;
    } */

    onMounted(() => {
      payments();
    });

    return {
      columns,
      rows,
      deletePayment,
      deleteOption,
      editPayments,
      payments,
      /* captureId, */
      onSave,
      name,
      nameRef,
      nameRules: [(val) => (val && val.length > 0) || "Please type something"],
      add: ref(false),
      edit: ref(false),

      //add payment
      onSubmit() {
        nameRef.value.validate();

        if (nameRef.value.hasError) {
          $q.notify({
            color: "negative",
            textColor: "white",
            message: "Please type something",
          });
          // form has error
        } else {
          $q.notify({
            icon: "done",
            color: "positive",
            message: "Submitted",
          });
          /* if (this.add === true) {
            addPayments();
            this.add = false;
          } else {
            editPayment(this.captureId());
            this.edit = false;
          } */
          addPayments();
          this.add = false;
        }
      },
    };
  },
};
</script>
