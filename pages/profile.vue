<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with gradient background -->
    <div class="bg-gray-900 text-white py-8 px-6 shadow-lg">
      <div class="container mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">{{ userProfile?.displayName || 'User' }}</h1>
          <p class="text-amber-50">{{ userProfile?.phoneNumber || 'No phone' }} • {{ userProfile?.email }}</p>
        </div>
        <button
          v-if="activeTab === 'details' && !isEditing"
          @click="startEditing"
          class="px-6 py-2.5 border-2 border-white text-white rounded-lg hover:bg-white hover:text-amber-600 transition-colors font-semibold uppercase"
        >
          Edit Profile
        </button>
        <button
          v-else-if="activeTab === 'details' && isEditing"
          @click="cancelEditing"
          class="px-6 py-2.5 border-2 border-white text-white rounded-lg hover:bg-white hover:text-amber-600 transition-colors font-semibold uppercase"
        >
          Cancel
        </button>
        <button
          v-else
          @click="handleLogout"
          class="px-6 py-2.5 border-2 border-white text-white rounded-lg hover:bg-red-600 hover:border-red-600 transition-colors font-semibold uppercase"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto max-w-7xl py-8 px-6">
      <!-- Delete Success Alert -->
      <div v-if="showDeleteSuccessAlert" class="mb-6">
        <AlertBar
          :show="showDeleteSuccessAlert"
          type="success"
          title="Account Deleted Successfully"
          message="Your account and all associated data have been permanently deleted. You will be redirected to the home page shortly."
          actionText="Go to Home"
          showDismiss
          :autoDismiss="false"
          @action="handleAlertAction"
          @dismiss="showDeleteSuccessAlert = false"
          @update:show="showDeleteSuccessAlert = $event"
        />
      </div>

      <!-- Global Success Message -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-md flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">{{ successMessage }}</span>
        </div>
        <button @click="successMessage = ''" class="text-green-700 hover:text-green-900">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex gap-6">
        <!-- Sidebar -->
        <div class="w-80 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              @click="activeTab = 'bookings'"
              :class="[
                'w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors',
                activeTab === 'bookings'
                  ? 'bg-orange-50 border-l-4 border-orange-500'
                  : 'hover:bg-gray-50'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span class="font-semibold text-gray-800">My Bookings</span>
            </button>

            <button
              @click="activeTab = 'details'"
              :class="[
                'w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors',
                activeTab === 'details'
                  ? 'bg-orange-50 border-l-4 border-orange-500'
                  : 'hover:bg-gray-50'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="font-semibold text-gray-800">Account Details</span>
            </button>

            <button
              @click="activeTab = 'addresses'"
              :class="[
                'w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors',
                activeTab === 'addresses'
                  ? 'bg-orange-50 border-l-4 border-orange-500'
                  : 'hover:bg-gray-50'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="font-semibold text-gray-800">Saved Addresses</span>
            </button>

            <button
              @click="activeTab = 'wallet'"
              :class="[
                'w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors',
                activeTab === 'wallet'
                  ? 'bg-orange-50 border-l-4 border-orange-500'
                  : 'hover:bg-gray-50'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span class="font-semibold text-gray-800">Wallet</span>
            </button>

            <button
              @click="activeTab = 'settings'"
              :class="[
                'w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors',
                activeTab === 'settings'
                  ? 'bg-orange-50 border-l-4 border-orange-500'
                  : 'hover:bg-gray-50'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="font-semibold text-gray-800">Settings</span>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1">
          <!-- My Bookings Tab -->
          <div v-if="activeTab === 'bookings'" class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
            
            <!-- Loading State -->
            <div v-if="loadingBookings" class="text-center py-16">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p class="mt-4 text-gray-600">Loading your bookings...</p>
            </div>
            
            <!-- No Bookings -->
            <div v-else-if="userBookings.length === 0" class="text-center py-16">
              <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">No bookings yet</h3>
              <p class="mt-2 text-sm text-gray-500">Start booking your rides to see them here.</p>
              <div class="mt-6">
                <NuxtLink
                  to="/"
                  class="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Book a Ride Now
                </NuxtLink>
              </div>
            </div>
            
            <!-- Bookings List -->
            <div v-else class="space-y-4">
              <div 
                v-for="booking in userBookings" 
                :key="booking.id"
                class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <div class="flex items-center space-x-3 mb-2">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                        :class="{
                          'bg-yellow-100 text-yellow-800': booking.status === 'pending',
                          'bg-green-100 text-green-800': booking.status === 'confirmed',
                          'bg-blue-100 text-blue-800': booking.status === 'in-progress',
                          'bg-gray-100 text-gray-800': booking.status === 'completed',
                          'bg-red-100 text-red-800': booking.status === 'cancelled'
                        }"
                      >
                        {{ booking.status?.toUpperCase() || 'PENDING' }}
                      </span>
                      <span class="text-sm font-mono text-gray-600">{{ booking.bookingReference }}</span>
                    </div>
                    <p class="text-xs text-gray-500">
                      Booked on {{ formatDate(booking.createdAt) }}
                    </p>
                  </div>
                  <p class="text-2xl font-bold text-orange-600">
                    £{{ booking.totalFare?.toFixed(2) || '0.00' }}
                  </p>
                </div>
                
                <div class="space-y-2 text-sm">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="font-semibold text-gray-900">Pickup:</p>
                      <p class="text-gray-600">{{ booking.pickupAddress }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="font-semibold text-gray-900">Dropoff:</p>
                      <p class="text-gray-600">{{ booking.dropoffAddress }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2 pt-2 border-t border-gray-100">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-gray-700">
                      <span class="font-semibold">Pickup Time:</span> {{ formatDateTime(booking.pickupDateTime) }}
                    </p>
                  </div>
                  
                  <div class="flex items-center space-x-4 pt-2 text-xs text-gray-600">
                    <span class="capitalize">
                      <strong>Vehicle:</strong> {{ booking.cabType || booking.vehicleType }}
                    </span>
                    <span>
                      <strong>Passengers:</strong> {{ booking.passengers || 1 }}
                    </span>
                    <span>
                      <strong>Luggage:</strong> {{ booking.luggage || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Details Tab -->
          <div v-if="activeTab === 'details'" class="bg-white rounded-lg shadow-md p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Account Information</h2>
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
              >
                Edit Profile
              </button>
            </div>
            
            <form @submit.prevent="saveProfile" class="space-y-6">
              <!-- Full Name -->
              <div>
                <label for="displayName" class="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="displayName"
                  v-model="editForm.displayName"
                  type="text"
                  :disabled="!isEditing"
                  :class="[
                    'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                    isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  ]"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="editForm.email"
                  type="email"
                  disabled
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
                <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span v-if="isEditing" class="text-amber-600">(Editable)</span>
                </label>
                <input
                  id="phone"
                  v-model="editForm.phoneNumber"
                  type="tel"
                  :disabled="!isEditing"
                  :class="[
                    'appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
                    isEditing ? 'border-amber-300 bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  ]"
                  placeholder="+44 1234 567890"
                />
                <p v-if="isEditing" class="mt-1 text-xs text-amber-600">✓ You can change your phone number</p>
              </div>

              <!-- Action Buttons -->
              <div v-if="isEditing" class="flex space-x-4 pt-4 border-t">
                <button
                  type="submit"
                  :disabled="isSaving"
                  class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 text-lg"
                >
                  {{ isSaving ? 'Saving...' : '✓ Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="cancelEditing"
                  class="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors text-lg"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>

            <!-- Error Message -->
            <div v-if="error" class="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md">
              {{ error }}
            </div>
          </div>

          <!-- Saved Addresses Tab -->
          <div v-if="activeTab === 'addresses'" class="bg-white rounded-lg shadow-md p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Saved Addresses</h2>
              <button 
                @click="showAddressModal = true; addressType = 'pickup'; newAddress = ''"
                class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
              >
                + Add Address
              </button>
            </div>

            <!-- Pickup Locations -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Pickup Locations ({{ pickupLocations.length }}/3)
              </h3>
              
              <div v-if="pickupLocations.length === 0" class="text-gray-500 text-sm py-4">
                No pickup locations saved yet
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="(location, idx) in pickupLocations" 
                  :key="`pickup-${idx}`"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-800">{{ location }}</span>
                  </div>
                  <button 
                    @click="removeAddress('pickup', idx)"
                    class="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <button 
                v-if="pickupLocations.length < 3"
                @click="showAddressModal = true; addressType = 'pickup'; newAddress = ''"
                class="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                + Add Pickup Location
              </button>
            </div>

            <!-- Dropoff Locations -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Dropoff Locations ({{ dropoffLocations.length }}/3)
              </h3>
              
              <div v-if="dropoffLocations.length === 0" class="text-gray-500 text-sm py-4">
                No dropoff locations saved yet
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="(location, idx) in dropoffLocations" 
                  :key="`dropoff-${idx}`"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-800">{{ location }}</span>
                  </div>
                  <button 
                    @click="removeAddress('dropoff', idx)"
                    class="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <button 
                v-if="dropoffLocations.length < 3"
                @click="showAddressModal = true; addressType = 'dropoff'; newAddress = ''"
                class="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                + Add Dropoff Location
              </button>
            </div>
          </div>

          <!-- Wallet Tab -->
          <div v-if="activeTab === 'wallet'" class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Wallet</h2>
            
            <!-- Wallet Balance Card -->
            <div class="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-6 text-white mb-6">
              <p class="text-sm opacity-90">Available Balance</p>
              <h3 class="text-4xl font-bold mt-2">£0.00</h3>
              <button class="mt-4 px-6 py-2 bg-white text-amber-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Add Money
              </button>
            </div>

            <!-- Transaction History -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
              <div class="text-center py-12 text-gray-500">
                <p>No transactions yet</p>
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
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
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
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <!-- Logout -->
              <div class="pt-6 pb-6 border-b">
                <h3 class="text-sm font-semibold text-gray-900 mb-2">Session</h3>
                <p class="text-sm text-gray-500 mb-4">Sign out of your account on this device</p>
                <button
                  @click="handleLogout"
                  class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>

              <!-- Delete Account -->
              <div class="pt-6">
                <h3 class="text-sm font-semibold text-red-900 mb-2">Danger Zone</h3>
                <button
                  @click="confirmDelete"
                  class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
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
    <div 
      v-if="showAddressModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      @click.self="showAddressModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">
            Add {{ addressType === 'pickup' ? 'Pickup' : 'Dropoff' }} Location
          </h3>
          <button 
            @click="showAddressModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
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
            <input
              ref="addressInput"
              v-model="newAddress"
              type="text"
              required
              placeholder="e.g., Horley, Gatwick RH6 0NP"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </div>

          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              @click="showAddressModal = false"
              class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <DeleteConfirmationModal
      :isOpen="showDeleteModal"
      title="Delete Account"
      message="Are you sure you want to delete your account? All of your data, including bookings, saved addresses, and wallet information will be permanently removed from our servers forever. This action cannot be undone."
      confirmText="Delete Account"
      cancelText="Cancel"
      loadingText="Deleting..."
      :isLoading="isDeletingAccount"
      @confirm="handleDeleteAccount"
      @cancel="handleCancelDelete"
      @update:isOpen="showDeleteModal = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth',
  title: 'Profile - City Cars'
});

const router = useRouter();
const { user, userProfile, logout, updateUserPhone, error } = useAuth();

const activeTab = ref('bookings');
const isEditing = ref(false);
const isSaving = ref(false);
const successMessage = ref('');
const showDeleteModal = ref(false);
const isDeletingAccount = ref(false);
const showDeleteSuccessAlert = ref(false);

const editForm = reactive({
  displayName: '',
  email: '',
  phoneNumber: ''
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
const loadingBookings = ref(false);

// Initialize form with user data
onMounted(async () => {
  if (!user.value) {
    router.push('/login');
    return;
  }
  
  console.log('[PROFILE] onMounted - userProfile:', userProfile.value);
  
  editForm.displayName = userProfile.value?.displayName || '';
  editForm.email = userProfile.value?.email || '';
  editForm.phoneNumber = userProfile.value?.phoneNumber || '';

  console.log('[PROFILE] Initial form values:', editForm);

  // Load addresses and bookings from Firestore (client-side only)
  if (process.client) {
    try {
      const { getUserProfile, getUserBookings } = useFirestore();
      const profile = await getUserProfile(user.value.uid);
      
      if (profile) {
        pickupLocations.value = profile.preferredPickupLocations || [];
        dropoffLocations.value = profile.preferredDropoffLocations || [];
        console.log('[PROFILE] Loaded addresses from Firestore:', {
          pickup: pickupLocations.value,
          dropoff: dropoffLocations.value
        });
      }
      
      // Load user bookings
      loadingBookings.value = true;
      console.log('[PROFILE] Attempting to load bookings for UID:', user.value.uid);
      
      try {
        const bookings = await getUserBookings(user.value.uid);
        userBookings.value = bookings;
        console.log('[PROFILE] ✅ Loaded bookings:', bookings);
        console.log('[PROFILE] Number of bookings:', bookings.length);
        loadingBookings.value = false;
      } catch (bookingError) {
        console.error('[PROFILE] ❌ Failed to load bookings:', bookingError);
        console.error('[PROFILE] ❌ Error details:', bookingError.message);
        console.error('[PROFILE] ❌ Error code:', bookingError.code);
        loadingBookings.value = false;
      }
    } catch (err) {
      console.error('[PROFILE] ❌ Failed to load data:', err);
      loadingBookings.value = false;
    }
  }
});

// Watch userProfile for changes (it loads asynchronously from Firestore)
watch(userProfile, (newProfile) => {
  if (newProfile && !isEditing.value) {
    console.log('[PROFILE] userProfile changed, updating form:', newProfile);
    editForm.displayName = newProfile.displayName || '';
    editForm.email = newProfile.email || '';
    editForm.phoneNumber = newProfile.phoneNumber || '';
    console.log('[PROFILE] Form updated with new profile data:', editForm);
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
};

const saveProfile = async () => {
  console.log('[PROFILE] 🔥 SAVE PROFILE CALLED!');
  console.log('[PROFILE] Current form data:', editForm);
  console.log('[PROFILE] User:', user.value);
  console.log('[PROFILE] Is editing:', isEditing.value);
  
  isSaving.value = true;
  successMessage.value = '';
  
  try {
    console.log('[PROFILE] Saving profile...');
    console.log('[PROFILE] Old phone:', userProfile.value?.phoneNumber);
    console.log('[PROFILE] New phone:', editForm.phoneNumber);
    
    // Update phone number if changed
    if (editForm.phoneNumber !== userProfile.value?.phoneNumber) {
      console.log('[PROFILE] Phone number changed, updating Firebase Auth...');
      await updateUserPhone(editForm.phoneNumber);
      console.log('[PROFILE] ✓ Phone number updated in Firebase Auth!');
    }
    
    // Sync to Firestore (client-side)
    if (user.value) {
      console.log('[PROFILE] Syncing to Firestore...');
      console.log('[PROFILE] User UID:', user.value.uid);
      
      const { saveUserProfile } = useFirestore();
      const profileData = {
        email: editForm.email,
        displayName: editForm.displayName,
        phoneNumber: editForm.phoneNumber,
        photoURL: user.value.photoURL,
        preferredPickupLocations: pickupLocations.value,
        preferredDropoffLocations: dropoffLocations.value
      };
      
      console.log('[PROFILE] Profile data to save:', profileData);
      
      await saveUserProfile(user.value.uid, profileData);
      console.log('[PROFILE] ✅ Profile synced to Firestore successfully!');
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
    console.log('[PROFILE] Save complete, isSaving:', isSaving.value);
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
    console.log('[PROFILE] 🗑️  Starting account deletion for user:', userId);
    
    // Step 1: Delete all Firestore data (user profile, bookings, wallet, transactions)
    console.log('[PROFILE] Step 1: Deleting Firestore data...');
    const { deleteUserAccount } = useFirestore();
    const result = await deleteUserAccount(userId);
    console.log('[PROFILE] ✅ Deleted', result.deletedCount, 'documents from Firestore');
    
    // Step 2: Delete Firebase Auth user
    console.log('[PROFILE] Step 2: Deleting Firebase Auth user...');
    try {
      await $fetch('/api/users/delete-account', {
        method: 'POST',
        body: { uid: userId }
      });
      console.log('[PROFILE] ✅ Firebase Auth user deleted');
    } catch (authError: any) {
      console.error('[PROFILE] ⚠️  Firebase Auth deletion failed:', authError);
      // Continue anyway - the user data is already deleted from Firestore
    }
    
    // Close the modal
    showDeleteModal.value = false;
    isDeletingAccount.value = false;
    
    // Show success alert
    showDeleteSuccessAlert.value = true;
    
    console.log('[PROFILE] ✅ Account deletion complete!');
    
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

// Date formatting helpers
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Address management functions
const addAddress = async () => {
  if (!newAddress.value.trim()) return;

  const locations = addressType.value === 'pickup' ? pickupLocations : dropoffLocations;
  
  if (locations.value.length >= 3) {
    alert(`You can only save up to 3 ${addressType.value} locations`);
    return;
  }

  locations.value.push(newAddress.value.trim());
  await syncAddressesToFirestore();
  
  showAddressModal.value = false;
  newAddress.value = '';
  successMessage.value = `✓ ${addressType.value === 'pickup' ? 'Pickup' : 'Dropoff'} location added!`;
  setTimeout(() => successMessage.value = '', 3000);
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
    console.log('[PROFILE] Addresses synced to Firestore (client-side)');
  } catch (err) {
    console.error('[PROFILE] Failed to sync addresses:', err);
  }
};

// Initialize Google Places Autocomplete for address input
const initAddressAutocomplete = async () => {
  if (process.server || !addressInput.value) return;
  
  // Wait for Google Maps to load
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.log('[PROFILE] Google Maps not loaded yet, waiting...');
    setTimeout(initAddressAutocomplete, 500);
    return;
  }
  
  try {
    console.log('[PROFILE] Initializing autocomplete for address input');
    
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
        console.log('[PROFILE] Address selected:', newAddress.value);
        console.log('[PROFILE] (Google formatted version was:', place.formatted_address, ')');
      }
    });
    
    console.log('[PROFILE] ✓ Autocomplete initialized');
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
