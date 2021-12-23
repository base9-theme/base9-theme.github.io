<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue';
// import Main from './components/Main.vue'
import Main from './components/Main2.vue';
import Base16SchemePicker from './components/Base16SchemePicker.vue';
function tmp(x: any) {console.log(x);}

</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <Main msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <base-16-scheme-picker @update="tmp($event)"/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
