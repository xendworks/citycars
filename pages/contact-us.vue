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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            
            <!-- Success Message -->
            <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <div class="flex items-start space-x-3">
                <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-semibold text-green-800">Message sent successfully!</p>
                  <p class="text-sm text-green-700 mt-1">{{ successMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Your Name</label>
                <input v-model="form.name" type="text" id="name" required class="w-full p-3 border border-gray-300 rounded-md font-inter focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="John Doe">
              </div>
              
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Email Address</label>
                <input v-model="form.email" type="email" id="email" required class="w-full p-3 border border-gray-300 rounded-md font-inter focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="john@example.com">
              </div>
              
              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Phone Number</label>
                <input v-model="form.phone" type="tel" id="phone" class="w-full p-3 border border-gray-300 rounded-md font-inter focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="+44 1234 567890">
              </div>
              
              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Subject</label>
                <select v-model="form.subject" id="subject" required class="w-full p-3 border border-gray-300 rounded-md font-inter focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking Request">Booking Request</option>
                  <option value="Special Requirements">Special Requirements</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1 font-lexend">Your Message</label>
                <textarea v-model="form.message" id="message" rows="4" required class="w-full p-3 border border-gray-300 rounded-md font-inter focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Please provide details about your inquiry..."></textarea>
              </div>
              
              <!-- Submit Button -->
              <div>
                <button type="submit" :disabled="isSubmitting" class="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md font-semibold font-lexend transition-colors">
                  <span v-if="isSubmitting">Sending...</span>
                  <span v-else>Send Message</span>
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
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500.0000000000005!2d-0.2082155!3d51.1268316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875ee39ded8fab5%3A0x80788f4a0b177445!2s55%20Fitchet%20Cl%2C%20Crawley%20RH11%207PY%2C%20UK!5e0!3m2!1sen!2suk!4v1652345678901!5m2!1sen!2suk" 
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full h-96 rounded-md"
            title="City Cars Location - 55 Fitchet Cl, Crawley RH11 7PY, UK">
          </iframe>
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

<script setup lang="ts">
import { ref } from 'vue';
import { useQueryStore } from '~/stores/queryStore'

// SEO Meta Tags
useSEO({
  title: 'Contact Us - CityCars Gatwick | Get in Touch for Airport Transfers',
  description: 'Contact CityCars Gatwick for inquiries, bookings, or support. Available 24/7 via phone, email, or online form. We\'re here to help with your airport transfer needs.',
  url: '/contact-us'
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    });

    if (response.success) {
      successMessage.value = 'We\'ve received your message and will get back to you within 24 hours.';
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };

      // Clear success message after 5 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    } else {
      throw new Error(response.message || 'Failed to send message');
    }
  } catch (error: any) {
    console.error('Contact form error:', error);
    errorMessage.value = error.message || 'Failed to send message. Please try again or email us directly at bookings@citycars.co.uk';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style> 