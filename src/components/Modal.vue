<template>
  <p>
    <button @click="showModal">
      Show modal
    </button>
  </p>
  <!-- If the option changed modal component the name
  <MyModal>
  -->
  <Modal
    v-model="isShow"
    :close="closeModal"
  >
    <div class="modal">
      <p>
        Hello
      </p>
      <button @click="closeModal">
        close
      </button>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'

const isShow = ref(false)

function showModal () {
  isShow.value = true
}

function closeModal () {
  isShow.value = false
}
</script>

<style scoped lang="scss">
.modal {
  width: 300px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
}
</style>
