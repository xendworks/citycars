<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog class="relative z-50" @close="handleClose">
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
            <DialogPanel :class="panelClasses">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
                <div class="sm:flex sm:items-start w-full">
                  <div class="mt-3 text-left sm:mt-0 w-full">
                    <DialogTitle v-if="title" as="h3"
                      class="text-base font-semibold text-gray-900 dark:text-white mb-2">
                      {{ title }}
                    </DialogTitle>
                    <slot name="header" />

                    <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 modal-body">
                      <slot />
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="$slots.footer"
                class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700/25 gap-3 border-t border-gray-100 dark:border-gray-700">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

interface Props {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg'
});

const emit = defineEmits(['update:modelValue', 'close']);

const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  full: 'sm:max-w-full sm:mx-4'
};

const panelClasses = computed(() => {
  return [
    'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
    'sm:my-8 sm:w-full dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10',
    sizeClasses[props.size]
  ].join(' ');
});
</script>

<style scoped>
.modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
