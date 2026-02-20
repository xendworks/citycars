<template>
    <div class="min-h-screen flex flex-col">
        <main class="flex-grow">
            <div class="bg-blue-900 text-white py-20 relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 bg-repeat"></div>
                <div class="container mx-auto px-4 relative z-10 text-center">
                    <h1 class="text-4xl md:text-5xl font-black mb-6 font-lexend text-amber-400">Areas We Cover</h1>
                    <p class="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        CityCars operates a comprehensive fleet of vehicles covering Gatwick, London, and the
                        surrounding regions. Whether it's an airport transfer, Corporate hire, or a quick ride to the
                        station, we are available 24/7.
                    </p>
                </div>
            </div>

            <div class="container mx-auto px-4 py-16">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    <!-- Area 1: Airports -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                        <div
                            class="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                            <el-icon class="text-3xl">
                                <Location />
                            </el-icon>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4 font-lexend">Major Airports</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Gatwick Airport (North & South)
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Heathrow Airport
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> London City Airport
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Stansted Airport
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Luton Airport
                            </li>
                        </ul>
                    </div>

                    <!-- Area 2: Local Areas -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                        <div
                            class="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                            <el-icon class="text-3xl">
                                <Guide />
                            </el-icon>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4 font-lexend">Local Coverage</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Crawley
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Horley
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Redhill
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Reigate
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> East Grinstead
                            </li>
                        </ul>
                    </div>

                    <!-- Area 3: Central London -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                        <div
                            class="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                            <el-icon class="text-3xl">
                                <OfficeBuilding />
                            </el-icon>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4 font-lexend">London Destinations</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Central London Transit
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Corporate Transfers
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Hotel Transfers
                            </li>
                            <li class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Event Venues
                            </li>
                        </ul>
                    </div>

                </div>

                <div class="mt-16 text-center">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 font-lexend">Don't see your area listed?</h2>
                    <p class="text-gray-600 mb-8 max-w-2xl mx-auto">We cover many more locations across the UK. Use our
                        booking engine to get an instant quote for your specific journey, or contact our 24/7 support
                        team.</p>
                    <div class="flex flex-wrap justify-center gap-4">
                        <NuxtLink to="/"
                            class="bg-amber-400 hover:bg-amber-500 text-gray-900 px-8 py-3 rounded-lg font-bold transition-colors shadow-sm">
                            Get a Quote Now
                        </NuxtLink>
                        <NuxtLink to="/contact-us"
                            class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-bold transition-colors shadow-sm">
                            Contact Us
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Location, Guide, OfficeBuilding } from '@element-plus/icons-vue'

useHead({
    title: 'Areas We Cover | CityCars',
    meta: [
        { name: 'description', content: 'Explore the areas covered by CityCars, including Gatwick Airport, London, and local regions like Crawley and Horley.' }
    ]
})
</script>
