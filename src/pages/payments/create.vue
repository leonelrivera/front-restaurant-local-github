<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width: 300px">
      <form @submit.prevent.stop="onSubmit" class="q-gutter-md">
        <!-- @submit.prevent.stop -->
        <q-input
          ref="nameRef"
          filled
          v-model="name"
          label="Name Payment"
          hint="Name  payment"
          lazy-rules
          :rules="nameRules"
        />

        <div>
          <q-btn label="Create" type="submit" color="primary" />
          <router-link to="/payments">
            <q-btn label="Back" color="primary" />
          </router-link>
        </div>
      </form>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const $q = useQuasar();

    const name = ref(null);
    const nameRef = ref(null);

    function addPayments() {
      api
        .post("payments", {
          headers: {
            accept: "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJ1c2VybmFtZV91c2VyIjoiYWRtaW4iLCJwYXNzd29yZF91c2VyIjoiJDJiJDEwJG44UU9uTFIxRmplSWVpUGM2Zm8zanVPZ0xOUEguQVJHQVJKUzVIdFVyWVQzTWxLMmdKeXp5IiwiaWF0IjoxNjQ2MTQ5NTM4LCJleHAiOjE2NDYyMzU5Mzh9.oUHyj_9H-U5fUBxkqKMUkl0UMNxMo-XI4UCwmEVdglA",
          },
          name_payment: name.value,
        })
        .then((response) => {
          //console.log(response);
          console.log("name " + name.value);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return {
      name,
      nameRef,
      nameRules: [(val) => (val && val.length > 0) || "Please type something"],

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
          addPayments();
          router.push("/payments");
        }
      },
    };
  },
};
</script>
