<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with gradient background -->
    <div class="bg-gray-900 text-white py-8 px-6 shadow-lg">
      <div class="container mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 class="text-xl text-white font-bold mb-2">{{ userProfile?.displayName || 'User' }}</h1>
          <p class="text-amber-50">{{ userProfile?.phoneNumber || 'No phone' }} • {{ userProfile?.email }}</p>
        </div>
        <button v-if="activeTab === 'details' && !isEditing" @click="startEditing"
          class="px-6 py-2.5 border-2 border-white text-white rounded-lg hover:bg-white hover:text-amber-600 transition-colors font-semibold uppercase">
          Edit Profile
        </button>
        <button v-else-if="activeTab === 'details' && isEditing" @click="cancelEditing"
          class="px-6 py-2.5 border-2 border-white text-white rounded-lg hover:bg-white hover:text-amber-600 transition-colors font-semibold uppercase">
          Cancel
        </button>
        <button v-else @click="handleLogout"
          class="px-6 py-2.5 border-2 border-white text-white rounded-lg hover:bg-red-600 hover:border-red-600 transition-colors font-semibold uppercase">
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-fluid mx-auto max-w-7xl py-8 px-6">
      <!-- Delete Success Alert -->
      <div v-if="showDeleteSuccessAlert" class="mb-6">
        <AlertBar :show="showDeleteSuccessAlert" type="success" title="Account Deleted Successfully"
          message="Your account and all associated data have been permanently deleted. You will be redirected to the home page shortly."
          actionText="Go to Home" showDismiss :autoDismiss="false" @action="handleAlertAction"
          @dismiss="showDeleteSuccessAlert = false" @update:show="showDeleteSuccessAlert = $event" />
      </div>

      <!-- Global Success Message -->
      <div v-if="successMessage"
        class="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-md flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <span class="font-medium">{{ successMessage }}</span>
        </div>
        <button @click="successMessage = ''" class="text-green-700 hover:text-green-900">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <div
            class="bg-white rounded-lg shadow-md overflow-x-auto lg:overflow-hidden flex lg:flex-col snap-x scrollbar-hide border border-gray-100 lg:border-none">

            <button @click="activeTab = 'bookings'" :class="[
              'flex-1 lg:w-full min-w-max flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-6 py-4 text-center lg:text-left transition-colors snap-center',
              activeTab === 'bookings'
                ? 'bg-amber-50 lg:bg-orange-50 lg:border-l-4 lg:border-b-0 border-b-[3px] border-amber-500'
                : 'hover:bg-gray-50 text-gray-600'
            ]">
              <div
                class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span class="font-semibold" :class="activeTab === 'bookings' ? 'text-gray-900' : ''">My Bookings</span>
            </button>

            <button @click="activeTab = 'details'" :class="[
              'flex-1 lg:w-full min-w-max flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-6 py-4 text-center lg:text-left transition-colors snap-center',
              activeTab === 'details'
                ? 'bg-amber-50 lg:bg-orange-50 lg:border-l-4 lg:border-b-0 border-b-[3px] border-amber-500'
                : 'hover:bg-gray-50 text-gray-600'
            ]">
              <div
                class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="font-semibold" :class="activeTab === 'details' ? 'text-gray-900' : ''">Account Details</span>
            </button>

            <button @click="activeTab = 'addresses'" :class="[
              'flex-1 lg:w-full min-w-max flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-6 py-4 text-center lg:text-left transition-colors snap-center',
              activeTab === 'addresses'
                ? 'bg-amber-50 lg:bg-orange-50 lg:border-l-4 lg:border-b-0 border-b-[3px] border-amber-500'
                : 'hover:bg-gray-50 text-gray-600'
            ]">
              <div
                class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="font-semibold" :class="activeTab === 'addresses' ? 'text-gray-900' : ''">Saved
                Addresses</span>
            </button>

            <button @click="activeTab = 'wallet'" :class="[
              'flex-1 lg:w-full min-w-max flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-6 py-4 text-center lg:text-left transition-colors snap-center',
              activeTab === 'wallet'
                ? 'bg-amber-50 lg:bg-orange-50 lg:border-l-4 lg:border-b-0 border-b-[3px] border-amber-500'
                : 'hover:bg-gray-50 text-gray-600'
            ]">
              <div
                class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span class="font-semibold" :class="activeTab === 'wallet' ? 'text-gray-900' : ''">Wallet</span>
            </button>

            <button @click="activeTab = 'settings'" :class="[
              'flex-1 lg:w-full min-w-max flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-6 py-4 text-center lg:text-left transition-colors snap-center',
              activeTab === 'settings'
                ? 'bg-amber-50 lg:bg-orange-50 lg:border-l-4 lg:border-b-0 border-b-[3px] border-amber-500'
                : 'hover:bg-gray-50 text-gray-600'
            ]">
              <div
                class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="font-semibold" :class="activeTab === 'settings' ? 'text-gray-900' : ''">Settings</span>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1">
          <!-- My Bookings Tab -->
          <div v-if="activeTab === 'bookings'" class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

            <!-- Loading State -->
            <AdminLoader v-if="loadingBookings" size="lg" text="Loading your bookings..." />

            <template v-else>
              <!-- Segmented Control for Booking Tabs -->
              <div class="mb-6 overflow-x-auto pb-1">
                <span class="isolate inline-flex rounded-md shadow-sm dark:shadow-none">
                  <button type="button" @click="activeBookingTab = 'upcoming'" :class="[
                    'relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 transition-colors',
                    activeBookingTab === 'upcoming'
                      ? 'bg-amber-50 text-amber-700 ring-amber-500 z-10 hover:bg-amber-100'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  ]">Upcoming</button>
                  <button type="button" @click="activeBookingTab = 'in-progress'" :class="[
                    'relative -ml-px inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 transition-colors',
                    activeBookingTab === 'in-progress'
                      ? 'bg-amber-50 text-amber-700 ring-amber-500 z-10 hover:bg-amber-100'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  ]">In Progress</button>
                  <button type="button" @click="activeBookingTab = 'completed'" :class="[
                    'relative -ml-px inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 transition-colors',
                    activeBookingTab === 'completed'
                      ? 'bg-amber-50 text-amber-700 ring-amber-500 z-10 hover:bg-amber-100'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  ]">Completed</button>
                  <button type="button" @click="activeBookingTab = 'cancelled'" :class="[
                    'relative -ml-px inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 transition-colors',
                    activeBookingTab === 'cancelled'
                      ? 'bg-amber-50 text-amber-700 ring-amber-500 z-10 hover:bg-amber-100'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  ]">Cancelled</button>
                </span>
              </div>

              <!-- No Bookings -->
              <div v-if="filteredBookings.length === 0" class="text-center py-16">
                <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">No {{ activeBookingTab }} bookings</h3>
                <p class="mt-2 text-sm text-gray-500">Start booking your rides to see them here.</p>
                <div class="mt-6" v-if="activeBookingTab === 'upcoming'">
                  <NuxtLink to="/"
                    class="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors">
                    Book a Ride Now
                  </NuxtLink>
                </div>
              </div>

              <!-- Bookings List -->
              <div v-else class="space-y-4">
                <div v-for="booking in filteredBookings" :key="booking.id"
                  class="bg-white rounded-xl border border-gray-200 shadow-sm hover:border-amber-200 hover:shadow-md transition-all p-5 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 group">

                  <!-- Status & Dates (Left) -->
                  <div
                    class="w-full lg:w-40 shrink-0 flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-start border-b lg:border-none border-gray-100 pb-4 lg:pb-0">
                    <div class="flex flex-col items-start gap-1">
                      <span
                        class="inline-flex items-center px-3 py-1 lg:px-2 lg:py-0.5 rounded-full lg:rounded text-[11px] lg:text-[10px] font-black tracking-widest uppercase"
                        :class="{
                          'bg-amber-100 text-amber-700': booking.status === 'pending',
                          'bg-green-100 text-green-700': booking.status === 'confirmed',
                          'bg-blue-100 text-blue-700': booking.status === 'in-progress',
                          'bg-gray-200 text-gray-600': booking.status === 'completed',
                          'bg-red-100 text-red-700': booking.status === 'cancelled'
                        }">
                        {{ booking.status?.toUpperCase() || 'PENDING' }}
                      </span>
                      <div class="font-mono font-bold text-gray-900 text-[14px] lg:text-[13px] tracking-widest mt-1">{{
                        booking.bookingReference }}</div>
                      <div
                        class="text-[10px] text-gray-400 hidden lg:block uppercase tracking-widest font-semibold mt-0.5">
                        Booked {{ formatDate(booking.createdAt) }}</div>
                    </div>

                    <div class="lg:hidden text-right">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Fare</p>
                      <p class="text-xl font-black text-amber-500 leading-none">£{{ booking.totalFare?.toFixed(2) ||
                        '0.00' }}</p>
                    </div>
                  </div>

                  <!-- Route Details (Middle) -->
                  <div class="flex-1 flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-center relative">

                    <!-- Pickup -->
                    <div class="flex-1 relative pl-6 lg:pl-0">
                      <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200 lg:hidden"></div>
                      <div class="relative lg:static">
                        <div
                          class="absolute -left-6 top-1 w-3 h-3 bg-white border-[3px] border-blue-500 rounded-full shadow-sm lg:hidden mt-0.5">
                        </div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-1 lg:mt-0">Pick
                          up <span class="text-blue-600 ml-1 truncate">{{ formatDateTime(booking.pickupDateTime)
                            }}</span></p>
                        <p class="text-sm font-semibold text-gray-900 leading-snug line-clamp-2"
                          :title="booking.pickupAddress">{{ booking.pickupAddress }}</p>
                      </div>
                    </div>

                    <!-- Arrow (Desktop) -->
                    <div
                      class="hidden lg:flex w-8 h-8 rounded-full bg-slate-50 items-center justify-center shrink-0 border border-gray-100 text-gray-400 shadow-sm">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>

                    <!-- Dropoff -->
                    <div class="flex-1 relative pl-6 lg:pl-0">
                      <div class="relative lg:static">
                        <div
                          class="absolute -left-6 top-1 w-3 h-3 bg-white border-[3px] border-amber-500 rounded-full shadow-sm lg:hidden mt-0.5">
                        </div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-1 lg:mt-0">Drop
                          off</p>
                        <p class="text-[13px] text-gray-600 leading-snug line-clamp-2 font-medium"
                          :title="booking.dropoffAddress">{{ booking.dropoffAddress }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Fare & Actions (Right) -->
                  <div
                    class="w-full lg:w-32 flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-none border-gray-100 pt-4 lg:pt-0 shrink-0 gap-3">
                    <div class="hidden lg:block text-right mb-2">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Fare</p>
                      <p class="text-2xl font-black text-amber-500 leading-none">£{{ booking.totalFare?.toFixed(2) ||
                        '0.00' }}</p>
                    </div>

                    <div class="lg:hidden text-[10px] uppercase font-semibold tracking-widest text-gray-400">Booked {{
                      formatDate(booking.createdAt) }}</div>

                    <button v-if="['pending', 'confirmed'].includes(booking.status?.toLowerCase())"
                      @click="promptCancelBooking(booking.id)" :disabled="isCancellingBooking === booking.id"
                      class="px-5 py-2.5 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 disabled:opacity-50 text-[11px] font-bold rounded-lg transition-all border border-slate-200 hover:border-red-200 uppercase tracking-widest whitespace-nowrap shadow-sm group-hover:scale-105 group-hover:shadow-md flex items-center justify-center w-full lg:w-auto">
                      {{ isCancellingBooking === booking.id ? 'Cancelling...' : 'Cancel Booking' }}
                    </button>

                    <button v-if="booking.status?.toLowerCase() === 'completed'" @click="handleLeaveReview(booking.id)"
                      class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition-all border border-amber-600 uppercase tracking-widest whitespace-nowrap shadow-sm group-hover:scale-105 flex items-center justify-center w-full lg:w-auto">
                      Leave Review
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Cancel Booking Confirmation Modal -->
          <DeleteConfirmationModal v-model="showCancelModal" title="Cancel Booking"
            message="Are you sure you want to cancel this booking?" confirmText="Cancel Booking"
            :loading="isCancellingBooking !== null" @confirm="executeCancelBooking" />

          <!-- Account Details Tab -->
          <div v-if="activeTab === 'details'" class="bg-white rounded-lg shadow-md p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Account Information</h2>
              <button v-if="!isEditing" @click="startEditing"
                class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors">
                Edit Profile
              </button>
            </div>

            <form @submit.prevent="saveProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div>
                  <label for="displayName" class="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input id="displayName" v-model="editForm.displayName" type="text" :disabled="!isEditing" :class="[
                    'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                    isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  ]" />
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input id="email" v-model="editForm.email" type="email" disabled
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" />
                  <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input id="phone" v-model="editForm.phoneNumber" type="tel" :disabled="!isEditing" :class="[
                    'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                    isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  ]" placeholder="+44 1234 567890" />
                  <p v-if="isEditing" class="mt-1 text-xs text-amber-600">✓ You can change your phone number</p>
                </div>

                <!-- Company Name -->
                <div>
                  <label for="companyName" class="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name <span class="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input id="companyName" v-model="editForm.companyName" type="text" :disabled="!isEditing" :class="[
                    'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                    isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  ]" placeholder="Corporate Account Name" />
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Emergency Contact</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Emergency Contact Name -->
                  <div>
                    <label for="emergencyName" class="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Name
                    </label>
                    <input id="emergencyName" v-model="editForm.emergencyContactName" type="text" :disabled="!isEditing"
                      :class="[
                        'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                        isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      ]" placeholder="Next of kin" />
                  </div>

                  <!-- Emergency Contact Phone -->
                  <div>
                    <label for="emergencyPhone" class="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input id="emergencyPhone" v-model="editForm.emergencyContactPhone" type="tel"
                      :disabled="!isEditing" :class="[
                        'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                        isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      ]" placeholder="Emergency phone" />
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
                <!-- Special Requirements -->
                <div>
                  <label for="specialReq" class="block text-sm font-semibold text-gray-700 mb-2">
                    Special Travel Requirements <span class="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea id="specialReq" v-model="editForm.specialRequirements" :disabled="!isEditing" rows="3"
                    :class="[
                      'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                      isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    ]" placeholder="Wheelchair access, child seat required, etc."></textarea>
                  <p class="mt-1 text-xs text-gray-500">This information will be provided to your drivers.</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="isEditing" class="flex space-x-4 pt-4 border-t">
                <button type="submit" :disabled="isSaving"
                  class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 text-lg">
                  {{ isSaving ? 'Saving...' : '✓ Save Changes' }}
                </button>
                <button type="button" @click="cancelEditing"
                  class="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors text-lg">
                  ✕ Cancel
                </button>
              </div>
            </form>

            <!-- Error Message -->
            <div v-if="error"
              class="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md">
              {{ error }}
            </div>
          </div>

          <!-- Saved Addresses Tab -->
          <div v-if="activeTab === 'addresses'"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                <p class="text-gray-500 text-sm mt-1">Manage your frequently used pickup and dropoff locations</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <!-- Pickup Locations -->
              <div>
                <div class="flex items-center justify-between mb-5">
                  <h3 class="text-lg font-bold text-gray-900 flex items-center">
                    <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                          d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    Pickups <span
                      class="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{{
                        pickupLocations.length }}/3</span>
                  </h3>

                  <button v-if="pickupLocations.length < 3"
                    @click="showAddressModal = true; addressType = 'pickup'; newAddress = ''"
                    class="text-sm font-bold tracking-widest uppercase text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1 group">
                    <span class="text-xl leading-none group-hover:scale-110 transition-transform">+</span> Add
                  </button>
                </div>

                <div v-if="pickupLocations.length === 0"
                  class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center min-h-[200px]">
                  <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 class="text-gray-900 font-bold text-sm mb-1">No pickups saved</h4>
                  <p class="text-xs text-gray-500 max-w-[200px]">Save your home or office for quicker booking.</p>
                  <button @click="showAddressModal = true; addressType = 'pickup'; newAddress = ''"
                    class="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-amber-200 hover:text-amber-600 hover:bg-amber-50 transition-all bg-white shadow-sm">
                    Add First Location
                  </button>
                </div>

                <div v-else class="space-y-3">
                  <div v-for="(location, idx) in pickupLocations" :key="`pickup-${idx}`"
                    class="group relative flex items-center p-4 pr-12 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all">
                    <div
                      class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 mr-4 group-hover:bg-green-100 transition-colors">
                      <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1 truncate">
                      <p class="text-sm font-semibold text-gray-900 truncate" :title="location">{{ location }}</p>
                    </div>
                    <button @click="removeAddress('pickup', idx)"
                      class="absolute right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove address">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Dropoff Locations -->
              <div>
                <div class="flex items-center justify-between mb-5">
                  <h3 class="text-lg font-bold text-gray-900 flex items-center">
                    <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    Dropoffs <span
                      class="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{{
                        dropoffLocations.length }}/3</span>
                  </h3>

                  <button v-if="dropoffLocations.length < 3"
                    @click="showAddressModal = true; addressType = 'dropoff'; newAddress = ''"
                    class="text-sm font-bold tracking-widest uppercase text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1 group">
                    <span class="text-xl leading-none group-hover:scale-110 transition-transform">+</span> Add
                  </button>
                </div>

                <div v-if="dropoffLocations.length === 0"
                  class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center min-h-[200px]">
                  <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 class="text-gray-900 font-bold text-sm mb-1">No dropoffs saved</h4>
                  <p class="text-xs text-gray-500 max-w-[200px]">Save your favorite destinations like airports or
                    stations.</p>
                  <button @click="showAddressModal = true; addressType = 'dropoff'; newAddress = ''"
                    class="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-amber-200 hover:text-amber-600 hover:bg-amber-50 transition-all bg-white shadow-sm">
                    Add First Location
                  </button>
                </div>

                <div v-else class="space-y-3">
                  <div v-for="(location, idx) in dropoffLocations" :key="`dropoff-${idx}`"
                    class="group relative flex items-center p-4 pr-12 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all">
                    <div
                      class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 mr-4 group-hover:bg-red-100 transition-colors">
                      <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1 truncate">
                      <p class="text-sm font-semibold text-gray-900 truncate" :title="location">{{ location }}</p>
                    </div>
                    <button @click="removeAddress('dropoff', idx)"
                      class="absolute right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove address">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Wallet Tab -->
          <div v-if="activeTab === 'wallet'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">City Cars Wallet</h2>
                <p class="text-gray-500 text-sm mt-1">Manage your balance and view past transactions</p>
              </div>
              <button
                class="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
                </svg>
                Top Up Balance
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Wallet Balance Card -->
              <div
                class="col-span-1 border border-gray-100 rounded-2xl p-1 bg-gray-50/50 shadow-sm relative overflow-hidden group">
                <div
                  class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-7 text-white shadow-lg overflow-hidden aspect-[1.58/1] flex flex-col justify-between">
                  <!-- Abstract Background Shapes & Glows -->
                  <div
                    class="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl transition-all duration-700 group-hover:bg-amber-500/20">
                  </div>
                  <div
                    class="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-700 group-hover:bg-blue-500/20">
                  </div>

                  <!-- Card Header -->
                  <div class="relative flex justify-between items-start z-10">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z">
                          </path>
                        </svg>
                      </div>
                      <span class="font-bold text-white/90 tracking-widest text-[11px] uppercase">CityPay</span>
                    </div>
                    <svg class="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0">
                      </path>
                    </svg>
                  </div>

                  <!-- Balance -->
                  <div class="relative z-10 mt-auto">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 opacity-80">Available
                      Balance</p>
                    <div class="flex items-baseline gap-1">
                      <span class="text-3xl text-amber-500/90 font-medium">£</span>
                      <h3 class="text-[2.75rem] leading-none text-white tracking-tight">0.00</h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transaction History -->
              <div class="col-span-1 lg:col-span-2 flex flex-col">
                <div class="flex items-center justify-between mb-4 mt-2 lg:mt-0">
                  <h3 class="text-lg font-bold text-gray-900">Recent Transactions</h3>
                  <button
                    class="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors">View
                    All</button>
                </div>

                <div
                  class="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center min-h-[250px] shadow-sm">
                  <div
                    class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-5 relative group cursor-default">
                    <div
                      class="absolute inset-0 bg-amber-500/5 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300">
                    </div>
                    <svg class="w-8 h-8 text-gray-300 relative z-10" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                      </path>
                    </svg>
                  </div>
                  <h4 class="text-gray-900 font-bold mb-2">No transactions yet</h4>
                  <p class="text-sm text-gray-500 max-w-sm leading-relaxed">When you add money to your wallet or pay for
                    rides using CityPay, your transactions will magically appear here.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

            <div class="space-y-6">
              <!-- Email Notifications -->
              <div class="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">Email Notifications</h3>
                  <p class="text-sm text-gray-500">Receive booking confirmations and updates</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500">
                  </div>
                </label>
              </div>

              <!-- SMS Notifications -->
              <div class="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">SMS Notifications</h3>
                  <p class="text-sm text-gray-500">Get SMS alerts for your bookings</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500">
                  </div>
                </label>
              </div>

              <!-- Logout -->
              <div class="pt-6 pb-6 border-b">
                <h3 class="text-sm font-semibold text-gray-900 mb-2">Session</h3>
                <p class="text-sm text-gray-500 mb-4">Sign out of your account on this device</p>
                <button @click="handleLogout"
                  class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>

              <!-- Delete Account -->
              <div class="pt-6">
                <h3 class="text-sm font-semibold text-red-900 mb-2">Danger Zone</h3>
                <button @click="confirmDelete"
                  class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                  Delete Account
                </button>
                <p class="mt-2 text-xs text-gray-500">Once you delete your account, there is no going back.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Address Modal -->
    <div v-if="showAddressModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      @click.self="showAddressModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">
            Add {{ addressType === 'pickup' ? 'Pickup' : 'Dropoff' }} Location
          </h3>
          <button @click="showAddressModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="addAddress">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <input ref="addressInput" v-model="newAddress" type="text" required
              placeholder="e.g., Horley, Gatwick RH6 0NP"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
          </div>

          <div class="flex space-x-3">
            <button type="submit" :disabled="isAddingAddress"
              class="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isAddingAddress ? 'Adding...' : 'Add' }}
            </button>
            <button type="button" @click="showAddressModal = false"
              class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <DeleteConfirmationModal :isOpen="showDeleteModal" title="Delete Account"
      message="Are you sure you want to delete your account? All of your data, including bookings, saved addresses, and wallet information will be permanently removed from our servers forever. This action cannot be undone."
      confirmText="Delete Account" cancelText="Cancel" loadingText="Deleting..." :isLoading="isDeletingAccount"
      @confirm="handleDeleteAccount" @cancel="handleCancelDelete" @update:isOpen="showDeleteModal = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth',
  title: 'Profile - City Cars'
});

