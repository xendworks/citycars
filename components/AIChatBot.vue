<template>
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <!-- Chat Window -->
        <div v-if="isOpen"
            class="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-100 mb-4 overflow-hidden flex flex-col h-[500px] max-h-[80vh] animate-fade-in-up transition-all">
            <!-- Header -->
            <div
                class="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white flex justify-between items-center shadow-md">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">✨</div>
                    <div>
                        <h3 class="font-bold text-sm">City Assistant</h3>
                        <p class="text-xs text-amber-100">Usually responds instantly</p>
                    </div>
                </div>
                <button @click="isOpen = false" class="text-white/80 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Messages -->
            <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                <div class="text-xs text-gray-400 text-center my-2">Today</div>

                <div v-for="(msg, idx) in messages" :key="idx" class="flex flex-col max-w-[85%]"
                    :class="msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'">
                    <div :class="msg.role === 'user' ? 'bg-amber-500 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-white border border-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-sm'"
                        class="p-3 text-sm whitespace-pre-wrap leading-relaxed">
                        {{ msg.content }}
                    </div>
                </div>

                <div v-if="isLoading"
                    class="self-start bg-white border border-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-sm p-4 flex gap-1">
                    <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s">
                    </div>
                    <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s">
                    </div>
                </div>
            </div>

            <!-- Input -->
            <div class="p-3 bg-white border-t border-gray-100">
                <form @submit.prevent="sendMessage" class="flex gap-2">
                    <input v-model="userInput" type="text" placeholder="Need help with a booking?"
                        class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                        :disabled="isLoading" />
                    <button type="submit" :disabled="!userInput.trim() || isLoading"
                        class="w-9 h-9 flex items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0">
                        <svg class="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>

        <!-- Toggle Button -->
        <button @click="isOpen = !isOpen"
            class="w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-4 border-amber-400/30 group">
            <span class="text-2xl group-hover:animate-wiggle">✨</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const isOpen = ref(false);
const userInput = ref('');
const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your City Cars AI concierge. I can answer questions, find your driver, or process a lost-item report. How can I help you today?" }
]);
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    const text = userInput.value.trim();
    userInput.value = '';

    messages.value.push({ role: 'user', content: text });
    scrollToBottom();
    isLoading.value = true;

    try {
        const data: any = await $fetch('/api/ai/chat', {
            method: 'POST',
            body: {
                message: text,
                history: messages.value.slice(0, -1)
            }
        });

        messages.value.push({ role: 'assistant', content: data.reply });
    } catch (error) {
        console.error(error);
        messages.value.push({ role: 'assistant', content: "Sorry, I'm having trouble connecting to the server. Please check your connection." });
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
};
</script>
<style>
@keyframes wiggle {

    0%,
    100% {
        transform: rotate(-3deg);
    }

    50% {
        transform: rotate(3deg);
    }
}

.animate-wiggle {
    animation: wiggle 0.5s ease-in-out infinite;
}
</style>
