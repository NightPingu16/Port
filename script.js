document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector(".nav-links")
  const navLinks = document.querySelectorAll(".nav-links li")

  burger.addEventListener("click", () => {
    // Toggle nav
    nav.classList.toggle("nav-active")

    // Animate links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ""
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
      }
    })

    // Burger animation
    burger.classList.toggle("toggle")
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      // Close mobile menu if open
      if (nav.classList.contains("nav-active")) {
        nav.classList.remove("nav-active")
        burger.classList.remove("toggle")
        navLinks.forEach((link) => {
          link.style.animation = ""
        })
      }

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "smooth",
      })

      // Update active link
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.remove("active")
      })
      this.classList.add("active")
    })
  })

  // Track scroll direction
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const st = window.pageYOffset || document.documentElement.scrollTop
    const scrollingDown = st > lastScrollTop

    // Update scroll direction class on body
    if (scrollingDown) {
      document.body.classList.remove("scrolling-up")
      document.body.classList.add("scrolling-down")
    } else {
      document.body.classList.remove("scrolling-down")
      document.body.classList.add("scrolling-up")
    }

    lastScrollTop = st <= 0 ? 0 : st // For Mobile or negative scrolling
  })

  // Intersection Observer for section animations
  const sections = document.querySelectorAll(".section")
  const navItems = document.querySelectorAll(".nav-links a")

  const observerOptions = {
    root: null,
    rootMargin: "-100px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Add animation to section content when it comes into view
      if (entry.isIntersecting) {
        const content = entry.target.querySelector(".content")
        content.classList.add("show")

        // Update active navigation link
        const id = entry.target.getAttribute("id")
        navItems.forEach((item) => {
          item.classList.remove("active")
          if (item.getAttribute("href") === `#${id}`) {
            item.classList.add("active")
          }
        })

        // If it's a project section, add the in-view class
        if (entry.target.classList.contains("project-section")) {
          entry.target.classList.add("in-view")

          // Auto-play videos when in view
          const videos = entry.target.querySelectorAll("video")
          videos.forEach((video) => {
            // Only try to play videos on desktop
            if (window.innerWidth > 768) {
              if (video.paused) {
                video.play().catch((e) => console.log("Auto-play prevented:", e))
              }
            }
          })
        }

        // Special animation for education cards
        if (id === "education") {
          const educationCards = entry.target.querySelectorAll(".education-card")
          educationCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate")
            }, index * 200) // Stagger the animations
          })
        }
      } else {
        // Remove animation classes when section is out of view
        if (!entry.target.classList.contains("keep-animation")) {
          entry.target.querySelector(".content").classList.remove("show")

          // If it's the education section, remove animation classes
          if (entry.target.id === "education") {
            const educationCards = entry.target.querySelectorAll(".education-card")
            educationCards.forEach((card) => {
              card.classList.remove("animate")
            })
          }
        }

        // Pause videos when out of view
        if (entry.target.classList.contains("project-section")) {
          const videos = entry.target.querySelectorAll("video")
          videos.forEach((video) => {
            if (!video.paused) {
              video.pause()
            }
          })
        }
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    observer.observe(section)
  })

  // Initialize the first section to be visible
  document.querySelector("#home .content").classList.add("show")

  // Video modal functionality
  const videoModal = document.getElementById("video-modal")
  const projectVideo = document.getElementById("project-video")
  const videoTitle = document.getElementById("video-title")
  const closeModal = document.querySelector(".close-modal")
  const videoContainers = document.querySelectorAll(".video-container")

  // Open modal when video is clicked
  videoContainers.forEach((container) => {
    container.addEventListener("click", () => {
      const videoSrc = container.getAttribute("data-video")
      const title = container.getAttribute("data-title")

      if (videoModal && projectVideo && videoTitle) {
        projectVideo.innerHTML = `<source src="${videoSrc}" type="video/mp4">`
        videoTitle.textContent = title
        videoModal.style.display = "flex"

        setTimeout(() => {
          videoModal.classList.add("show")
          projectVideo.load()

          // Add controls to the video
          projectVideo.setAttribute("controls", "true")

          // Play video after a short delay to avoid stuttering
          setTimeout(() => {
            projectVideo.play().catch((e) => console.log("Autoplay prevented:", e))
          }, 300)
        }, 10)
      }
    })
  })

  // Close modal when X is clicked
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      closeVideoModal()
    })
  }

  // Close modal when clicking outside the video
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        closeVideoModal()
      }
    })
  }

  // Function to close the video modal
  function closeVideoModal() {
    if (videoModal) {
      videoModal.classList.remove("show")
      setTimeout(() => {
        videoModal.style.display = "none"
        if (projectVideo) {
          projectVideo.pause()
          projectVideo.innerHTML = ""
        }
      }, 300)
    }
  }

  // Keyboard events for modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal && videoModal.classList.contains("show")) {
      closeVideoModal()
    }
  })

  // Testimonials slider functionality
  const testimonialSlides = document.querySelectorAll(".testimonial-slide")
  const testimonialDots = document.querySelectorAll(".dot")
  const prevButton = document.querySelector(".testimonial-prev")
  const nextButton = document.querySelector(".testimonial-next")
  let currentSlide = 0
  const totalSlides = testimonialSlides.length

  // Function to show a specific slide
  function showSlide(index) {
    // Hide all slides
    testimonialSlides.forEach((slide) => {
      slide.classList.remove("active")
    })

    // Deactivate all dots
    testimonialDots.forEach((dot) => {
      dot.classList.remove("active")
    })

    // current slide and activate the corresponding dot
    testimonialSlides[index].classList.add("active")
    testimonialDots[index].classList.add("active")

    currentSlide = index
  }

  // Next slide function
  function nextSlide() {
    let nextIndex = currentSlide + 1
    if (nextIndex >= totalSlides) {
      nextIndex = 0
    }
    showSlide(nextIndex)
  }

  // Previous slide function
  function prevSlide() {
    let prevIndex = currentSlide - 1
    if (prevIndex < 0) {
      prevIndex = totalSlides - 1
    }
    showSlide(prevIndex)
  }

  // Event listeners for controls
  if (nextButton) {
    nextButton.addEventListener("click", nextSlide)
  }

  if (prevButton) {
    prevButton.addEventListener("click", prevSlide)
  }

  // Dot navigation
  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const slideIndex = Number.parseInt(this.getAttribute("data-index"))
      showSlide(slideIndex)
    })
  })

  // Auto-advance slides every 5 seconds
  setInterval(nextSlide, 5000)

  // Experience timeline interaction
  const timelinePoints = document.querySelectorAll(".timeline-point")
  const timelineCards = document.querySelectorAll(".timeline-card")

  if (timelinePoints.length > 0 && timelineCards.length > 0) {
    // Show the first card by default
    timelineCards[0].classList.add("active")

    // Add click event to timeline points
    timelinePoints.forEach((point, index) => {
      point.addEventListener("click", () => {
        // Hide all cards
        timelineCards.forEach((card) => {
          card.classList.remove("active")
        })

        // Show the selected card
        if (timelineCards[index]) {
          timelineCards[index].classList.add("active")
        }
      })
    })
  }

  // interactive background particles
  createParticles()

  // 3D tilt effect to education cards
  const educationCards = document.querySelectorAll(".education-card")

  educationCards.forEach((card) => {
    card.addEventListener("mousemove", handleTilt)
    card.addEventListener("mouseleave", resetTilt)
  })

  function handleTilt(e) {
    // Only apply tilt effect on desktop
    if (window.innerWidth <= 768) return

    const cardRect = this.getBoundingClientRect()
    const cardCenterX = cardRect.left + cardRect.width / 2
    const cardCenterY = cardRect.top + cardRect.height / 2

    const mouseX = e.clientX - cardCenterX
    const mouseY = e.clientY - cardCenterY

    // Calculate rotation based on mouse position
    const rotateY = mouseX * 0.05
    const rotateX = -mouseY * 0.05

    // Transform
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    this.style.transition = "transform 0.1s ease"

    // Highlight Effect
    const glowX = (mouseX / cardRect.width) * 100 + 50
    const glowY = (mouseY / cardRect.height) * 100 + 50
    this.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(74, 108, 247, 0.3), rgba(30, 30, 30, 0.8))`
  }

  function resetTilt() {
    this.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)"
    this.style.transition = "transform 0.5s ease, background 0.5s ease"
    this.style.background = "rgba(30, 30, 30, 0.8)"
  }

  // Check if device is mobile
  const isMobile = window.innerWidth <= 768

  // Preload videos for better mobile performance
  if (isMobile) {
    const videoElements = document.querySelectorAll("video")
    videoElements.forEach((video) => {
      video.setAttribute("preload", "metadata")
      video.setAttribute("playsinline", "true")
    })
  }
})

// Interactive Background Particles
function createParticles() {
  // Reduce particle count on mobile for better performance
  const isMobile = window.innerWidth <= 768
  const particleCount = isMobile ? 20 : 50

  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles"
  document.body.appendChild(particlesContainer)

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.style.position = "absolute"
    particle.style.width = Math.random() * 10 + 5 + "px"
    particle.style.height = particle.style.width
    particle.style.backgroundColor = "rgba(74, 108, 247, 0.2)"
    particle.style.borderRadius = "50%"
    particle.style.top = Math.random() * 100 + "vh"
    particle.style.left = Math.random() * 100 + "vw"
    particle.style.opacity = Math.random() * 0.5
    particle.style.transition = "transform 1s ease, opacity 1s ease"

    particlesContainer.appendChild(particle)

    // Animate Particles - less frequent on mobile
    setInterval(
      () => {
        particle.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`
        particle.style.opacity = Math.random() * 0.5
      },
      isMobile ? 3000 : 2000,
    )
  }

  // Mouse Interaction - only on desktop
  if (!isMobile) {
    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      const particles = document.querySelectorAll(".particles div")
      particles.forEach((particle) => {
        const rect = particle.getBoundingClientRect()
        const particleX = rect.left + rect.width / 2
        const particleY = rect.top + rect.height / 2

        const distX = mouseX - particleX
        const distY = mouseY - particleY
        const distance = Math.sqrt(distX * distX + distY * distY)

        if (distance < 100) {
          const moveX = distX / 10
          const moveY = distY / 10
          particle.style.transform = `translate(${-moveX}px, ${-moveY}px)`
          particle.style.opacity = "0.8"
        }
      })
    })
  }
}

