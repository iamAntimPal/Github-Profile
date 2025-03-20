 // Initialize EmailJS with your public API key (User ID)
  (function(){
    emailjs.init("qg0frkxEtvXp1k6Pe");
  })();

  // Get modal elements
  var modal = document.getElementById("chatModal");
  var trigger = document.getElementById("chatTrigger");
  var closeBtn = document.getElementsByClassName("close")[0];

  // Open the modal when trigger is clicked
  trigger.addEventListener("click", function() {
    modal.style.display = "block";
  });

  // Close the modal when the close button is clicked
  closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Close the modal when clicking outside the modal content
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Form submission: Validate data and send email using EmailJS
  document.getElementById("chatForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // HTML5 input validations will run automatically.
    var emailField = document.getElementById("email").value;
    var phoneField = document.getElementById("phone").value;
    var questionField = document.getElementById("question").value;

    var templateParams = {
      from_email: emailField,
      phone: phoneField,
      question: questionField
    };

    // Send the email using EmailJS
    emailjs.send("service_tt37xg6", "service_tt37xg6", templateParams)
      .then(function(response) {
        alert("Your message has been sent successfully!");
        document.getElementById("chatForm").reset();
        modal.style.display = "none";
      }, function(error) {
        alert("Failed to send message. Please try again later.");
        console.error("EmailJS error:", error);
      });
  });