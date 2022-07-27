<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> App Restaurant </q-toolbar-title>
        <!--   <div class="q-pa-md q-gutter-sm">
        </div> -->
        <div>
          <!-- Quasar v{{ $q.version }} -->
          <q-btn round color="negative" icon="logout" @click="logout()" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-item-label header> Acceso a funciones </q-item-label>

          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="~assets/resto.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ data.namelastname_user }}</div>
          <div>{{ data.username_user }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "src/components/barraLateral/EssentialLink.vue";

const linksList = [
  {
    title: "Productos",
    caption: "Lista Productos",
    icon: "restaurant",
    link: "#/productos",
  },
  {
    title: "Usuarios",
    caption: "Lista Usuarios",
    icon: "people_alt",
    link: "#/users",
  },
  {
    title: "Medios de pagos",
    caption: "Lista medios de pagos",
    icon: "payment",
    link: "#/payments",
  },
  {
    title: "Ordenes",
    caption: "Generar Ordenes",
    icon: "shopping_cart",
    link: "#/orders",
  },
  {
    title: "Admin Ordenes",
    caption: "Administracion de ordenes",
    icon: "shopping_cart",
    link: "#/orderStates",
  },
];

import { defineComponent, ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar, SessionStorage } from "quasar";
import { useRouter } from "vue-router";
// import { route } from "quasar/wrappers";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const token = SessionStorage.getItem("jwt");
    const data = ref([]);
    function getUsers() {
      api
        .get("users/list", {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          //data.value = response.data;
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].state_user == 1) {
              data.value = response.data.data[i];

              console.log("data value " + JSON.stringify(data.value));
            }
          }
          /* console.log("datos " + JSON.stringify(response.data.data));
          data.value = response.data.payload.dataUser;
          console.log(
            "datos " + JSON.stringify(response.data.payload.dataUser)
          );
          return JSON.stringify(response.data.data); */
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: ` Mensaje ${error}`,
            icon: "report_problem",
          });
          router.push("/login");
        });
    }

    onMounted(() => {
      getUsers();
    });

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      data,
      logout() {
        console.log("logout");
        api
          .post("users/logout", {
            headers: {
              accept: "application/json",
              //Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Has salido correctamente de la sesion`,
              icon: "report_problem",
            });
            return router.push({ name: "login" });
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
    };
  },
});
</script>
