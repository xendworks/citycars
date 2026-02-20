<template>
    <div :class="[
        'flex flex-col items-center justify-center transition-all duration-300',
        fullScreen ? 'fixed inset-0 min-h-screen bg-white z-[100]' : 'py-12 w-full'
    ]">
        <div class="flex flex-col items-center">
            <!-- Animated Spinner -->
            <div :class="[
                'border-[3px] border-slate-100 border-t-amber-500 rounded-full animate-spin',
                size === 'lg' ? 'w-12 h-12 border-[3px]' : 'w-8 h-8 border-[2px]'
            ]"></div>

            <!-- Branding -->
            <p :class="[
                'font-bold font-sora tracking-tight text-slate-900',
                size === 'lg' ? 'mt-8 text-xl' : 'mt-4 text-sm'
            ]">
                CITY<span class="text-amber-500">CARS</span>
            </p>

            <!-- Status Message -->
            <p :class="[
                'text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse',
                size === 'lg' ? 'mt-2 text-[10px]' : 'mt-1 text-[8px]'
            ]">
                {{ text }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    text?: string;
    size?: 'sm' | 'lg';
    fullScreen?: boolean;
}

withDefaults(defineProps<Props>(), {
    text: 'Synchronizing...',
    size: 'lg',
    fullScreen: false
});
</script>