const router = useRouter();
const { user, userProfile, logout, updateUserPhone, error } = useAuth();

const activeTab = ref('bookings');
const activeBookingTab = ref('upcoming');
const isEditing = ref(false);
const isSaving = ref(false);
const successMessage = ref('');
const showDeleteModal = ref(false);
const isDeletingAccount = ref(false);
const showDeleteSuccessAlert = ref(false);

const editForm = reactive({
  displayName: '',
  email: '',
  phoneNumber: '',
  companyName: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  specialRequirements: ''
});

// Address management
const showAddressModal = ref(false);
const addressType = ref<'pickup' | 'dropoff'>('pickup');
const newAddress = ref('');
const pickupLocations = ref<string[]>([]);
const dropoffLocations = ref<string[]>([]);
const addressInput = ref<HTMLInputElement | null>(null);
const addressAutocomplete = ref<any>(null);
const userBookings = ref<any[]>([]);
const loadingBookings = ref(true);
const isCancellingBooking = ref<string | null>(null); // Keep this for loading state of specific booking cancellation

// Specific Modal Actions
const showCancelModal = ref(false);
const bookingToCancel = ref<string | null>(null);
const isAddingAddress = ref(false);

const filteredBookings = computed(() => {
  if (!userBookings.value) return [];

  let filtered = userBookings.value.filter(b => {
    const status = (b.status || 'pending').toLowerCase();
    if (activeBookingTab.value === 'upcoming') {
      return ['pending', 'confirmed'].includes(status);
    } else if (activeBookingTab.value === 'in-progress') {
      return status === 'in-progress';
    } else if (activeBookingTab.value === 'completed') {
      return status === 'completed';
    } else if (activeBookingTab.value === 'cancelled') {
      return status === 'cancelled';
    }
    return true;
  });

  return filtered.sort((a, b) => {
    const parseDate = (d: any) => {
      if (!d) return 0;
      if (d.toDate) return d.toDate().getTime();
      return new Date(d).getTime();
    };

    const timeA = parseDate(a.pickupDateTime || a.createdAt);
    const timeB = parseDate(b.pickupDateTime || b.createdAt);
    return timeB - timeA;
  });
});

