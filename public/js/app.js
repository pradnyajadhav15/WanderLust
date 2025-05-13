// Timeline for navbar and heading animations
let t1 = gsap.timeline();

t1.from(".gsap-navbar-icon, .gsap-nav-item", {
  y: -40,
  duration: 0.5,
  delay: 0.3,
  opacity: 0,
});

// Text and Image Content Animation (Hero Section)
t1.from(
  ".text-content",
  {
    y: 130,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  },
  "-=0.5"
);

t1.from(
  ".image-content",
  {
    y: 130,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  },
  "-=0.8"
);

//For caregories

gsap.from(".top-categories-heading", {
  y:50,
  opacity: 0,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".top-categories-heading",
    scroller: "body",
    start: "top 85%",
    end: "top 60%",
    scrub: true, 
    once: false, // Animation triggers again if user scrolls back
  },
});

let categories = gsap.utils.toArray(".category"); // Select all categories

gsap.set(categories, { opacity: 0, y: 100 }); // Set initial state (hidden, moved down)

gsap.to(categories, {
  y: 0, // Move to original position
  opacity: 1, // Make visible
  duration: 0.8,
  ease: "power2.out", // Smooth easing
  stagger: 0.2, // Cards animate one after another

  scrollTrigger: {
    trigger: ".categories-container",
    scroller: "body",
    start: "top 85%",
    end: "top 60%",
    scrub: true, // Smooth animation while scrolling
    once: false, // Animation triggers again if user scrolls back
  },
});

//Session 2

let t2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".services",
    scroller: "body",
    start: "top 85%",
    end: "top 60%",
    scrub: 0.5,
  },
});

t2.from(".services h1", {
  y: 80,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
});

t2.from(
  ".services p",
  {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  },
  "-=0.5"
);

// Animate Service Section Cards
gsap.utils.toArray(".service").forEach((service, index) => {
  gsap.from(service, {
    y: 100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: service,
      start: "top 85%",
      end: "top 50%",
      scroller: "body",
      scrub: 1.5,
    },
  });
});

//Session 3

gsap.registerPlugin(ScrollTrigger);

let proposalTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".proposal",
    start: "top 85%",
    end: "top 70%",
    scrub: 1,
  },
});

proposalTl
  .from(".proposal h1", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  })
  .from(
    ".proposal p",
    {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.5"
  ) // Overlapping effect for a smoother transition
  .from(
    ".proposal-btn",
    {
      scale: 0.8,
      opacity: 0,
      duration: 0.7,
      ease: "back.out(1.7)",
    },
    "-=0.5"
  ); // Overlapping effect for a natural feel

// Image Animation
gsap.from(".section3-main-img img", {
  scale: 0.2,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".section3-main-img",
    start: "top 90%",
    end: "top 75%",
    scrub: 1,
  },
});

// Case Study Title & Paragraph
gsap.from(".casestudy h1", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".casestudy",
    start: "top 85%",
    end: "top 70%",
    scrub: 1,
  },
});

gsap.from(".casestudy p", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  delay: 0.2,
  scrollTrigger: {
    trigger: ".casestudy",
    start: "top 85%",
    end: "top 70%",
    scrub: 1,
  },
});

let caseStudyCards = gsap.utils.toArray(".case-box");

caseStudyCards.forEach((card, index) => {
  gsap.from(card, {
    y: 100,
    opacity: 0,
    duration: 0.5,
    scrollTrigger: {
      trigger: card, // Each box animates when it enters viewport
      start: "top 90%",
      end: "top 80%",
      toggleActions: "play none none reset",
      scrub: true, // Smooth animation while scrolling
    },
  });
});


// login and signup
 gsap.from(".signup-main-div h1,.login-main-div h1", {
   opacity: 0,
   y: 80,
   scale: 0.6,
   duration: 1.2,
   ease: "power3.out",
 });

 gsap.from(".signup-form-div, .form-div", {
   opacity: 0,
   y: 190,
   duration: 1.2,
   scale: 0.8,
   ease: "power3.out",
   stagger: 0.2,
 });


 //create listing 

  gsap.from(".gsap-form", {
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: "power3.out",
  });



//all listings

gsap.from(".all-listings-heading",{
  x:-300,
  opacity:0,
  duration:0.7,
  delay:0.3
});

gsap.from(".search-container",{
  y:-50,
  opacity:0,
  duration:0.7,
  delay:0.3
});

gsap.from(".no-lisitng-found-para", {
  y: -80,
  opacity: 0,
  duration: 0.7,
  delay: 0.3,
});
gsap.from(".to-get-all-listings", {
  y: -50,
  opacity: 0,
  duration: 0.7,
  delay: 0.6,
});
gsap.from(".get-all-btn", {
  y: -10,
  opacity:0,
  delay:0.8,
  duration: 0.8,
});

let cards = gsap.utils.toArray(".listing-card");

function createRows() {
  let rows = [];
  let cardsPerRow = 4; // Default to 4 cards per row for large screens

  // Determine how many cards should be in each row based on screen size
  if (window.innerWidth < 768) {
    cardsPerRow = 1; // 1 card per row for small screens
  } else if (window.innerWidth < 992) {
    cardsPerRow = 2; // 2 cards per row for medium screens
  } else if (window.innerWidth < 1200) {
    cardsPerRow = 3; // 3 cards per row for large screens
  }

  // Group the cards into rows based on the calculated cards per row
  for (let i = 0; i < cards.length; i += cardsPerRow) {
    rows.push(cards.slice(i, i + cardsPerRow));
  }
  return rows;
}

