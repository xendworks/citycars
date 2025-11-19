<template>
  <button
    :type="type"
    :class="buttonClasses"
    @click="$emit('click', $event)"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'white',
  size: 'md',
  rounded: true,
  type: 'button',
  disabled: false
});

defineEmits(['click']);

const sizeClasses = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm',
  xl: 'px-5 py-3 text-base'
};

const variantClasses = {
  primary: 'bg-amber-500 text-white shadow-xs hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
  secondary: 'bg-gray-600 text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600',
  danger: 'bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600',
  success: 'bg-green-600 text-white shadow-xs hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600',
  white: 'bg-white text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
};

const buttonClasses = computed(() => {
  return [
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    props.rounded ? 'rounded-full' : 'rounded-lg',
    sizeClasses[props.size],
    variantClasses[props.variant]
  ].join(' ');
});
</script>

