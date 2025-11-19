<template>
  <footer class="bg-city-blue text-white py-12 font-inter">
    <!-- Top Services Area -->
    <div class="container mx-auto px-4 mb-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
        <!-- Help Section -->
        <div>
          <h3 class="text-xl font-lexend font-semibold mb-6 text-white border-b border-gray-700 pb-2">Let us help you</h3>
          <div class="space-y-4">
            <a href="#" class="flex items-center group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-city-gold group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span class="group-hover:text-city-gold transition-colors">Dial a cab</span>
            </a>
            <a href="#" class="flex items-center group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-city-gold group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 5.5c.944-.945 2.56-.276 2.56 1.06V8h5.13a.75.75 0 010 1.5H8.5v2.03c0 .751-.814 1.337-1.56 1.12a.75.75 0 01-.44-1.12V9.5H1.75a.75.75 0 010-1.5H6.5V6.56c0-1.336 1.616-2.005 2.56-1.06A4.002 4.002 0 0110 9.5h4.313a.75.75 0 010 1.5H10a4.002 4.002 0 01-4.06 4z" clip-rule="evenodd" />
              </svg>
              <span class="group-hover:text-city-gold transition-colors">Taxi Fare Calculator</span>
            </a>
            <a href="#" class="flex items-center group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-city-gold group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <span class="group-hover:text-city-gold transition-colors">Student Discount</span>
            </a>
            <a href="#" class="flex items-center group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-city-gold group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              <span class="group-hover:text-city-gold transition-colors">Support & Help</span>
            </a>
          </div>
        </div>

        <!-- Airport & Station Transfers -->
        <div>
          <h3 class="text-xl font-lexend font-semibold mb-6 text-white border-b border-gray-700 pb-2">Popular Transfers</h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <h4 class="text-city-gold font-medium mb-3">Airports</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-city-gold transition-colors">Heathrow Airport</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">Gatwick Airport</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">Stansted Airport</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">Luton Airport</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">Manchester Airport</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-city-gold font-medium mb-3">Stations</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-city-gold transition-colors">Victoria Station</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">Paddington Station</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">Kings Cross Station</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">Euston Station</a></li>
                <li><a href="#" class="hover:text-city-gold transition-colors">London Bridge Station</a></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- UK Wide Cities -->
        <div>
          <h3 class="text-xl font-lexend font-semibold mb-6 text-white border-b border-gray-700 pb-2">UK Wide Service</h3>
          <div class="grid grid-cols-3 gap-x-2 gap-y-2 text-sm">
            <a href="#" class="hover:text-city-gold transition-colors">London</a>
            <a href="#" class="hover:text-city-gold transition-colors">Birmingham</a>
            <a href="#" class="hover:text-city-gold transition-colors">Manchester</a>
            <a href="#" class="hover:text-city-gold transition-colors">Leeds</a>
            <a href="#" class="hover:text-city-gold transition-colors">Edinburgh</a>
            <a href="#" class="hover:text-city-gold transition-colors">Glasgow</a>
            <a href="#" class="hover:text-city-gold transition-colors">Liverpool</a>
            <a href="#" class="hover:text-city-gold transition-colors">Bristol</a>
            <a href="#" class="hover:text-city-gold transition-colors">Oxford</a>
            <a href="#" class="hover:text-city-gold transition-colors">Cambridge</a>
            <a href="#" class="hover:text-city-gold transition-colors">Cardiff</a>
            <a href="#" class="hover:text-city-gold transition-colors">York</a>
          </div>
        </div>
      </div>
      <div class="mt-6 bg-gray-800 bg-opacity-30 p-4 rounded-lg w-full">
            <h4 class="text-city-gold font-lexend font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              Service in all major UK cities
            </h4>
            <p class="text-sm text-gray-300">City Cars provides taxi and minicab services in all major cities and airports across the UK for your convenience.</p>
          </div>
    </div>

    <!-- Why Choose Us & Contact -->
    <div class="container mx-auto px-4 py-8 border-t border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Why Choose Us -->
        <div>
          <h3 class="text-xl font-lexend font-semibold mb-4">Why ride with City Cars?</h3>
          <div class="grid grid-cols-2 gap-6">
            <div class="flex items-start">
              <div class="bg-city-gold bg-opacity-20 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-city-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-lexend font-medium text-white">Competitive Pricing</h4>
                <p class="text-sm text-gray-300 mt-1">Enjoy great value with our affordable rates.</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="bg-city-gold bg-opacity-20 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-city-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-lexend font-medium text-white">Easy Booking</h4>
                <p class="text-sm text-gray-300 mt-1">Simple online platform for fast bookings.</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="bg-city-gold bg-opacity-20 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-city-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <h4 class="font-lexend font-medium text-white">Professional Drivers</h4>
                <p class="text-sm text-gray-300 mt-1">Expert drivers ensure your safe journey.</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="bg-city-gold bg-opacity-20 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-city-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="font-lexend font-medium text-white">Safe & Secure</h4>
                <p class="text-sm text-gray-300 mt-1">Your safety is our top priority.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div class="flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-lexend font-semibold mb-4">Contact Information</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-city-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <span class="text-sm text-gray-400">Phone</span>
                  <p><a href="tel:+441293222710" class="hover:text-city-gold transition-colors">+44 1293 222710</a></p>
                </div>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-city-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <span class="text-sm text-gray-400">Email</span>
                  <p><a href="mailto:bookings@citycars.co.uk" class="hover:text-city-gold transition-colors">bookings@citycars.co.uk</a></p>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- Accepted Payment Methods -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-400 mb-2">Accepted Payment Methods</h4>
            <div class="flex flex-wrap">
              <span class="bg-white px-2 py-1 rounded mr-2 mb-2 text-gray-800 text-xs font-medium">Visa</span>
              <span class="bg-white px-2 py-1 rounded mr-2 mb-2 text-gray-800 text-xs font-medium">Mastercard</span>
              <span class="bg-white px-2 py-1 rounded mr-2 mb-2 text-gray-800 text-xs font-medium">Amex</span>
              <span class="bg-white px-2 py-1 rounded mr-2 mb-2 text-gray-800 text-xs font-medium">PayPal</span>
              <span class="bg-white px-2 py-1 rounded mr-2 mb-2 text-gray-800 text-xs font-medium">Google Pay</span>
              <span class="bg-white px-2 py-1 rounded mr-2 mb-2 text-gray-800 text-xs font-medium">Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="container mx-auto px-4 pt-8 border-t border-gray-700 mt-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Logo & Copyright -->
        <div class="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div class="text-2xl font-bold font-lexend mb-2">
            <span class="text-white">CITY</span>
            <span class="text-city-gold">CARS</span>
          </div>
          <p class="text-sm text-gray-400">&copy; 2025 City Cars Ltd. All rights reserved.</p>
        </div>
        
        <!-- Navigation Links -->
        <div class="flex flex-wrap justify-center mb-6 md:mb-0">
          <a href="#" class="mx-2 my-1 text-sm hover:text-city-gold transition-colors">About Us</a>
          <a href="/contractor-agreement" class="mx-2 my-1 text-sm hover:text-city-gold transition-colors">Terms & Conditions</a>
          <a href="/privacy-policy" class="mx-2 my-1 text-sm hover:text-city-gold transition-colors">Privacy Policy</a>
          <a href="#" @click.prevent="showCookiePreferences" class="mx-2 my-1 text-sm hover:text-city-gold transition-colors cursor-pointer">Cookie Preferences</a>
          <a href="#" class="mx-2 my-1 text-sm hover:text-city-gold transition-colors">FAQs</a>
          <a href="#" class="mx-2 my-1 text-sm hover:text-city-gold transition-colors">Blog</a>
        </div>
        
        <!-- Social Media -->
        <div class="flex space-x-4">
          <a href="#" class="text-white hover:text-city-gold transition-colors" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href="#" class="text-white hover:text-city-gold transition-colors" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" class="text-white hover:text-city-gold transition-colors" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-white hover:text-city-gold transition-colors" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { showPreferences } = useCookieConsent();

const showCookiePreferences = () => {
  showPreferences();
};
</script>

<style scoped>
/* Any custom styles not covered by Tailwind can go here */
</style>