function animateRow(row, timeline, delay = 0) {
  const numCards = row.length;

  if (numCards === 4) {
    timeline.from(row[0], { x: -200, opacity: 0, duration: 0.8 }, delay); // 1st card from left
    timeline.from(row[1], { y: 200, opacity: 0, duration: 0.8 }, delay); // 2nd card from bottom
    timeline.from(row[2], { y: 200, opacity: 0, duration: 0.8 }, delay); // 3rd card from right
    timeline.from(row[3], { x: 200, opacity: 0, duration: 0.8 }, delay); // 4th card from top
  } else if (numCards === 3) {
    timeline.from(row[0], { x: -200, opacity: 0, duration: 0.8 }, delay); // 1st card from left
    timeline.from(row[1], { y: 200, opacity: 0, duration: 0.8 }, delay); // 2nd card from bottom
    timeline.from(row[2], { x: 200, opacity: 0, duration: 0.8 }, delay); // 3rd card from right
  } else if (numCards === 2) {
    timeline.from(row[0], { x: -200, opacity: 0, duration: 0.8 }, delay); // 1st card from left
    timeline.from(row[1], { x: 200, opacity: 0, duration: 0.8 }, delay); // 2nd card from right
  } else {
    timeline.from(row[0], { y: 200, opacity: 0, duration: 0.8 }, delay); // Card from bottom
  }
}

// Create rows based on screen size (at page load)
let rows = createRows();

rows.slice(0, 2).forEach((row, index) => {
  animateRow(row, t1, index === 0 ? 0.5 : index * 0.7); // Slight delay between rows
});

rows.slice(2).forEach((row) => {
  let scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: row[0], // Use the first card in the row as the trigger
      start: "top 80%",
      end: "top 50%",
      scroller: "body",
      scrub: 1.5,
      // markers: true, // Optional for debugging
    },
  });
  animateRow(row, scrollTimeline);
});

// Recalculate rows when the window is resized (to handle responsiveness)

// window.addEventListener("resize", () => {
//   rows = createRows();

//   // Clear any existing animations and reapply them based on the new row setup

//   t1.kill();

//   t1 = gsap.timeline();

//   rows.slice(0, 2).forEach((row, index) => {
//     animateRow(row, t1, index === 0 ? 0.5 : index * 0.7); // Slight delay between rows
//   });

//   rows.slice(2).forEach((row) => {
//     let scrollTimeline = gsap.timeline({
//       scrollTrigger: {
//         trigger: row[0], // Use the first card in the row as the trigger
//         start: "top 80%",
//         end: "top 50%",
//         scroller: "body",
//         scrub: 1.5,
//         // markers: true, // Optional for debugging
//       },
//     });
//     animateRow(row, scrollTimeline);
//   });
// });



gsap.from(".individual-list-heading",{
  y:-80,
  opacity:0,
  duration:0.6,
  delay:0.3
});

gsap.from(".individual-list-card",{
  y:-100,
  opacity:0,
  duration:0.6,
  delay:0.5
});

gsap.from(".individual-list-card-details",{
  y:-50,
  opacity:0,
  duration:0.6,
  delay:0.7
});
gsap.from(".individual-list-img", {
  opacity: 0,
  scale: 0.6,
  duration: 1.2,
  ease: "power2.out",
});

 gsap.from(".owner-buttons", {
   opacity: 0,
   y: 50,
   duration: 1,
   ease: "power2.out",
   scrollTrigger: {
     trigger: ".owner-buttons",
     start: "top 80%",
     end: "top 70%",
     scrub: true,
     toggleActions: "play reverse play reverse",
   },
 });

  gsap.from("#map", {
    opacity: 0,
    y: 100,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#map",
      start: "top 85%", 
      end: "top 50%", 
      scrub: true, 
      toggleActions: "play reverse play reverse", 
    },
  });


     gsap.fromTo(
       ".animated-hr",
       { scaleX: 0, opacity: 0 }, // Start state
       {
         scaleX: 1,
         opacity: 1,
         duration: 1.5,
         ease: "power2.out",
         scrollTrigger: {
           trigger: ".animated-hr",
           start: "top 90%",
           end: "top 60%",
           scrub: true,
           toggleActions: "play reverse play reverse",
         },
       }
     );


     gsap.fromTo(
       ".animated-hr2",
       { scaleX: 0, opacity: 0 }, // Start state
       {
         scaleX: 1,
         opacity: 1,
         duration: 1.5,
         ease: "power2.out",
         scrollTrigger: {
           trigger: ".animated-hr2",
           start: "top 90%",
           end: "top 60%",
           scrub: true,
           toggleActions: "play reverse play reverse",
         },
       }
     );


      gsap.fromTo(
        ".review-heading",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".review-heading",
            start: "top 85%",
            end: "top 50%",
            scrub: true,
            toggleActions: "play reverse play reverse",
          },
        }
      );

      gsap.fromTo(
        ".review-card",
        { opacity: 0, y: 70 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".review-card",
            start: "top 85%",
            end: "top 50%",
            scrub: true,
            toggleActions: "play reverse play reverse",
          },
        }
      );


      gsap.from(".all-reviews-heading", {
        y: 70,
        opacity: 0,
        duration: 0.7,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".all-reviews-heading",
          start: "top 85%",
          end: "top 70%",
          scrub: true,
          toggleActions: "play reverse play reverse",
        },
      });


      
  let reviewCards = gsap.utils.toArray(".review-card");

  gsap.set(reviewCards, { opacity: 0, y: 100 });

  reviewCards.forEach((card, index) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: index * 0.2, 
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 75%",
        toggleActions: "play none none reset",
      },
    });
  });


  // Responsive adjustments for smaller screens
  gsap.matchMedia().add("(max-width: 768px)", () => {
    reviewCards.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: index * 0.3, 
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          end: "top 85%",
          toggleActions: "play none none reset",
        },
      });
    });
  });