import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

export default defineNuxtPlugin(() => {
  if (process.client) {
    // Expose CookieConsent to window for composable access
    (window as any).CookieConsent = CookieConsent;
    
    CookieConsent.run({
      // UK GDPR/PECR compliant configuration
      guiOptions: {
        consentModal: {
          layout: 'box inline',
          position: 'bottom right',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          flipButtons: false,
          equalWeightButtons: true
        }
      },
      categories: {
        necessary: {
          enabled: true, // Always enabled
          readOnly: true
        },
        analytics: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              {
                name: /^(_ga|_gid|_gat|_gcl_au|_gtag)/
              }
            ]
          }
        },
        marketing: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              {
                name: /^(_fbp|_fbc|fr|tr|_pin|_pinid|ads|advertising)/
              }
            ]
          }
        }
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description: 'We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience. By clicking "Accept all", you agree to our use of cookies. <a href="/privacy-policy" class="cc-link">Privacy Policy</a>',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences'
            },
            preferencesModal: {
              title: 'Cookie Preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Cookie Usage',
                  description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="/privacy-policy" class="cc-link">Privacy Policy</a>.'
                },
                {
                  title: 'Strictly Necessary Cookies',
                  description: 'These cookies are essential for the proper functioning of the website. Without these cookies, the website would not work properly.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Analytics Cookies',
                  description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                  caption: 'Analytics cookies',
                  headers: {
                    name: 'Cookie',
                    domain: 'Domain',
                    desc: 'Description'
                  },
                  body: [
                    {
                      name: '_ga',
                      domain: 'This website',
                      desc: 'Google Analytics - Used to distinguish users'
                    },
                    {
                      name: '_gid',
                      domain: 'This website',
                      desc: 'Google Analytics - Used to distinguish users'
                    },
                    {
                      name: '_gat',
                      domain: 'This website',
                      desc: 'Google Analytics - Used to throttle request rate'
                    }
                  ]
                }
                },
                {
                  title: 'Marketing Cookies',
                  description: 'These cookies are used to deliver personalized advertisements and track your activity across websites. They help us show you relevant ads and measure the effectiveness of our advertising campaigns.',
                  linkedCategory: 'marketing',
                  cookieTable: {
                    caption: 'Marketing cookies',
                    headers: {
                      name: 'Cookie',
                      domain: 'Domain',
                      desc: 'Description'
                    },
                    body: [
                      {
                        name: '_fbp',
                        domain: 'This website',
                        desc: 'Facebook Pixel - Used to track visitors across websites'
                      },
                      {
                        name: 'fr',
                        domain: 'This website',
                        desc: 'Facebook Pixel - Used to deliver relevant advertisements'
                      }
                    ]
                  }
                },
                {
                  title: 'More information',
                  description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="/contact-us">contact us</a>.'
                }
              ]
            }
          }
        }
      },
      // UK GDPR compliance settings
      onConsent: ({ cookie }) => {
        // This callback is called when consent is given or changed
        console.log('Cookie consent updated:', cookie);
      },
      onChange: ({ changedCategories, changedServices }) => {
        // This callback is called when user changes preferences
        console.log('Cookie preferences changed:', changedCategories, changedServices);
      },
      onModalReady: ({ modalName }) => {
        // This callback is called when the modal is ready
        console.log('Cookie consent modal ready:', modalName);
      },
      onModalShow: ({ modalName }) => {
        // This callback is called when the modal is shown
        console.log('Cookie consent modal shown:', modalName);
      },
      onModalHide: ({ modalName }) => {
        // This callback is called when the modal is hidden
        console.log('Cookie consent modal hidden:', modalName);
      }
    });
  }
});

