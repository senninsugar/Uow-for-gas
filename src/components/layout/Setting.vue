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

        <div
          v-if="savedEndpoints.length"
          class="saved-endpoints"
        >
          <h4>保存済みURL</h4>

          <div
            v-for="(url, index) in savedEndpoints"
            :key="index"
            class="saved-endpoint-item"
          >
            <span class="saved-endpoint-text">
              {{ url }}
            </span>

            <div class="saved-endpoint-actions">
              <button
                class="use-button"
                @click="useEndpoint(url)"
              >
                使用
              </button>

              <button
                class="delete-button"
                @click="deleteEndpoint(index)"
              >
                削除
              </button>
            </div>
          </div>
        </div>
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
const savedEndpoints = ref([])

onMounted(() => {
  const savedEndpoint = localStorage.getItem('custom_endpoint')
  const savedMode = localStorage.getItem('endpoint_mode')
  const savedList = localStorage.getItem('custom_endpoint_list')

  if (savedEndpoint) {
    customEndpoint.value = savedEndpoint
  }

  if (savedMode) {
    endpointMode.value = savedMode
  }

  if (savedList) {
    savedEndpoints.value = JSON.parse(savedList)
  }
})

function saveEndpoint() {
  if (!customEndpoint.value) {
    return
  }

  localStorage.setItem(
    'custom_endpoint',
    customEndpoint.value
  )

  if (
    !savedEndpoints.value.includes(
      customEndpoint.value
    )
  ) {
    savedEndpoints.value.push(
      customEndpoint.value
    )

    localStorage.setItem(
      'custom_endpoint_list',
      JSON.stringify(savedEndpoints.value)
    )
  }
}

function useEndpoint(url) {
  customEndpoint.value = url

  localStorage.setItem(
    'custom_endpoint',
    url
  )
}

function deleteEndpoint(index) {
  savedEndpoints.value.splice(index, 1)

  localStorage.setItem(
    'custom_endpoint_list',
    JSON.stringify(savedEndpoints.value)
  )

  if (
    customEndpoint.value ===
    savedEndpoints.value[index]
  ) {
    customEndpoint.value = ''
    localStorage.removeItem('custom_endpoint')
  }
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
.saved-endpoints {
  margin-top: 20px;
}
.saved-endpoint-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  padding: 10px;
  margin-top: 10px;

  border: 1px solid #ccc;
  border-radius: 8px;
}
.saved-endpoint-text {
  word-break: break-all;
  flex: 1;
}
.saved-endpoint-actions {
  display: flex;
  gap: 8px;
}
.use-button {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.delete-button {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
