document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: "ease",
    once: true,
    offset: 100,
  })

  // Loading screen
  const loadingScreen = document.querySelector(".loading-screen")

  setTimeout(() => {
    loadingScreen.classList.add("hidden")
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }, 2000)

  // Custom cursor removed as requested

  // Navigation
  const burger = document.querySelector(".burger")
  const nav = document.querySelector(".nav-links")
  const navLinks = document.querySelectorAll(".nav-links li")

  burger.addEventListener("click", () => {
    // Toggle Nav
    nav.classList.toggle("nav-active")

    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ""
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
      }
    })

    // Burger Animation
    burger.classList.toggle("toggle")
  })

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("nav-active")) {
        nav.classList.remove("nav-active")
        burger.classList.remove("toggle")

        navLinks.forEach((link) => {
          link.style.animation = ""
        })
      }
    })
  })

  // Active nav link on scroll
  const sections = document.querySelectorAll("section")
  const navItems = document.querySelectorAll(".nav-links a")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href").substring(1) === current) {
        item.classList.add("active")
      }
    })
  })

  // Scroll indicator
  const scrollIndicator = document.createElement("div")
  scrollIndicator.className = "scroll-indicator"
  document.body.appendChild(scrollIndicator)

  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100

    scrollIndicator.style.width = scrolled + "%"
  })

  // Parallax effect
  const parallaxElements = document.querySelectorAll(".about-img, .skill-category, .education-card, .timeline-content")

  window.addEventListener("scroll", () => {
    parallaxElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight

      if (elementTop < windowHeight && elementTop > -elementHeight) {
        const scrolled = (windowHeight - elementTop) / (windowHeight + elementHeight)
        const translateY = scrolled * 30 // Adjust this value for more/less movement

        element.style.transform = `translateY(${translateY}px)`
      }
    })
  })

  // Typewriter effect
  const typewriterText = document.querySelector(".typewriter-text")
  const roles = ["Video Editor", "Motion Designer", "Animator", "3D Artist"]
  let roleIndex = 0
  let charIndex = 0
  let isDeleting = false
  let typingSpeed = 100

  function type() {
    const currentRole = roles[roleIndex]

    if (isDeleting) {
      // Deleting text
      typewriterText.textContent = currentRole.substring(0, charIndex - 1)
      charIndex--
      typingSpeed = 50 // Faster when deleting
    } else {
      // Typing text
      typewriterText.textContent = currentRole.substring(0, charIndex + 1)
      charIndex++
      typingSpeed = 100 // Normal speed when typing
    }

    // If finished typing the current role
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = false
      typingSpeed = 1500 // Pause at the end of typing
      setTimeout(() => {
        isDeleting = true
      }, typingSpeed)
    }
    // If finished deleting the current role
    else if (isDeleting && charIndex === 0) {
      isDeleting = false
      roleIndex = (roleIndex + 1) % roles.length // Move to next role
      typingSpeed = 500 // Pause before typing next role
    }

    setTimeout(type, typingSpeed)
  }

  // Start the typewriter effect
  setTimeout(type, 1000)

  // Video preview hover effect
  const previewVideos = document.querySelectorAll(".preview-video")

  previewVideos.forEach((video) => {
    const videoContainer = video.parentElement

    videoContainer.addEventListener("mouseenter", () => {
      video.play()
    })

    videoContainer.addEventListener("mouseleave", () => {
      video.pause()
    })
  })

  // Video modal
  const videoContainers = document.querySelectorAll(".video-container")
  const videoModal = document.getElementById("video-modal")
  const projectVideo = document.getElementById("project-video")
  const videoTitle = document.getElementById("video-title")
  const closeModal = document.querySelector(".close-modal")

  videoContainers.forEach((container) => {
    container.addEventListener("click", () => {
      const videoSrc = container.getAttribute("data-video")
      const title = container.getAttribute("data-title")

      projectVideo.src = videoSrc
      videoTitle.textContent = title

      videoModal.style.display = "flex"

      // Make sure modal content is properly sized for mobile
      if (window.innerWidth <= 768) {
        document.querySelector(".modal-content").style.width = "95%"
      } else {
        document.querySelector(".modal-content").style.width = "80%"
      }

      projectVideo.load()
      projectVideo.play()
    })
  })

  closeModal.addEventListener("click", () => {
    videoModal.style.display = "none"
    projectVideo.pause()
  })

  // Close modal when clicking outside
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      videoModal.style.display = "none"
      projectVideo.pause()
    }
  })

  // Testimonial slider
  const testimonialSlides = document.querySelectorAll(".testimonial-slide")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.querySelector(".testimonial-prev")
  const nextBtn = document.querySelector(".testimonial-next")
  let currentSlide = 0

  function showSlide(n) {
    testimonialSlides.forEach((slide) => {
      slide.classList.remove("active")
    })

    dots.forEach((dot) => {
      dot.classList.remove("active")
    })

    testimonialSlides[n].classList.add("active")
    dots[n].classList.add("active")

    // Update prev and next slides
    updateTestimonialClasses()
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonialSlides.length
    updateTestimonialClasses()
    showSlide(currentSlide)
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length
    updateTestimonialClasses()
    showSlide(currentSlide)
  }

  nextBtn.addEventListener("click", nextSlide)
  prevBtn.addEventListener("click", prevSlide)

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index
      showSlide(currentSlide)
    })
  })

  // Auto-advance testimonials
  setInterval(nextSlide, 5000)

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Animate skill icons on scroll
  const skillIcons = document.querySelectorAll(".skill-icon")

  function animateSkillIcons() {
    skillIcons.forEach((icon) => {
      const iconTop = icon.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (iconTop < windowHeight - 100) {
        icon.style.animation = "pulse 2s infinite"
      } else {
        icon.style.animation = "none"
      }
    })
  }

  window.addEventListener("scroll", animateSkillIcons)

  // Animate progress bar on scroll
  const progressBars = document.querySelectorAll(".progress-fill")

  function animateProgressBars() {
    progressBars.forEach((bar) => {
      const barTop = bar.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (barTop < windowHeight - 100) {
        const width = bar.getAttribute("style").match(/width: (\d+)%/)[1]
        bar.style.width = "0%"
        setTimeout(() => {
          bar.style.width = width + "%"
        }, 100)
      }
    })
  }

  window.addEventListener("load", animateProgressBars)

  // Tilt effect for project cards - Modified to disable on mobile
  const projectShowcases = document.querySelectorAll(".project-showcase")

  // Function to check if device is mobile
  function isMobile() {
    return window.innerWidth <= 768
  }

  projectShowcases.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      // Only apply tilt effect if not on mobile
      if (!isMobile()) {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const tiltX = (y - centerY) / 20
        const tiltY = (centerX - x) / 20

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`
      }
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)"
    })
  })

  // Scroll to top button
  const scrollTopBtn = document.createElement("button")
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollTopBtn.className = "scroll-top-btn"
  scrollTopBtn.style.position = "fixed"
  scrollTopBtn.style.bottom = "20px"
  scrollTopBtn.style.right = "20px"
  scrollTopBtn.style.width = "50px"
  scrollTopBtn.style.height = "50px"
  scrollTopBtn.style.borderRadius = "50%"
  scrollTopBtn.style.backgroundColor = "var(--primary-color)"
  scrollTopBtn.style.color = "white"
  scrollTopBtn.style.border = "none"
  scrollTopBtn.style.fontSize = "1.2rem"
  scrollTopBtn.style.cursor = "pointer"
  scrollTopBtn.style.display = "none"
  scrollTopBtn.style.zIndex = "999"
  scrollTopBtn.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)"
  scrollTopBtn.style.transition = "all 0.3s ease"

  document.body.appendChild(scrollTopBtn)

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.display = "block"
      scrollTopBtn.style.opacity = "1"
    } else {
      scrollTopBtn.style.opacity = "0"
      setTimeout(() => {
        if (window.pageYOffset <= 300) {
          scrollTopBtn.style.display = "none"
        }
      }, 300)
    }
  })

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Hover effect for scroll top button
  scrollTopBtn.addEventListener("mouseenter", () => {
    scrollTopBtn.style.transform = "translateY(-5px)"
    scrollTopBtn.style.backgroundColor = "var(--primary-dark)"
  })

  scrollTopBtn.addEventListener("mouseleave", () => {
    scrollTopBtn.style.transform = "translateY(0)"
    scrollTopBtn.style.backgroundColor = "var(--primary-color)"
  })

  // Add this code after the existing testimonial slider code
  function updateTestimonialClasses() {
    testimonialSlides.forEach((slide, index) => {
      slide.classList.remove("active", "prev", "next")

      if (index === currentSlide) {
        slide.classList.add("active")
      } else if (index === (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length) {
        slide.classList.add("prev")
      } else if (index === (currentSlide + 1) % testimonialSlides.length) {
        slide.classList.add("next")
      }
    })
  }

  // Initialize the testimonial classes
  updateTestimonialClasses()

  // Add mouse move effect for education cards
  const educationCards = document.querySelectorAll(".education-card")

  educationCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const tiltX = (y - centerY) / 20
      const tiltY = (centerX - x) / 20

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)"
    })
  })

  // Add interactive progress bar animation
  const progressFills = document.querySelectorAll(".progress-fill")

  function animateProgressBarsOnHover() {
    educationCards.forEach((card) => {
      const progressFill = card.querySelector(".progress-fill")
      const width = progressFill.getAttribute("style").match(/width: (\d+)%/)[1]

      card.addEventListener("mouseenter", () => {
        progressFill.style.width = "0%"
        setTimeout(() => {
          progressFill.style.width = width + "%"
        }, 100)
      })
    })
  }

  // Call the function to set up the hover animations
  animateProgressBarsOnHover()

  // Add 3D effect to testimonial content on mouse move
  const testimonialContents = document.querySelectorAll(".testimonial-content")

  testimonialContents.forEach((content) => {
    content.addEventListener("mousemove", (e) => {
      const rect = content.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const moveX = (x - centerX) / 20
      const moveY = (y - centerY) / 20

      content.style.transform = `translateY(-10px) perspective(1000px) rotateX(${moveY}deg) rotateY(${-moveX}deg)`

      const quoteIcon = content.querySelector(".quote-icon")
      const testimonialText = content.querySelector(".testimonial-text")
      const authorInfo = content.querySelector(".testimonial-author")

      if (quoteIcon) quoteIcon.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px) rotate(${-moveX}deg)`
      if (testimonialText) testimonialText.style.transform = `translateZ(${20 + Math.abs(moveX) + Math.abs(moveY)}px)`
      if (authorInfo) authorInfo.style.transform = `translateZ(${30 + Math.abs(moveX) + Math.abs(moveY)}px)`
    })

    content.addEventListener("mouseleave", () => {
      content.style.transform = ""

      const quoteIcon = content.querySelector(".quote-icon")
      const testimonialText = content.querySelector(".testimonial-text")
      const authorInfo = content.querySelector(".testimonial-author")

      if (quoteIcon) quoteIcon.style.transform = ""
      if (testimonialText) testimonialText.style.transform = ""
      if (authorInfo) authorInfo.style.transform = ""
    })
  })
})
