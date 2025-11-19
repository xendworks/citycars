<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isVisible" 
      class="rounded-md p-4"
      :class="alertClasses"
    >
      <div class="flex">
        <div class="shrink-0">
          <component :is="iconComponent" class="size-5" :class="iconClasses" aria-hidden="true" />
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium" :class="titleClasses">{{ title }}</h3>
          <div v-if="message" class="mt-2 text-sm" :class="messageClasses">
            <p>{{ message }}</p>
          </div>
          <div v-if="showActions" class="mt-4">
            <div class="-mx-2 -my-1.5 flex">
              <button 
                v-if="actionText"
                type="button" 
                class="rounded-md px-2 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                :class="actionButtonClasses"
                @click="handleAction"
              >
                {{ actionText }}
              </button>
              <button 
                v-if="showDismiss"
                type="button" 
                class="rounded-md px-2 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                :class="[actionButtonClasses, actionText ? 'ml-3' : '']"
                @click="handleDismiss"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
        <div v-if="showClose && !showActions" class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              class="inline-flex rounded-md p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2"
              :class="closeButtonClasses"
              @click="handleDismiss"
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  show?: boolean
  type?: AlertType
  title: string
  message?: string
  actionText?: string
  showDismiss?: boolean
  showClose?: boolean
  autoDismiss?: boolean
  dismissDelay?: number // in milliseconds
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  type: 'success',
  message: '',
  actionText: '',
  showDismiss: false,
  showClose: true,
  autoDismiss: false,
  dismissDelay: 5000
})

const emit = defineEmits<{
  dismiss: []
  action: []
  'update:show': [value: boolean]
}>()

const isVisible = ref(props.show)

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  isVisible.value = newVal
  
  // Auto-dismiss if enabled
  if (newVal && props.autoDismiss) {
    setTimeout(() => {
      handleDismiss()
    }, props.dismissDelay)
  }
})

// Auto-dismiss on mount if enabled
onMounted(() => {
  if (isVisible.value && props.autoDismiss) {
    setTimeout(() => {
      handleDismiss()
    }, props.dismissDelay)
  }
})

const showActions = computed(() => props.actionText || props.showDismiss)

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'info':
      return InformationCircleIcon
    default:
      return CheckCircleIcon
  }
})

const alertClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50'
    case 'error':
      return 'bg-red-50'
    case 'warning':
      return 'bg-yellow-50'
    case 'info':
      return 'bg-blue-50'
    default:
      return 'bg-green-50'
  }
})

const iconClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-400'
    case 'error':
      return 'text-red-400'
    case 'warning':
      return 'text-yellow-400'
    case 'info':
      return 'text-blue-400'
    default:
      return 'text-green-400'
  }
})

const titleClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-800'
    case 'error':
      return 'text-red-800'
    case 'warning':
      return 'text-yellow-800'
    case 'info':
      return 'text-blue-800'
    default:
      return 'text-green-800'
  }
})

const messageClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-700'
    case 'error':
      return 'text-red-700'
    case 'warning':
      return 'text-yellow-700'
    case 'info':
      return 'text-blue-700'
    default:
      return 'text-green-700'
  }
})

const actionButtonClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 text-green-800 hover:bg-green-100 focus-visible:outline-green-600'
    case 'error':
      return 'bg-red-50 text-red-800 hover:bg-red-100 focus-visible:outline-red-600'
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 focus-visible:outline-yellow-600'
    case 'info':
      return 'bg-blue-50 text-blue-800 hover:bg-blue-100 focus-visible:outline-blue-600'
    default:
      return 'bg-green-50 text-green-800 hover:bg-green-100 focus-visible:outline-green-600'
  }
})

const closeButtonClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 text-green-500 hover:bg-green-100 focus-visible:outline-green-600'
    case 'error':
      return 'bg-red-50 text-red-500 hover:bg-red-100 focus-visible:outline-red-600'
    case 'warning':
      return 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus-visible:outline-yellow-600'
    case 'info':
      return 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus-visible:outline-blue-600'
    default:
      return 'bg-green-50 text-green-500 hover:bg-green-100 focus-visible:outline-green-600'
  }
})

const handleDismiss = () => {
  isVisible.value = false
  emit('dismiss')
  emit('update:show', false)
}

const handleAction = () => {
  emit('action')
}
</script>

