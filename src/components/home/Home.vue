<template>
  <div class="home-content">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    logout() {
      window.sessionStorage.clear('vue_shop_token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
