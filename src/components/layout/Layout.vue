<template>
  <div class="setting-container">
    <div class="setting-header">
      <h2>設定</h2>
      <button @click="$emit('close')">×</button>
    </div>
    <div class="setting-body">
      <!-- ここに設定コンテンツを記述 -->
      <p>設定項目がここに入ります。</p>

      <div class="setting-section">
        <h3>カスタムエンドポイント</h3>

        <input
          v-model="customEndpoint"
          type="text"
          placeholder="https://example.com/api"
          class="setting-input"
        />

        <button
          class="save-button"
          @click="saveEndpoint"
        >
          保存
        </button>
      </div>

      <div class="setting-section">
        <h3>使用モード</h3>

        <label class="checkbox-label">
          <input
            type="radio"
            value="default"
            v-model="endpointMode"
          />
          既存APIのみ使用
        </label>

        <label class="checkbox-label">
          <input
            type="radio"
            value="custom"
            v-model="endpointMode"
          />
          カスタムエンドポイントのみ使用
        </label>

        <label class="checkbox-label">
          <input
            type="radio"
            value="rotation"
            v-model="endpointMode"
          />
          ローテーションして使用
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

defineEmits(['close'])

const customEndpoint = ref('')
const endpointMode = ref('default')

onMounted(() => {
  const savedEndpoint = localStorage.getItem('custom_endpoint')
  const savedMode = localStorage.getItem('endpoint_mode')

  if (savedEndpoint) {
    customEndpoint.value = savedEndpoint
  }

  if (savedMode) {
    endpointMode.value = savedMode
  }
})

function saveEndpoint() {
  localStorage.setItem(
    'custom_endpoint',
    customEndpoint.value
  )
}

watch(endpointMode, (value) => {
  localStorage.setItem('endpoint_mode', value)
})
</script>

<style scoped>
.setting-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}
.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.setting-section {
  margin-top: 20px;
}
.setting-input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.save-button {
  margin-top: 10px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.checkbox-label {
  display: block;
  margin-top: 10px;
}
</style>
