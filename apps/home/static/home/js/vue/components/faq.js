export const Faq = Vue.component('faq', {
  template: '#vue-faq-template',
  delimiters: ['[[', ']]'],
  data() {
    return {

      faqList: [
        {
          id: 1,
          active: false,
          title: "Why are flights the cheapest on FlyLine?",
          details: `
            Simply put, we don’t markup the wholesale rates we source from the airlines.
          `
        },
        {
          id: 2,
          active: false,
          title: "Why do I need a membership to purchase a flight on FlyLine?",
          details: `
            Membership revenue enables us to pass along really low wholesale airfare pricing to our members
          `
        },
        {
          id: 3,
          active: false,
          title: "What is FlyLine’s flight purchase refund policy?",
          details: `
            Members have 24 hours to cancel their booking to receive a full refund.
          `
        },
        {
          id: 4,
          active: false,
          title: "What is virtual interlining?",
          details: `
            Interlining, also known as interline ticketing and interline booking, is a voluntary commercial agreement between individual airlines to handle passengers traveling on itineraries that require multiple flights on multiple airlines. At FlyLine, we handle this process virtually for members so that the booking process is seamless and easy.
          `
        },
        {
          id: 5,
          active: false,
          title: "Do flight prices include taxes & fees?",
          details: `
            Yes, flight purchase prices include all taxes and fees.
          `
        },
        {
          id: 6,
          active: false,
          title: "Do flight prices include baggage fees?",
          details: `
            No, checked baggage can be an additional cost depending on the airline, the frequent flyer status of the flyer, and the class of ticket purchased.
          `
        },
        {
          id: 7,
          active: false,
          title: "Can I book a flight for me and my child?",
          details: `
            When searching for flights on FlyLine, you can select the number of children and infant passengers via the traveler drop-down menu. Then book the selected flight for you and your child passenger.
          `
        },
        {
          id: 8,
          active: false,
          title: "Can I book a flight for another person?",
          details: `
            Any paid member or companion can purchase a flight and add as many people to their reservation as necessary, as long as they are listed on the reservation as well.
          `
        },
        {
          id: 9,
          active: false,
          title: "What is a companion account?",
          details: `
            A companion account is an invite-only account that is prompted by a paying member. This feature is limited to Basic Plus and Pro members, whom are allowed to designate a companion (friend, family member, coworker) that they want to associate with their account. The companion is given membership status for as long as the paid member has a valid membership and has maintained the companion status of the companion. Companions have full membership booking capabilities and can book with or without the presence of paid members on their flight itineraries. Paid members are can change the designation of their companion account up to two times each 12-month period.
          `
        },
        {
          id: 10,
          active: false,
          title: "How do I cancel my subscription?",
          details: `
            Please email support@joinflyline.com to cancel
          `
        }
      ],

      faqList2: [
        {
          id: 1,
          active: false,
          title: "Check in online",
          details: `
          Want to save yourself time to the airport? Or maybe even save some cash on your checked bags? You can check it online 24-47 hours
          before take-off-depending on your airline. After checking in, follow the prompts to get your boarding pass. You may be able to print
          it, save or send it to your phone, or pick it up at a kiosk at the airport
          `
        },
        {
          id: 2,
          active: false,
          title: "Check in at the airport",
          details: `
            Want to snag your boarding pass in person? Airline’s generally open their check-in desks 2-3 hours before a flight. You may even be able to check in on your own at a check-in kiosk.If you go the airport check-in route, you’ll need a couple of things: 1.Valid government-issued photo ID 2.Flight info (like your airline confirmation code)
          `
        },
        {
          id: 3,
          active: false,
          title: "Travel Tips",
          details: `
            To make sure you make it to your gate on time, get to the airport early. Aim for at least 1-2 hours before take-off for domestic flights and 2-3 hours for international flights. If you’re checking bags, flying out of a major airport, or traveling at a busy time (say, on a holiday), plan to get to the airport even earlier than you normally would. You’ll need your boarding pass and a government-issued photo ID to go through airport security. Curious if you need anything else? Contact your airline to find out more.
          `
        },
        {
          id: 4,
          active: false,
          title: "Good to Know",
          details: `
            To review your flight schedule and other trip details, take look at your itinerary. If you want to add passport info to your profile, you can do that in your user account.
          `
        }
      ],
      faqList3: [
        {
          id: 1,
          active: false,
          title: "Before you cancel",
          details: `
            Be sure to review the Airline rules + restrictions in your itinerary to see what the airline will let you do and what fees they charge for flight cancellations.
          `
        },
        {
          id: 2,
          active: false,
          title: "Full-service airlines",
          details: `
            If you booked: In the last 24 hours: Some airlines will let you cancel your flight for free. Not sure this applies to you? Check the Airline rules + restrictions in your itinerary for details. More than 24 hours ago: Airline cancellation fees come into play at this point. See the Airline rules + restrictions in your itinerary for more info. Non-refundable fares: You won’t get a refund if you cancel, but you might get an airline credit to use later. If you do get a credit, be sure to read up on how to book a flight with an airline credit.
          `
        },
        {
          id: 3,
          active: false,
          title: "How to cancel your flight",
          details: `
            Go to My Trips, Select Cancel Flight and follow the instruction, And you’re done!
          `
        },
        {
          id: 4,
          active: false,
          title: "Low-cost airlines",
          details: `
            Low-cost airlines, like Frontier and Spirit, like to handle their own changes and cancellations. But we can help you get in touch. We’ve got a list ofairline phone numbers right here. Roundtrip flights with 2 one-way faresBecause each ticket is considered separate, be sure to cancel each of your one-way flights individually. For more info, readRoundtrip flights with 2 one-way fares.If one of your flights is with alow-cost airline, like Frontier or Spirit, you’ll need to contact the airline to cancel that flight. (They like to do that part on their end.) You can cancel your other flight with us.
          `
        },
      ],
      faqList4: [
        {
          id: 1,
          active: false,
          title: "Low-cost airlines",
          details: `
            If you booked with alow-cost airline, like Frontier or Spirit, you’ll need to contact the airline about anything schedule-change related. (They handle that bit on their end.) But we can help you get in touch. We’ve got airline phone numbers right here. If only one of your flights is with alow-cost airline, contact that airline to make any changes you need. Then, if you want to make any changes to the rest of your trip, you canget in touch with us.
          `
        },
        {
          id: 2,
          active: false,
          title: "Full-service airlines",
          details: `
            We’ll work with your airline to find you a flight comparable to your original one. After we find you a new flight, we’ll get in touch with details via email, text or app notification. If it’s urgent (say your flight’stoday, for example), we might also give you a call. When you get an email, text, or app notification from us, be sure to read the details carefully and follow any directions – which might include contacting us to confirm your flight changes. After we confirm the flight changes with you (if needed) and the airline approves them, we call it all final. And we’ll send you a new confirmation email with your revised itinerary.
          `
        },
        {
          id: 3,
          active: false,
          title: "Roundtrip flights with 2 one-way fares",
          details: `
            First, review all your flight details. Sometimes when you have a round trip flight with 2 one-way fares, one flight will be changed and the other will stay the same. So double check! If you make any changes to a flight that wasn’t impacted by the airline schedule change, you might have to pay an airline change fee – plus any fare difference – to do that.
          `
        },
        {
          id: 4,
          active: false,
          title: "If you made upgrades or additions to your original flight",
          details: `
            Contact your airline to make sure any upgrades or other services you added on (like a hot meal or a wheelchair onboard) carry over to your new flight. Keep in mind, after the airline schedule change is finalized, any additional updates you make are subject to the rules and restrictionsof your original ticket. For info on what you can change, what costs money, etc., read Change your flight.
          `
        },
        {
          id: 5,
          active: false,
          title: "To make changes to another part of your trip",
          details: `
            First, review all your flight details. Sometimes when you have a round trip flight with 2 one-way fares, one flight will be changed and the other will stay the same. So double check! If you make any changes to a flight that wasn’t impacted by the airline schedule change, you might have to pay an airline change fee – plus any fare difference – to do that.If you made upgrades or additions to your original flight contact your airline to make sure any upgrades or other services you added on (like a hot meal or a wheelchair onboard) carry over to your new flight. Keep in mind, after the airline schedule change is finalized, any additional updates you make are subject to the rules and restrictions of your original ticket.
          `
        },
      ],
      faqList5: [
        {
          id: 1,
          active: false,
          title: "Full-service airlines",
          details: `
            If you booked In the last 24 hours Some airlines let you cancel your flight for free. So you can book a new flight that works better for you and cancel your original. Basic Economy or Light fares The airline won't let you make changes. Not sure if you booked one of these fares? Check your confirmation email oritineraryfor details on your flight.
          `
        },
        {
          id: 2,
          active: false,
          title: "Low-cost airlines",
          details: `
            Low-cost airlines, like Frontier and Spirit, like to handle their own changes and cancellations. But we can help you get in touch. We've got lists of their websites and phone numbers right here.
          `
        },
        {
          id: 3,
          active: false,
          title: "Roundtrip flights with 2 one-way fares",
          details: `
            Changing your flight is a different story when you have 2 one-way tickets instead of a single roundtrip one. For more on this, checkout Roundtrip flights with 2 one-way fares. If one of your flights is with a low-cost airline, like Frontier or Spirit, you'll need to contact the airline to change that flight. (They like to do that part on their end.)
          `
        },
        {
          id: 4,
          active: false,
          title: "Same-day flight changes",
          details: `
            If you change your flight within 24 hours of when it's scheduled to leave, the airlines listed here might give you a lower change fee if you go through them. You can check their websites, or give them a call, for info: Alaska, American Airlines, Delta, JetBlue, United. Wondering why we can't offer you a lower change fee, too? Our hands are tied, unfortunately. The airlines require us to use the change fee as it's listed in the fine print on your ticket.
          `
        },
        {
          id: 5,
          active: false,
          title: "Ticket transfers",
          details: `
            We understand that plans change, and sometimes you can't make the trip. Unfortunately, airlines don't allow you to transfer your ticket to someone else. There's nothing we can do about that.
          `
        },
      ],
      faqList6: [
        {
          id: 1,
          active: false,
          title: "Allowances and fees",
          details: `
          The number, size, and weight of bags you can bring depends on your airline and fare type. Airlines may also charge fees for your checked bags, which vary depending on whether you pay for your bags on the airline's website or at the airport. (You may be able to save money by checking in and paying baggage fees online before your flight!)You can get the scoop on baggage fees and allowance while you're shopping for flights – just check the individual flight details and its rules and restrictions. And once you book, you can find all these details on your itinerary. This information is also in the airline's website.
          `
        },
        {
          id: 2,
          active: false,
          title: "Restrictions",
          details: `
            Stay in the know of what you can and can't bring along, both for your carry-on and checked bags. Check out both the Transportation Security Administration (TSA)'s list of Prohibited Items and your airline's own rules.
          `
        },
      ],
      faqList7: [
        {
          id: 1,
          active: false,
          title: "How to choose your seat",
          details: `
          For most flights, you can pay to reserve specific seats at the time of booking. Paid seats are guaranteed yours. If you don’t want to reserve seats, you can tell us your seating preference (like aisle seats) at the time of booking. And for most flights, you can also choose a specific seat. No cost here and also no guarantees. We’ll send your info to the airline – it’s in their hands from there. Didn’t reserve or choose a seat when booking? No worries. Please contact your airline directly for options. Airlines have special rules and won’t let us make such changes after booking.
          `
        },
        {
          id: 2,
          active: false,
          title: "How to change your seat",
          details: `
            Did you change your mind and want a different seat? It happens. In most cases, you can make changes directly on the airline’s website. Heads up, you’ll need your 6-digit confirmation code for this – you’ll find it in your itinerary. Ready to make seat changes? Choose your airline from this list and we’ll get you to their website for next steps.
          `
        },
        {
          id: 3,
          active: false,
          title: "How to check your seat assignment",
          details: `
          Your online itinerary has all your trip details, including seat assignments.
          If you don’t find any seat info in your itinerary, it’s probably because your airline assigns seats closer to check-in time or even at the gate. It’s a good idea to check back as you get closer to your departure. Or you may just have to wait until you get to the gate.
          `
        },
        {
          id: 4,
          active: false,
          title: "Still need help?",
          details: `
          If you still have questions about how your airline assigns seats and other such details, please contact your airline directly.
          `
        },
      ],
      faqList8: [
        {
          id: 1,
          active: false,
          title: "How to make a flight ticket name change",
          details: `
          If you need to change or fix the name on your ticket, send us a completed name correction form along with any relevant documentation as soon as you can. You'll see the documentation you need to send once you start filling out the form.
          Once we get your information, we’ll work with the airline and then get back to you with an update and any next steps within 48 hours.
          `
        },
        {
          id: 2,
          active: false,
          title: "Low-cost airlines",
          details: `
            Frontier or Spirit, like to handle making any corrections on their own. But we can help you get in touch -- here’s their list of websites and phone numbers.
          `
        },
      ],
      faqList9: [
        {
          id: 1,
          active: false,
          title: "What to do next",
          details: `
          Contact your airline to find out whether they can get you on standby for the next available flight, or what other options they can offer.
          `
        },
        {
          id: 2,
          active: false,
          title: "Refunds",
          details: `
            Refunds on missed flights are the discretion of the airline. The airline may give you a flight credit for a future booking instead of a refund.
          `
        },
      ],
      faqList10: [
        {
          id: 1,
          active: false,
          title: "Low Cost Airline Booking Help",
          details: `
          You chose to save some cash and book with alow-cost airline like Frontier, Spirit, Ryanair, Jetstar, AirAsia, or easyJet – smart move! We'd love to help you with your booking, but we don't have access to these airlines' systems. That means you'll need to talk to the airline directly.
          `
        },
      ],
    }
  }
});
