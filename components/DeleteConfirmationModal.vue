<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog class="relative z-50" @close="close">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/50"></div>
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10 dark:bg-red-500/10">
                  <ExclamationTriangleIcon class="size-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" class="text-base font-semibold text-gray-900 dark:text-white">{{ title }}
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button type="button"
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto dark:bg-red-500 dark:shadow-none dark:hover:bg-red-400 disabled:opacity-50"
                  @click="confirm" :disabled="loading">
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <span v-if="!loading">{{ confirmText }}</span>
                  <span v-if="loading" class="ml-1">Deleting...</span>
                </button>
                <button type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs border border-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-white/10 dark:text-white dark:shadow-none dark:border-white/5 dark:hover:bg-white/20 disabled:opacity-50"
                  @click="close" :disabled="loading">Cancel</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'Confirm Deletion'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed? This action cannot be undone.'
  },
  confirmText: {
    type: String,
    default: 'Delete'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  if (!props.loading) emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
}
</script>
