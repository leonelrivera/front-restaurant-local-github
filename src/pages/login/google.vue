<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Login with Google</h1>
        <button class="btn btn-block btn-danger" @click="google">
          Login with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { api } from "boot/axios";
import { useQuasar, SessionStorage } from "quasar";
import { useRouter } from "vue-router";

export default {
  name: "Google",
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const register = ref(false);
    const email = ref(null);
    const username = ref(null);
    const password = ref(null);
    const datos = ref(null);
    return {
      async google() {
        await api
          .get("/users/google", {
            headers: {
              accept: "application/json",
            },
          })
          .then((response) => {
            console.log(response);
            //SessionStorage.set("token", response.data.token);
            //router.push("http://localhost:4000/users/google");
          })
          .catch((error) => {
            console.log(error);
            location.href = "http://localhost:4000/users/google";
          });
      },
    };
  },
};
</script>