// Initialize form with user data
onMounted(async () => {
  if (!user.value) {
    router.push('/login');
    return;
  }

  editForm.displayName = userProfile.value?.displayName || '';
  editForm.email = userProfile.value?.email || '';
  editForm.phoneNumber = userProfile.value?.phoneNumber || '';
  editForm.companyName = userProfile.value?.companyName || '';
  editForm.emergencyContactName = userProfile.value?.emergencyContactName || '';
  editForm.emergencyContactPhone = userProfile.value?.emergencyContactPhone || '';
  editForm.specialRequirements = userProfile.value?.specialRequirements || '';

  // Load addresses and bookings from Firestore (client-side only)
  if (process.client) {
    loadingBookings.value = true;
    try {
      const { getUserProfile, getUserBookings, updateBookingStatus } = useFirestore();

      // Load both profile and bookings concurrently to speed up the process
      const [profile, bookings] = await Promise.all([
        getUserProfile(user.value.uid).catch(err => {
          console.error('[PROFILE] Failed to load profile:', err);
          return null;
        }),
        getUserBookings(user.value.uid).catch(err => {
          console.error('[PROFILE] Failed to load bookings:', err);
          return [];
        })
      ]);

      if (profile) {
        pickupLocations.value = profile.preferredPickupLocations || [];
        dropoffLocations.value = profile.preferredDropoffLocations || [];
      }

      userBookings.value = bookings || [];
      loadingBookings.value = false;


    } catch (err) {
      console.error('[PROFILE] ❌ Failed to load data:', err);
      loadingBookings.value = false;
    }
  }
});
const promptCancelBooking = (bookingId: string) => {
  bookingToCancel.value = bookingId;
  showCancelModal.value = true;
};

