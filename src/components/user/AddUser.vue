<template>
  <div class="full-width row wrap justify-center items-start content-start">
    <div class="column q-pa-lg">
      <q-card square class="shadow-24" style="width: 300px; height: 100%">
        <q-card-section class="bg-deep-purple-7">
          <h4 class="text-h5 text-white q-my-md">Registro Nuevo Usuario</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="q-px-sm q-pt-xl q-pb-lg">
            <q-input
              square
              clearable
              v-model="email_user"
              type="email"
              label="Email"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <q-input
              square
              clearable
              v-model="username_user"
              type="username"
              label="Username"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              square
              clearable
              v-model="namelastname_user"
              type="namelastname"
              label="namelastname"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              square
              clearable
              v-model="phone_user"
              type="phone"
              label="phone"
            >
              <template v-slot:prepend>
                <q-icon name="phone_android" />
              </template>
            </q-input>

            <q-input
              square
              clearable
              v-model="address_user"
              type="address"
              label="address"
            >
              <template v-slot:prepend>
                <q-icon name="home" />
              </template>
            </q-input>

            <q-input
              square
              clearable
              v-model="password_user"
              type="password"
              label="Password"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
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
  name: "AddUser",
  setup() {
    const $q = useQuasar();

    const username_user = ref(null);
    const namelastname_user = ref(null);
    const email_user = ref(null);
    const phone_user = ref(null);
    const address_user = ref(null);
    const password_user = ref(null);
    // const state_user = ref(null);
    // const active_user = ref(null);
    // const id_role = ref(null);
    const datos = ref(null);

    return {
      async addUser() {
        const useNew = {
          username: username_user.value,
          namelastname: namelastname_user.value,
          email: email_user.value,
          phone: phone_user.value,
          address: address_user.value,
          password: password_user.value,
          //perfil: "admin",
        };
        console.log(`usuario ${JSON.stringify(useNew)}`);
        await api
          .post("users/register", useNew, {
            headers: {
              accept: "application/json",
            },
          })
          .then((response) => {
            console.log("datos " + JSON.stringify(response.data));

            $q.notify({
              color: "positive",
              position: "bottom",
              message: `Se creo el usuario ${username_user.value}`,
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
        console.log(datos);
      },
      datos,
      username_user,
      namelastname_user,
      email_user,
      phone_user,
      address_user,
      password_user,
      //state_user,
    };
  },

  /*  methods: {
    subscribe() {
      this.registe = !this.registe;
    },
  }, */
});
</script>
