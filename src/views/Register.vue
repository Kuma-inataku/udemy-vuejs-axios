<template>
  <div>
    <h3>登録</h3>
    <label for="email">Email：</label>
    <input
      type="email"
      id="email"
      v-model="email"
    >
    <br><br>
    <label for="password">パスワード：</label>
    <input
      id="password"
      type="password"
      v-model="password">
    <br><br>
    <button
      @click="register"
    >送信
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    register() {
      this.$store.dispatch('register', {
        email: this.email,
        password: this.password,
      });
      this.email="";
      this.password="";
    },
  }
}
</script>