const executeCancelBooking = async () => {
  if (!bookingToCancel.value) return;
  const bookingId = bookingToCancel.value;

  isCancellingBooking.value = bookingId;
  try {
    const { updateBookingStatus } = useFirestore();
    await updateBookingStatus(bookingId, 'cancelled');

    // Update local state
    const booking = userBookings.value.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
    }

    // Hide modal and show success logic natively 
    showCancelModal.value = false;
    successMessage.value = 'Booking has been cancelled successfully.';

  } catch (error) {
    console.error('[PROFILE] Failed to cancel booking:', error);
    alert('Failed to cancel booking. Please try again or contact support.');
  } finally {
    isCancellingBooking.value = null;
    bookingToCancel.value = null;
  }
};

// Watch userProfile for changes (it loads asynchronously from Firestore)
watch(userProfile, (newProfile) => {
  if (newProfile && !isEditing.value) {
    editForm.displayName = newProfile.displayName || '';
    editForm.email = newProfile.email || '';
    editForm.phoneNumber = newProfile.phoneNumber || '';
    editForm.companyName = newProfile.companyName || '';
    editForm.emergencyContactName = newProfile.emergencyContactName || '';
    editForm.emergencyContactPhone = newProfile.emergencyContactPhone || '';
    editForm.specialRequirements = newProfile.specialRequirements || '';
  }
}, { deep: true });

