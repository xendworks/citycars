import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { ref, resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './BookingForm-D713lZYZ.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'node:zlib';
import 'node:stream';
import 'node:util';
import 'node:net';
import 'vue-router';

const _imports_0 = "" + buildAssetsURL("2.nEZJxTu8.png");
const _imports_1 = "" + buildAssetsURL("2.nEZJxTu8.png");
const _imports_2 = "" + buildAssetsURL("2.nEZJxTu8.png");
const _imports_3 = "" + buildAssetsURL("3.Dz29l1rl.png");
const _imports_4 = "" + buildAssetsURL("4.C4UuKTye.png");
const _imports_5 = "" + buildAssetsURL("4.C4UuKTye.png");
const _imports_6 = "" + buildAssetsURL("8.B1EGOTXQ.png");
const _imports_7 = "" + buildAssetsURL("playstore.CxE9nEHB.png");
const _imports_8 = "" + buildAssetsURL("appstore.COntmECh.png");
const _imports_9 = "" + buildAssetsURL("playstore.CxE9nEHB.png");
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("popular");
    const cityDestinations = ref({
      popular: [
        { name: "London", distance: "25 miles" },
        { name: "Brighton", distance: "28 miles" },
        { name: "Southampton", distance: "70 miles" },
        { name: "Oxford", distance: "62 miles" },
        { name: "Heathrow", distance: "40 miles" },
        { name: "Portsmouth", distance: "58 miles" },
        { name: "Crawley", distance: "3 miles" },
        { name: "Horsham", distance: "15 miles" },
        { name: "Guildford", distance: "22 miles" }
      ],
      london: [
        { name: "Central London", distance: "30 miles" },
        { name: "Westminster", distance: "31 miles" },
        { name: "Kensington", distance: "32 miles" },
        { name: "Camden", distance: "33 miles" },
        { name: "Greenwich", distance: "35 miles" },
        { name: "Canary Wharf", distance: "37 miles" },
        { name: "Croydon", distance: "15 miles" },
        { name: "Richmond", distance: "28 miles" },
        { name: "Bromley", distance: "20 miles" }
      ],
      coast: [
        { name: "Brighton", distance: "28 miles" },
        { name: "Eastbourne", distance: "42 miles" },
        { name: "Worthing", distance: "35 miles" },
        { name: "Bognor Regis", distance: "39 miles" },
        { name: "Hastings", distance: "50 miles" },
        { name: "Portsmouth", distance: "58 miles" },
        { name: "Southampton", distance: "70 miles" },
        { name: "Bournemouth", distance: "85 miles" },
        { name: "Chichester", distance: "40 miles" }
      ],
      all: [
        { name: "London", distance: "25 miles" },
        { name: "Brighton", distance: "28 miles" },
        { name: "Crawley", distance: "3 miles" },
        { name: "Horsham", distance: "15 miles" },
        { name: "Guildford", distance: "22 miles" },
        { name: "Worthing", distance: "35 miles" },
        { name: "Tunbridge Wells", distance: "24 miles" },
        { name: "Eastbourne", distance: "42 miles" },
        { name: "Reading", distance: "42 miles" },
        { name: "Oxford", distance: "62 miles" },
        { name: "Southampton", distance: "70 miles" },
        { name: "Portsmouth", distance: "58 miles" },
        { name: "Chichester", distance: "40 miles" },
        { name: "Winchester", distance: "54 miles" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_tabs = resolveComponent("el-tabs");
      const _component_el_tab_pane = resolveComponent("el-tab-pane");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-9f8672fd><section class="bg-amber-50 py-12" data-v-9f8672fd><div class="container mx-auto px-4 text-center" data-v-9f8672fd><h1 class="text-3xl font-bold mb-4" data-v-9f8672fd>Book Wheel Chair Taxis from and to Gatwick</h1><p class="max-w-3xl mx-auto text-gray-700 mb-8" data-v-9f8672fd> Reliable wheelchair taxi service at Gatwick Airport by City Cars. Accessible and comfortable transportation options tailored to your needs, ensuring a smooth journey to and from the airport. </p><div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto" data-v-9f8672fd>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div></div><div class="container mx-auto px-4 mt-8" data-v-9f8672fd><div class="relative" data-v-9f8672fd><div class="flex justify-between" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_0)} alt="Taxi pickup" class="w-64 h-auto" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_1)} alt="Taxi dropoff" class="w-64 h-auto" data-v-9f8672fd></div><div class="absolute inset-x-0 bottom-0 h-2 bg-brown-300" data-v-9f8672fd></div></div></div></section><section class="py-16 bg-white" data-v-9f8672fd><div class="container mx-auto px-4" data-v-9f8672fd><h2 class="text-3xl font-bold text-center mb-16" data-v-9f8672fd>Why ride with City Cars?</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-12" data-v-9f8672fd><div class="text-center" data-v-9f8672fd><div class="flex justify-center mb-6" data-v-9f8672fd><div class="rounded-full bg-amber-200 p-6 inline-block" data-v-9f8672fd><span class="text-amber-500 text-5xl font-bold" data-v-9f8672fd>\xA3</span></div></div><h3 class="text-2xl font-bold mb-4" data-v-9f8672fd>Cheaper Prices</h3><p class="text-gray-700" data-v-9f8672fd> Our taxi services offer competitive pricing, ensuring great value for your money. Enjoy a comfortable ride at affordable rates, perfect for both short trips and long journeys. </p></div><div class="text-center" data-v-9f8672fd><div class="flex justify-center mb-6" data-v-9f8672fd><div class="rounded-full bg-amber-200 p-6 inline-block" data-v-9f8672fd><span class="text-amber-500 text-2xl font-bold" data-v-9f8672fd>BOOK</span></div></div><h3 class="text-2xl font-bold mb-4" data-v-9f8672fd>Easy Online Booking</h3><p class="text-gray-700" data-v-9f8672fd> Booking your taxi with us is simple and convenient. With our user-friendly online platform, you can schedule your ride in just a few clicks. Plus, you&#39;ll receive instant confirmation and can easily track your driver&#39;s arrival. </p></div></div></div></section><section class="py-16 bg-gray-50" data-v-9f8672fd><div class="container mx-auto px-4" data-v-9f8672fd><h2 class="text-3xl font-bold text-center mb-12 font-lexend" data-v-9f8672fd>Our Fleet: Types of Cabs Available</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-v-9f8672fd><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_2)} alt="Saloon Car" class="h-32 w-auto mx-auto mb-4" data-v-9f8672fd><h3 class="text-xl font-semibold font-lexend" data-v-9f8672fd>Saloon</h3></div><p class="text-gray-600 font-inter" data-v-9f8672fd> Our standard saloon cars comfortably seat up to 4 passengers with 2 medium suitcases. Perfect for individuals, couples, or small groups traveling with moderate luggage. </p><div class="mt-4 text-sm text-gray-500 font-inter" data-v-9f8672fd><p data-v-9f8672fd>\u2022 Up to 4 passengers</p><p data-v-9f8672fd>\u2022 2 medium suitcases</p><p data-v-9f8672fd>\u2022 Ideal for city transfers</p></div></div><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_3)} alt="Estate Car" class="h-32 w-auto mx-auto mb-4" data-v-9f8672fd><h3 class="text-xl font-semibold font-lexend" data-v-9f8672fd>Estate</h3></div><p class="text-gray-600 font-inter" data-v-9f8672fd> Our estate cars offer extra luggage space while still seating up to 4 passengers comfortably. Ideal for airport transfers with additional luggage requirements. </p><div class="mt-4 text-sm text-gray-500 font-inter" data-v-9f8672fd><p data-v-9f8672fd>\u2022 Up to 4 passengers</p><p data-v-9f8672fd>\u2022 3-4 large suitcases</p><p data-v-9f8672fd>\u2022 Perfect for airport transfers</p></div></div><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_4)} alt="MPV" class="h-32 w-auto mx-auto mb-4" data-v-9f8672fd><h3 class="text-xl font-semibold font-lexend" data-v-9f8672fd>MPV</h3></div><p class="text-gray-600 font-inter" data-v-9f8672fd> Multi-Purpose Vehicles offer more space for both passengers and luggage, seating up to 6 people. Ideal for families or small groups traveling together. </p><div class="mt-4 text-sm text-gray-500 font-inter" data-v-9f8672fd><p data-v-9f8672fd>\u2022 Up to 6 passengers</p><p data-v-9f8672fd>\u2022 4 large suitcases</p><p data-v-9f8672fd>\u2022 Great for family travel</p></div></div><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_5)} alt="7 Seater" class="h-32 w-auto mx-auto mb-4" data-v-9f8672fd><h3 class="text-xl font-semibold font-lexend" data-v-9f8672fd>7 Seater</h3></div><p class="text-gray-600 font-inter" data-v-9f8672fd> Our 7-seater vehicles provide ample space for larger groups or families with plenty of luggage. Comfortable seating with extra legroom for all passengers. </p><div class="mt-4 text-sm text-gray-500 font-inter" data-v-9f8672fd><p data-v-9f8672fd>\u2022 Up to 7 passengers</p><p data-v-9f8672fd>\u2022 5 large suitcases</p><p data-v-9f8672fd>\u2022 Ideal for larger groups</p></div></div><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_6)} alt="9 Seater" class="h-32 w-auto mx-auto mb-4" data-v-9f8672fd><h3 class="text-xl font-semibold font-lexend" data-v-9f8672fd>9 Seater</h3></div><p class="text-gray-600 font-inter" data-v-9f8672fd> Our largest passenger vehicles, these minibuses can accommodate up to 9 passengers with luggage. Perfect for large groups, airport transfers, or corporate events. </p><div class="mt-4 text-sm text-gray-500 font-inter" data-v-9f8672fd><p data-v-9f8672fd>\u2022 Up to 9 passengers</p><p data-v-9f8672fd>\u2022 7 large suitcases</p><p data-v-9f8672fd>\u2022 Best for large groups</p></div></div><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_6)} alt="Wheelchair Accessible Vehicle" class="h-32 w-auto mx-auto mb-4" data-v-9f8672fd><h3 class="text-xl font-semibold font-lexend" data-v-9f8672fd>Wheelchair Accessible</h3></div><p class="text-gray-600 font-inter" data-v-9f8672fd> Specially modified vehicles equipped with ramps or lifts for wheelchair access. Our drivers are trained to provide assistance for comfortable and dignified travel. </p><div class="mt-4 text-sm text-gray-500 font-inter" data-v-9f8672fd><p data-v-9f8672fd>\u2022 Wheelchair accessibility</p><p data-v-9f8672fd>\u2022 Additional passenger seating</p><p data-v-9f8672fd>\u2022 Secure wheelchair restraints</p></div><div class="mt-4 text-center" data-v-9f8672fd><a href="/wheel-chair-taxis" class="text-amber-500 hover:underline font-inter font-medium" data-v-9f8672fd>Learn more about our wheelchair taxis \u2192</a></div></div></div></div></section><section class="py-16 bg-white" data-v-9f8672fd><div class="container mx-auto px-4" data-v-9f8672fd><div class="flex flex-col md:flex-row items-center" data-v-9f8672fd><div class="md:w-1/2 mb-8 md:mb-0" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_7)} alt="City Cars Mobile App" class="max-w-xs mx-auto" data-v-9f8672fd></div><div class="md:w-1/2" data-v-9f8672fd><h2 class="text-3xl font-bold mb-6 font-lexend" data-v-9f8672fd>Download Our Mobile App</h2><p class="text-gray-600 mb-6 font-inter" data-v-9f8672fd> Booking your taxi is now easier than ever with our new mobile app. Get all the convenience of our online booking system right in your pocket, plus exclusive mobile-only features and discounts. </p><div class="space-y-4 mb-8" data-v-9f8672fd><div class="flex items-start" data-v-9f8672fd><div class="bg-amber-100 p-2 rounded-full mr-3 mt-1" data-v-9f8672fd><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" data-v-9f8672fd><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-9f8672fd></path></svg></div><div data-v-9f8672fd><h3 class="text-lg font-semibold font-lexend" data-v-9f8672fd>Quick Booking</h3><p class="text-gray-600 font-inter" data-v-9f8672fd>Book your taxi in seconds with saved addresses and preferences.</p></div></div><div class="flex items-start" data-v-9f8672fd><div class="bg-amber-100 p-2 rounded-full mr-3 mt-1" data-v-9f8672fd><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" data-v-9f8672fd><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-9f8672fd></path></svg></div><div data-v-9f8672fd><h3 class="text-lg font-semibold font-lexend" data-v-9f8672fd>Real-Time Tracking</h3><p class="text-gray-600 font-inter" data-v-9f8672fd>Track your driver&#39;s arrival in real-time on the map.</p></div></div><div class="flex items-start" data-v-9f8672fd><div class="bg-amber-100 p-2 rounded-full mr-3 mt-1" data-v-9f8672fd><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" data-v-9f8672fd><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-9f8672fd></path></svg></div><div data-v-9f8672fd><h3 class="text-lg font-semibold font-lexend" data-v-9f8672fd>Exclusive Discounts</h3><p class="text-gray-600 font-inter" data-v-9f8672fd>Access mobile-only promotions and loyalty rewards.</p></div></div></div><div class="flex flex-wrap gap-4" data-v-9f8672fd><a href="#" class="inline-block" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_8)} alt="Download on App Store" class="h-12" data-v-9f8672fd></a><a href="#" class="inline-block" data-v-9f8672fd><img${ssrRenderAttr("src", _imports_9)} alt="Get it on Google Play" class="h-12" data-v-9f8672fd></a></div></div></div></div></section><section class="py-16 bg-gray-50" data-v-9f8672fd><div class="container mx-auto px-4" data-v-9f8672fd><h2 class="text-3xl font-bold text-center mb-8 font-lexend" data-v-9f8672fd>Cities &amp; Towns We Cover from Gatwick</h2><p class="text-gray-600 text-center max-w-3xl mx-auto mb-12 font-inter" data-v-9f8672fd> City Cars provides reliable taxi services to and from all major cities and towns within 100 miles of Gatwick Airport. Our drivers know the best routes to get you to your destination quickly and safely. </p><div class="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto" data-v-9f8672fd><div class="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-full flex items-center justify-center" data-v-9f8672fd><div class="relative w-full h-80 md:h-96 bg-blue-50 rounded-lg overflow-hidden" data-v-9f8672fd><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79890.36844211896!2d-0.2233267442627485!3d51.15273903123274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875efde7d1f391b%3A0x59dda4c5c3c7b4ee!2sGatwick%20Airport!5e0!3m2!1sen!2suk!4v1652345678901!5m2!1sen!2suk" width="100%" height="100%" style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="w-full h-full object-cover" title="Map showing Gatwick Airport location" data-v-9f8672fd></iframe></div></div><div class="lg:col-span-4 bg-white rounded-lg shadow-md p-6" data-v-9f8672fd>`);
      _push(ssrRenderComponent(_component_el_tabs, {
        modelValue: activeTab.value,
        "onUpdate:modelValue": ($event) => activeTab.value = $event,
        class: "mb-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_tab_pane, {
              label: "Popular Destinations",
              name: "popular"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_tab_pane, {
              label: "London Areas",
              name: "london"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_tab_pane, {
              label: "Southern Coast",
              name: "coast"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_tab_pane, {
              label: "All Destinations",
              name: "all"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_tab_pane, {
                label: "Popular Destinations",
                name: "popular"
              }),
              createVNode(_component_el_tab_pane, {
                label: "London Areas",
                name: "london"
              }),
              createVNode(_component_el_tab_pane, {
                label: "Southern Coast",
                name: "coast"
              }),
              createVNode(_component_el_tab_pane, {
                label: "All Destinations",
                name: "all"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2" data-v-9f8672fd><!--[-->`);
      ssrRenderList(cityDestinations.value[activeTab.value], (city) => {
        _push(`<div class="p-2 flex items-center space-x-2 hover:bg-amber-50 rounded-md transition-colors group" data-v-9f8672fd><div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 group-hover:bg-amber-200" data-v-9f8672fd><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" data-v-9f8672fd><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" data-v-9f8672fd></path></svg></div><span class="font-inter text-gray-700 group-hover:text-amber-700" data-v-9f8672fd>${ssrInterpolate(city.name)}</span><span class="text-xs text-gray-400 ml-auto font-inter" data-v-9f8672fd>${ssrInterpolate(city.distance)}</span></div>`);
      });
      _push(`<!--]--></div><div class="mt-6 text-center" data-v-9f8672fd><button class="inline-flex items-center font-medium text-amber-500 hover:text-amber-600 font-inter" data-v-9f8672fd> See all destinations <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor" data-v-9f8672fd><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" data-v-9f8672fd></path></svg></button></div></div></div><div class="mt-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-8 max-w-5xl mx-auto" data-v-9f8672fd><div class="flex flex-col md:flex-row items-center justify-between" data-v-9f8672fd><div class="mb-6 md:mb-0 md:mr-6" data-v-9f8672fd><h3 class="text-white text-2xl font-bold mb-2 font-lexend" data-v-9f8672fd>Need a custom destination?</h3><p class="text-amber-100 font-inter" data-v-9f8672fd> If you don&#39;t see your destination listed, don&#39;t worry! We cover many more locations. Contact us for a custom quote to any destination within 100 miles of Gatwick Airport. </p></div><div class="flex-shrink-0" data-v-9f8672fd><a href="/contact-us" class="inline-block bg-white text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-md font-semibold font-lexend transition-colors shadow-md" data-v-9f8672fd> Get Your Quote </a></div></div></div></div></section><section class="py-16 bg-blue-50" data-v-9f8672fd><div class="container mx-auto px-4" data-v-9f8672fd><h2 class="text-3xl font-bold text-center mb-8 font-lexend text-blue-900" data-v-9f8672fd>Price Guide for Gatwick Airport</h2><p class="text-gray-600 text-center max-w-3xl mx-auto mb-10 font-inter" data-v-9f8672fd> Check our competitive pricing for popular destinations to and from Gatwick Airport. All prices shown are starting prices for a standard saloon car with up to 4 passengers. </p><div class="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg" data-v-9f8672fd><div class="grid grid-cols-3 bg-blue-100 p-4 font-semibold text-blue-900 font-lexend" data-v-9f8672fd><div class="col-span-1 px-4" data-v-9f8672fd>From</div><div class="col-span-1 px-4" data-v-9f8672fd>To</div><div class="col-span-1 px-4 text-right" data-v-9f8672fd>Prices from</div></div><div class="divide-y divide-gray-200" data-v-9f8672fd><div class="grid grid-cols-3 p-4 hover:bg-gray-50" data-v-9f8672fd><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Gatwick Airport</div><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Piccadilly Circus</div><div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900" data-v-9f8672fd>\xA389</div></div><div class="grid grid-cols-3 p-4 hover:bg-gray-50" data-v-9f8672fd><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Gatwick Airport</div><div class="col-span-1 px-4 font-inter" data-v-9f8672fd><span class="text-blue-600 font-medium" data-v-9f8672fd>Liverpool</span> Street rail station </div><div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900" data-v-9f8672fd>\xA384</div></div><div class="grid grid-cols-3 p-4 hover:bg-gray-50" data-v-9f8672fd><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Gatwick Airport</div><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Brighton</div><div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900" data-v-9f8672fd>\xA374</div></div><div class="grid grid-cols-3 p-4 hover:bg-gray-50" data-v-9f8672fd><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Heathrow Airport</div><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Gatwick Airport</div><div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900" data-v-9f8672fd>\xA389</div></div><div class="grid grid-cols-3 p-4 hover:bg-gray-50" data-v-9f8672fd><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Notting Hill</div><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Gatwick Airport</div><div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900" data-v-9f8672fd>\xA386</div></div><div class="grid grid-cols-3 p-4 hover:bg-gray-50" data-v-9f8672fd><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Sevenoaks</div><div class="col-span-1 px-4 font-inter" data-v-9f8672fd>Gatwick Airport</div><div class="col-span-1 px-4 text-right font-semibold font-lexend text-blue-900" data-v-9f8672fd>\xA380</div></div></div><div class="bg-gray-50 p-4 text-center text-sm text-gray-500 font-inter italic" data-v-9f8672fd> Price last updated on 1st March 2025, average taken between January 2025 and February 2025 </div></div><div class="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8" data-v-9f8672fd><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><div class="inline-block bg-blue-100 rounded-full p-3" data-v-9f8672fd><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-9f8672fd><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-9f8672fd></path></svg></div><h3 class="text-xl font-semibold mt-3 font-lexend" data-v-9f8672fd>No Hidden Fees</h3></div><p class="text-gray-600 text-center font-inter" data-v-9f8672fd> Our prices include all taxes, waiting time at airports, and flight monitoring. No surprises when you reach your destination. </p></div><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><div class="inline-block bg-blue-100 rounded-full p-3" data-v-9f8672fd><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-9f8672fd><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-9f8672fd></path></svg></div><h3 class="text-xl font-semibold mt-3 font-lexend" data-v-9f8672fd>Fixed Pricing</h3></div><p class="text-gray-600 text-center font-inter" data-v-9f8672fd> All our journeys come with fixed prices, regardless of traffic conditions or time of day. The price you see is the price you pay. </p></div><div class="bg-white rounded-lg p-6 shadow-md" data-v-9f8672fd><div class="text-center mb-4" data-v-9f8672fd><div class="inline-block bg-blue-100 rounded-full p-3" data-v-9f8672fd><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-9f8672fd><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" data-v-9f8672fd></path></svg></div><h3 class="text-xl font-semibold mt-3 font-lexend" data-v-9f8672fd>Instant Quote</h3></div><p class="text-gray-600 text-center font-inter" data-v-9f8672fd> Get an instant price quote for your specific journey using our online booking form at the top of this page. No commitment required. </p></div></div><div class="text-center mt-10" data-v-9f8672fd><button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold font-lexend transition-colors" data-v-9f8672fd> Get Your Custom Quote Now </button></div></div></section><section class="py-16 bg-white" data-v-9f8672fd><div class="container mx-auto px-4" data-v-9f8672fd><h2 class="text-3xl font-bold text-center mb-12 font-lexend" data-v-9f8672fd>Frequently Asked Questions</h2><div class="max-w-4xl mx-auto" data-v-9f8672fd><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-9f8672fd><div class="space-y-6" data-v-9f8672fd><div class="bg-gray-50 rounded-lg p-6 shadow-sm" data-v-9f8672fd><h3 class="text-lg font-semibold mb-3 font-lexend" data-v-9f8672fd>How do I book a taxi from Gatwick?</h3><p class="text-gray-600 font-inter" data-v-9f8672fd> You can book a taxi through our website, mobile app, or by calling our 24/7 booking line. We recommend booking in advance to ensure availability, especially during peak travel times. </p></div><div class="bg-gray-50 rounded-lg p-6 shadow-sm" data-v-9f8672fd><h3 class="text-lg font-semibold mb-3 font-lexend" data-v-9f8672fd>What happens if my flight is delayed?</h3><p class="text-gray-600 font-inter" data-v-9f8672fd> Don&#39;t worry! We monitor all flight arrivals in real-time. Your driver will adjust their schedule based on your actual arrival time, and there&#39;s no extra charge for flight delays. </p></div><div class="bg-gray-50 rounded-lg p-6 shadow-sm" data-v-9f8672fd><h3 class="text-lg font-semibold mb-3 font-lexend" data-v-9f8672fd>Do I need to pay in advance?</h3><p class="text-gray-600 font-inter" data-v-9f8672fd> For most bookings, you can pay the driver directly at the end of your journey using cash or card. However, advance payment is required for certain long-distance journeys or special vehicle types. </p></div></div><div class="space-y-6" data-v-9f8672fd><div class="bg-gray-50 rounded-lg p-6 shadow-sm" data-v-9f8672fd><h3 class="text-lg font-semibold mb-3 font-lexend" data-v-9f8672fd>How do I know which type of taxi I need?</h3><p class="text-gray-600 font-inter" data-v-9f8672fd> Choose based on your group size and luggage requirements. For help deciding, you can contact our customer service team who will recommend the best vehicle type for your specific needs. </p></div><div class="bg-gray-50 rounded-lg p-6 shadow-sm" data-v-9f8672fd><h3 class="text-lg font-semibold mb-3 font-lexend" data-v-9f8672fd>Are your vehicles wheelchair accessible?</h3><p class="text-gray-600 font-inter" data-v-9f8672fd> Yes, we have specially modified vehicles for wheelchair users. Please specify your requirements when booking, and check our <a href="/wheel-chair-taxis" class="text-amber-500 hover:underline" data-v-9f8672fd>Wheelchair Taxis</a> page for more information. </p></div><div class="bg-gray-50 rounded-lg p-6 shadow-sm" data-v-9f8672fd><h3 class="text-lg font-semibold mb-3 font-lexend" data-v-9f8672fd>Do you provide child seats?</h3><p class="text-gray-600 font-inter" data-v-9f8672fd> Yes, we can provide child seats upon request. Please let us know the ages of children traveling when making your booking so we can arrange appropriate seating. </p></div></div></div><div class="text-center mt-10" data-v-9f8672fd><a href="/contact-us#faq" class="inline-block text-amber-500 font-medium hover:underline font-inter" data-v-9f8672fd> View more frequently asked questions \u2192 </a></div></div></div></section><section class="py-12 bg-amber-100" data-v-9f8672fd><div class="container mx-auto px-4 text-center" data-v-9f8672fd><h2 class="text-2xl font-bold mb-6 font-lexend" data-v-9f8672fd>Ready to Book Your Taxi?</h2><p class="text-gray-700 mb-8 max-w-3xl mx-auto font-inter" data-v-9f8672fd> Book your taxi now for reliable, comfortable, and affordable transportation from Gatwick Airport. Our professional drivers and well-maintained vehicles ensure a pleasant journey every time. </p><div class="flex flex-wrap justify-center gap-4" data-v-9f8672fd><button class="bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-md font-semibold font-lexend" data-v-9f8672fd> Book Now </button><a href="/contact-us" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold font-lexend" data-v-9f8672fd> Contact Us </a></div></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9f8672fd"]]);

export { index as default };
//# sourceMappingURL=index-D3JoEMFH.mjs.map
