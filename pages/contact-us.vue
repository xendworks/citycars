<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-amber-50 py-12">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl font-bold mb-4 font-lexend">Contact Us</h1>
        <p class="max-w-3xl mx-auto text-gray-700 mb-8 font-inter">
          Have questions about our services or need to make a special booking? Our friendly team is here to help.
          Contact us today and we'll get back to you as soon as possible.
        </p>
      </div>
    </section>

    <!-- Contact Information & Form Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div>
            <h2 class="text-2xl font-bold mb-8 font-lexend">Get In Touch</h2>
            
            <div class="space-y-6">
              <!-- Phone -->
              <div class="flex items-start">
                <div class="bg-amber-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-1 font-lexend">Phone</h3>
                  <p class="text-gray-600 mb-1 font-inter">+44 1293 222710</p>
                  <p class="text-gray-500 text-sm font-inter">Available 24/7 for bookings and inquiries</p>
                </div>
              </div>
              
              <!-- Email -->
              <div class="flex items-start">
                <div class="bg-amber-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-1 font-lexend">Email</h3>
                  <p class="text-gray-600 mb-1 font-inter">bookings@citycars.co.uk</p>
                  <p class="text-gray-500 text-sm font-inter">We'll respond as quickly as possible</p>
                </div>
              </div>
              
              <!-- Office Address -->
              <div class="flex items-start">
                <div class="bg-amber-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-1 font-lexend">Office Address</h3>
                  <p class="text-gray-600 mb-1 font-inter">123 Airport Road</p>
                  <p class="text-gray-600 mb-1 font-inter">Gatwick</p>
                  <p class="text-gray-600 font-inter">RH6 0NP, United Kingdom</p>
                </div>
              </div>
              
              <!-- Business Hours -->
              <div class="flex items-start">
                <div class="bg-amber-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-1 font-lexend">Business Hours</h3>
                  <p class="text-gray-600 mb-1 font-inter">Monday - Friday: 8:00 AM - 8:00 PM</p>
                  <p class="text-gray-600 mb-1 font-inter">Saturday: 9:00 AM - 6:00 PM</p>
                  <p class="text-gray-600 font-inter">Sunday: 10:00 AM - 4:00 PM</p>
                  <p class="text-gray-500 text-sm mt-1 font-inter">24/7 phone booking available</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div>
            <h2 class="text-2xl font-bold mb-8 font-lexend">Send Us a Message</h2>
            
            <form class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Your Name</label>
                <input type="text" id="name" class="w-full p-3 border border-gray-300 rounded-md font-inter" placeholder="John Doe">
              </div>
              
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Email Address</label>
                <input type="email" id="email" class="w-full p-3 border border-gray-300 rounded-md font-inter" placeholder="john@example.com">
              </div>
              
              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Phone Number</label>
                <input type="tel" id="phone" class="w-full p-3 border border-gray-300 rounded-md font-inter" placeholder="+44 1234 567890">
              </div>
              
              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Subject</label>
                <select id="subject" class="w-full p-3 border border-gray-300 rounded-md font-inter">
                  <option>General Inquiry</option>
                  <option>Booking Request</option>
                  <option>Special Requirements</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              
              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Your Message</label>
                <textarea id="message" rows="4" class="w-full p-3 border border-gray-300 rounded-md font-inter" placeholder="Please provide details about your inquiry..."></textarea>
              </div>
              
              <!-- Submit Button -->
              <div>
                <button type="submit" class="w-full bg-amber-400 hover:bg-amber-500 text-white py-3 px-6 rounded-md font-semibold font-lexend">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-center mb-8 font-lexend">Find Us</h2>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <!-- Replace with actual map embed code in production -->
          <div class="w-full h-96 bg-gray-200 rounded-md flex items-center justify-center">
            <p class="text-gray-600 font-inter">Map will be displayed here</p>
            <!-- In production, replace with:
            <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            -->
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-center mb-12 font-lexend">Frequently Asked Questions</h2>
        
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- FAQ Item 1 -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-2 font-lexend">How do I book a taxi?</h3>
            <p class="text-gray-600 font-inter">
              You can book a taxi through our website, by calling our 24/7 booking line, or by sending us an email.
              For the quickest service, we recommend booking online or by phone.
            </p>
          </div>
          
          <!-- FAQ Item 2 -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-2 font-lexend">What payment methods do you accept?</h3>
            <p class="text-gray-600 font-inter">
              We accept all major credit and debit cards, cash payments, and corporate account billing.
              Card payments can be made securely online, through our app, or directly to the driver.
            </p>
          </div>
          
          <!-- FAQ Item 3 -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-2 font-lexend">How far in advance should I book?</h3>
            <p class="text-gray-600 font-inter">
              For airport transfers and wheelchair accessible vehicles, we recommend booking at least 24 hours in advance.
              However, we can often accommodate last-minute bookings depending on availability.
            </p>
          </div>
          
          <!-- FAQ Item 4 -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-2 font-lexend">What if my flight is delayed?</h3>
            <p class="text-gray-600 font-inter">
              Don't worry! We monitor all flight arrivals in real-time. Your driver will adjust their schedule
              based on your actual arrival time, and there's no extra charge for flight delays.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Contact Us - City Cars'
})
</script>

<style scoped>
</style> 