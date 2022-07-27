<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <!--  <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">Quasar</span>
            Framework</q-toolbar-title
          >
-->
          <q-space />
          <q-btn color="purple" round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <AddUser />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="priority_high" color="red" text-color="white" />
        <span class="q-ml-sm"
          >Be sure to remove the ID user: {{ idelim }} ?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="red" v-close-popup />
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

  <!--  <pre>{{ data }}</pre> -->
  <div class="q-pa-md">
    <q-table
      title="List Users"
      :rows="rows"
      :columns="columns"
      row-key="id_user"
      binary-state-sort
    >
      <template v-slot:top>
        <div class="col-2 q-table__title">Lista de users del sistema</div>
        <q-space />
        <q-btn round color="purple" icon="add" @click="toolbar = true" />
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
              round
              color="red"
              glossy
              @click="(confirm = !confirm), (idelim = props.key)"
              icon="delete"
          /></q-td>
          <q-td key="id_user" :props="props">
            {{ props.row.id_user }}
            <!--      <q-popup-edit v-model="props.row.id_user" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter />
            </q-popup-edit> -->
          </q-td>
          <q-td key="username_user" :props="props">
            {{ props.row.username_user }}
            <q-popup-edit
              v-model="props.row.username_user"
              v-slot="scope"
              title="Update user"
              buttons
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'username');
                }
              "
            >
              <q-input type="text" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="namelastname_user" :props="props">
            <div class="text-pre-wrap">{{ props.row.namelastname_user }}</div>
            <q-popup-edit
              v-model="props.row.namelastname_user"
              v-slot="scope"
              title="Update Name "
              buttons
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'namelastname');
                }
              "
            >
              <q-input type="text" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>

          <q-td key="email_user" :props="props">
            {{ props.row.email_user }}
            <q-popup-edit
              v-model="props.row.email_user"
              title="Email"
              buttons
              persistent
              v-slot="scope"
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'email');
                }
              "
            >
              <q-input
                type="text"
                v-model="scope.value"
                dense
                autofocus
                hint="Debe ingresar un email"
              />
            </q-popup-edit>
          </q-td>
          <!--  -->
          <q-td key="phone_user" :props="props"
            >{{ props.row.phone_user }}
            <q-popup-edit
              v-model="props.row.phone_user"
              title="Phone"
              buttons
              persistent
              v-slot="scope"
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'phone');
                }
              "
            >
              <q-input
                type="number"
                v-model="scope.value"
                dense
                autofocus
                hint="You must enter a mobile number"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="address_user" :props="props"
            >{{ props.row.address_user }}
            <q-popup-edit
              v-model="props.row.address_user"
              title="Address"
              buttons
              persistent
              v-slot="scope"
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'address');
                }
              "
            >
              <q-input
                type="text"
                v-model="scope.value"
                dense
                autofocus
                hint="You must enter a address"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="password_user" :props="props"
            >{{ props.row.password_user }}
            <q-popup-edit
              v-model="props.row.password_user"
              title="Password"
              buttons
              persistent
              v-slot="scope"
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'password');
                }
              "
            >
              <q-input
                type="password"
                v-model="scope.value"
                dense
                autofocus
                hint="You must enter a password"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="state_user" :props="props"
            >{{ props.row.state_user }}
            <q-popup-edit
              v-model="props.row.state_user"
              title="State"
              buttons
              persistent
              v-slot="scope"
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'state');
                }
              "
            >
              <q-input
                type="bool"
                v-model="scope.value"
                dense
                autofocus
                hint="You must enter a state"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="active_user" :props="props"
            >{{ props.row.active_user }}
            <q-popup-edit
              v-model="props.row.active_user"
              title="Active"
              buttons
              persistent
              v-slot="scope"
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'active');
                }
              "
            >
              <q-input
                type="bool"
                v-model="scope.value"
                dense
                autofocus
                hint="You must enter a active"
              />
            </q-popup-edit>
          </q-td>

          <q-td key="role" :props="props"
            >{{ props.row.id_role }}
            <q-popup-edit
              v-model="props.row.id_role"
              title="Rol"
              buttons
              persistent
              v-slot="scope"
              label-set="Save"
              label-cancel="Cancel"
              @save="
                (v, iv) => {
                  save(v, iv, props.key, 'role');
                }
              "
            >
              <q-input
                type="number"
                v-model="scope.value"
                dense
                autofocus
                hint="You must enter 1-Admin 2-User"
              />
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
import AddUser from "src/components/user/AddUser.vue";

const columns = [
  {
    name: "id_user",
    required: true,
    label: "Id Users",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "username_user",
    align: "center",
    label: "Users",
    field: "username",
    sortable: true,
  },
  {
    name: "namelastname_user",
    label: "Name Users",
    field: "namelastname",
    sortable: true,
    style: "width: 10px",
  },
  { name: "email_user", label: "Email", field: "email" },
  { name: "phone_user", label: "Phone", field: "phone" },
  {
    name: "address_user",
    label: "Address",
    field: "address",
  },
  {
    name: "password_user",
    label: "Password",
    field: "password",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "state_user",
    label: "Satate",
    field: "state",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "active_user",
    label: "Active",
    field: "active",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "role",
    label: "Rol",
    field: "role",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

export default {
  setup() {
    const $q = useQuasar();
    const token = SessionStorage.getItem("jwt");
    const data = ref([]);
    function returnUsers() {
      api
        .get("users/list", {
          headers: {
            accept: "application/json",
            //Authorization: "Bearer " + localStorage.getItem("token"),
            Authorization: token,
          },
        })
        .then((response) => {
          console.log("user list " + JSON.stringify(response.data.data));
          /* console.log("datos " + JSON.stringify(response.data.data)); */
          data.value = response.data.data;
          //    return JSON.stringify(response.data.data);
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `code: ${error} - Mensaje ${error}`,
            icon: "report_problem",
          });
          /* } */
          console.log(error);
        });
    }
    onMounted(() => {
      returnUsers();
    });
    return {
      save(value, initialValue, id_user, field) {
        console.log(
          `save value ${value} - ivalue  ${initialValue} -iduser  ${id_user} -field  ${field}`
        );
        const usuario = `{ "${field}": "${value}"  }`;
        console.log(usuario);
        console.log(JSON.parse(usuario));
        console.log(JSON.stringify(usuario));
        api
          .put(`users/modificar/${id_user}`, JSON.parse(usuario), {
            headers: {
              accept: "application/json",
              //Authorization: "Bearer " + localStorage.getItem("token"),
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(`Updated user `);
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `The field was saved with the new value ${value} successfully`,
              icon: "mood",
            });
          })
          .catch((error) => {
            console.log(`User not updated ${error}`);
            $q.notify({
              color: "negative",
              position: "bottom",
              message: `Mensaje ${error}`,
              icon: "report_problem",
            });
          });
      },
      eliminar(id_user) {
        console.log(`url users/${id_user}`);
        api
          .delete(`users/${id_user}`, {
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
              message: ` The user was deleted successfully `,
              icon: "mood",
            });
            returnUsers();
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
      toolbar: ref(false),
      idelim: ref(0),
    };
  },
  components: { AddUser },
};
</script>