const startEditing = () => {
  isEditing.value = true;
  successMessage.value = '';
};

const cancelEditing = () => {
  isEditing.value = false;
  // Reset form
  editForm.displayName = userProfile.value?.displayName || '';
  editForm.phoneNumber = userProfile.value?.phoneNumber || '';
  editForm.companyName = userProfile.value?.companyName || '';
  editForm.emergencyContactName = userProfile.value?.emergencyContactName || '';
  editForm.emergencyContactPhone = userProfile.value?.emergencyContactPhone || '';
  editForm.specialRequirements = userProfile.value?.specialRequirements || '';
};

const saveProfile = async () => {

  isSaving.value = true;
  successMessage.value = '';

  try {

    // Update phone number if changed
    if (editForm.phoneNumber !== userProfile.value?.phoneNumber) {
      await updateUserPhone(editForm.phoneNumber);
    }

    // Sync to Firestore (client-side)
    if (user.value) {

      const { saveUserProfile } = useFirestore();
      const profileData = {
        email: editForm.email,
        displayName: editForm.displayName,
        phoneNumber: editForm.phoneNumber,
        companyName: editForm.companyName,
        emergencyContactName: editForm.emergencyContactName,
        emergencyContactPhone: editForm.emergencyContactPhone,
        specialRequirements: editForm.specialRequirements,
        photoURL: user.value.photoURL,
        preferredPickupLocations: pickupLocations.value,
        preferredDropoffLocations: dropoffLocations.value
      };


      await saveUserProfile(user.value.uid, profileData);
    } else {
      console.error('[PROFILE] ❌ No user found, cannot save!');
      throw new Error('User not found');
    }

    successMessage.value = '✓ Profile updated successfully!';
    isEditing.value = false;

    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (err: any) {
    console.error('[PROFILE] ❌ Error updating profile:', err);
    console.error('[PROFILE] ❌ Error stack:', err.stack);
    successMessage.value = `❌ Error: ${err.message || 'Failed to update profile'}`;
  } finally {
    isSaving.value = false;
  }
};

const handleLogout = async () => {
  try {
    await logout();
    router.push('/');
  } catch (err) {
    console.error('Logout error:', err);
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const handleCancelDelete = () => {
  showDeleteModal.value = false;
};

const handleDeleteAccount = async () => {
  if (!user.value?.uid) {
    alert('No user found. Please log in again.');
    return;
  }

  isDeletingAccount.value = true;

  try {
    const userId = user.value.uid;

    // Step 1: Delete all Firestore data (user profile, bookings, wallet, transactions)
    const { deleteUserAccount } = useFirestore();
    const result = await deleteUserAccount(userId);

    // Step 2: Delete Firebase Auth user
    try {
      await $fetch('/api/users/delete-account', {
        method: 'POST',
        body: { uid: userId }
      });
    } catch (authError: any) {
      console.error('[PROFILE] ⚠️  Firebase Auth deletion failed:', authError);
      // Continue anyway - the user data is already deleted from Firestore
    }

    // Close the modal
    showDeleteModal.value = false;
    isDeletingAccount.value = false;

    // Show success alert
    showDeleteSuccessAlert.value = true;


    // Wait 2 seconds to show the alert, then logout and redirect
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Log out and redirect to home
    await logout();
    router.push('/');

  } catch (err: any) {
    console.error('[PROFILE] ❌ Error deleting account:', err);

    // Show error in a more user-friendly way
    const errorMessage = err.message || 'An unexpected error occurred while deleting your account. Please try again or contact support.';

    // Use a simple alert for now, could be replaced with an error AlertBar
    alert(`Failed to delete account: ${errorMessage}`);

    isDeletingAccount.value = false;
    showDeleteModal.value = false;
  }
};

const handleAlertAction = () => {
  // Optional: Navigate to home immediately when user clicks "Go to Home"
  logout();
  router.push('/');
};

const handleLeaveReview = async (bookingId: string) => {
  const reviewText = window.prompt("Please leave a short review about your ride (e.g. 'Great driver, arrived on time' or 'felt unsafe, driver was speeding'):");
  if (!reviewText) return;

  try {
    const data: any = await $fetch('/api/reviews/submit', {
      method: 'POST',
      body: { bookingId, review: reviewText }
    });
    alert(data.message);
  } catch (err: any) {
    alert("Error submitting review: " + (err.message || 'Unknown error'));
  }
};

// Date formatting helpers
const formatDate = (dateInput: any) => {
  if (!dateInput) return '';
  try {
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

const formatDateTime = (dateInput: any) => {
  if (!dateInput) return '';
  try {
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

// Address management functions
const addAddress = async () => {
  if (!newAddress.value.trim() || isAddingAddress.value) return;

  const locations = addressType.value === 'pickup' ? pickupLocations : dropoffLocations;

  if (locations.value.length >= 3) {
    alert(`You can only save up to 3 ${addressType.value} locations`);
    return;
  }

  isAddingAddress.value = true;
  try {
    locations.value.push(newAddress.value.trim());
    await syncAddressesToFirestore();

    showAddressModal.value = false;
    newAddress.value = '';
    successMessage.value = `✓ ${addressType.value === 'pickup' ? 'Pickup' : 'Dropoff'} location added!`;
    setTimeout(() => successMessage.value = '', 3000);
  } finally {
    isAddingAddress.value = false;
  }
};

const removeAddress = async (type: 'pickup' | 'dropoff', index: number) => {
  if (type === 'pickup') {
    pickupLocations.value.splice(index, 1);
  } else {
    dropoffLocations.value.splice(index, 1);
  }

  await syncAddressesToFirestore();
  successMessage.value = `✓ ${type === 'pickup' ? 'Pickup' : 'Dropoff'} location removed!`;
  setTimeout(() => successMessage.value = '', 3000);
};

const syncAddressesToFirestore = async () => {
  if (!user.value) return;

  try {
    const { saveUserProfile } = useFirestore();
    await saveUserProfile(user.value.uid, {
      email: editForm.email,
      displayName: editForm.displayName,
      phoneNumber: editForm.phoneNumber,
      photoURL: user.value.photoURL,
      preferredPickupLocations: pickupLocations.value,
      preferredDropoffLocations: dropoffLocations.value
    });
  } catch (err) {
    console.error('[PROFILE] Failed to sync addresses:', err);
  }
};

// Initialize Google Places Autocomplete for address input
const initAddressAutocomplete = async () => {
  if (process.server || !addressInput.value) return;

  // Wait for Google Maps to load
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    setTimeout(initAddressAutocomplete, 500);
    return;
  }

  try {

    // Create autocomplete instance
    addressAutocomplete.value = new window.google.maps.places.Autocomplete(addressInput.value, {
      componentRestrictions: { country: 'gb' },
      fields: ['formatted_address', 'name']
    });

    // Listen for place selection
    addressAutocomplete.value.addListener('place_changed', () => {
      const place = addressAutocomplete.value.getPlace();
      if (place && addressInput.value) {
        // Use the actual input value instead of formatted_address
        // This ensures we get EXACTLY what the user clicked in the dropdown
        newAddress.value = addressInput.value.value;
      }
    });

  } catch (error) {
    console.error('[PROFILE] Error initializing autocomplete:', error);
  }
};

// Watch for modal opening and initialize autocomplete
watch(showAddressModal, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    setTimeout(() => {
      initAddressAutocomplete();
    }, 100);
  }
});
</script>

<style>
/* Google Places Autocomplete dropdown styling */
.pac-container {
  border-radius: 0.5rem !important;
  border: 1px solid #d1d5db !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  margin-top: 8px !important;
  padding: 4px 0 !important;
  background: #ffffff !important;
  z-index: 9999 !important;
}

.pac-item {
  padding: 12px 16px !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  font-size: 15px !important;
  color: #111827 !important;
  border-top: 1px solid #f3f4f6 !important;
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
}

.pac-item:first-child {
  border-top: none !important;
}

.pac-item:hover,
.pac-item-selected {
  background-color: #fef3c7 !important;
}

.pac-item-query {
  font-size: 15px !important;
  color: #111827 !important;
  font-weight: 500 !important;
}

.pac-matched {
  font-weight: 600 !important;
  color: #d97706 !important;
}

.pac-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 12px !important;
}
</style>
