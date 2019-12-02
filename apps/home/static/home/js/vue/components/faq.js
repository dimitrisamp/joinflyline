export const Faq = Vue.component('faq', {
  template: '#vue-faq-template',
  delimiters: ['[[', ']]'],
  data() {
    return {
      faqList: [
        {
          id: 1,
          active: true,
          title: "Check in at the airport",
          details: `
            Want to save yourself time to the airport ? Or maybe even save some cash on your checked bags? You can check it online 24-47 hours
            before take-off-depending on your airline. After checking in, follow the prompts to get your boarding pass. You may be able to print
            it, save or send it to your phone, or pick it up at a kiosk at the airport  
          `
        },
        {
          id: 2,
          active: false,
          title: "Travel Tips",
          details: `
            Want to save yourself time to the airport ? Or maybe even save some cash on your checked bags? You can check it online 24-47 hours
            before take-off-depending on your airline. After checking in, follow the prompts to get your boarding pass. You may be able to print
            it, save or send it to your phone, or pick it up at a kiosk at the airport  
          `
        },
        {
          id: 3,
          active: false,
          title: "Good to know",
          details: `
            Want to save yourself time to the airport ? Or maybe even save some cash on your checked bags? You can check it online 24-47 hours
            before take-off-depending on your airline. After checking in, follow the prompts to get your boarding pass. You may be able to print
            it, save or send it to your phone, or pick it up at a kiosk at the airport  
          `
        }
      ],
      faqList2: [
        {
          id: 1,
          active: false,
          title: "Check in at the airport",
          details: `
            Want to save yourself time to the airport ? Or maybe even save some cash on your checked bags? You can check it online 24-47 hours
            before take-off-depending on your airline. After checking in, follow the prompts to get your boarding pass. You may be able to print
            it, save or send it to your phone, or pick it up at a kiosk at the airport  
          `
        },
        {
          id: 2,
          active: false,
          title: "Travel Tips",
          details: `
            Want to save yourself time to the airport ? Or maybe even save some cash on your checked bags? You can check it online 24-47 hours
            before take-off-depending on your airline. After checking in, follow the prompts to get your boarding pass. You may be able to print
            it, save or send it to your phone, or pick it up at a kiosk at the airport  
          `
        },
      ]
    }
  }
});
