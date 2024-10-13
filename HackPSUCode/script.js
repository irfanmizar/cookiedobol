
// Ensure all event listeners are added after the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

  // Get the modal elements
  const modal = document.getElementById('premiumModal');
  const closeModal = document.querySelector('.modal .close');

  // Function to open modal
  function openModal() {
      modal.style.display = 'block'; // Show the modal
  }

  // Function to close modal when the user clicks (X)
  closeModal.addEventListener('click', function () {
    modal.style.display = 'none'; // Hide the modal
  });

  // Close modal if the user clicks anywhere outside the modal content
  window.addEventListener('click', function (event) {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Start Learning Button Functionality
  document.getElementById('startButton').addEventListener('click', function () {
    this.classList.add('wowButton');
    // Hide the logo section
    document.querySelector('.logo-section').style.display = 'none';

    // Show the quiz setup section
    document.querySelector('.quiz-setup-section').style.display = 'block';
  });
  

  // Get the Easy button element
  const easyButton = document.getElementById('easyButton');

  // Add event listeners for mouse hover and mouse out
  easyButton.addEventListener('mouseover', function () {
    easyButton.textContent = "Definition";  // Change text to 'Definition' on hover
  });

  easyButton.addEventListener('mouseout', function () {
    easyButton.textContent = "Easy";  // Change text back to 'Easy' when not hovering
  });


  // Get the Medium button element
  const mediumButton = document.getElementById('mediumButton');
  let isPremiumMediumClicked = false; // Flag to check if Buy Premium is clicked

  // Add event listeners for mouse hover and mouse out
  mediumButton.addEventListener('mouseover', function () {
    if (!isPremiumMediumClicked) {
      mediumButton.textContent = "Explanation";  // Change text to 'Explanation' on hover
    }
  });

  mediumButton.addEventListener('mouseout', function () {
    if (!isPremiumMediumClicked) {
      mediumButton.textContent = "Medium";  // Change text back to 'Medium' when not hovering
    }
  });


  // Get the Hard button element
  const hardButton = document.getElementById('hardButton');
  let isPremiumHardClicked = false; // Flag to check if Buy Premium is clicked

  // Add event listeners for mouse hover and mouse out
  hardButton.addEventListener('mouseover', function () {
    if (!isPremiumHardClicked){
      hardButton.textContent = "Application";  // Change text to 'Application' on hover
    }
  });

  hardButton.addEventListener('mouseout', function () {
    if(!isPremiumHardClicked){
      hardButton.textContent = "Hard";  // Change text back to 'Hard' when not hovering
    }
  });



  const numQuestionsButtons = document.querySelectorAll('.questions');
  const difficultyButtons = document.querySelectorAll('.difficulty');
  const generateButton = document.getElementById('generateButton');
  const fileInput = document.getElementById('slideUpload');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const quizSetupSection = document.querySelector('.quiz-setup-section');
  const quizDisplay = document.getElementById('quizDisplay'); // New frame for displaying quiz
  const questionsContainer = document.getElementById('questionsContainer'); // Container for quiz questions

  //upload file
  let uploadedFile = null; // Variable to store the uploaded file

  // Trigger file input when "Upload PDF" button is clicked
  uploadButton.addEventListener('click', function () {
      fileInput.click(); // Simulate a click on the hidden file input
  });

  // Handle file selection
  fileInput.addEventListener('change', function () {
      const file = fileInput.files[0]; // Get the selected file

      if (file && file.type === 'application/pdf') {
          // Store the uploaded file in memory
          uploadedFile = file;

          // Display the file name to the user
          fileNameDisplay.textContent = `File uploaded: ${file.name}`;
          fileNameDisplay.style.display = 'block'; // Show the file name
          generateButton.disabled = false; // Enable the Generate button
      } else {
          alert('Please upload a valid PDF file.');
          fileNameDisplay.style.display = 'none'; // Hide file name if invalid file
          generateButton.disabled = true; // Disable button if no valid file
      }
  });

  let selectedQuestions = null;
  let selectedDifficulty = null;

  // Disable the generate button initially
  generateButton.disabled = true;

  // Function to check if both conditions (5 questions and easy difficulty) are met
  function checkGenerateButton() {
    if (selectedQuestions === '5' && selectedDifficulty === 'easy') {
      generateButton.disabled = false;
    } else {
      generateButton.disabled = true;
    }
  }

  // Handle click for number of questions
  numQuestionsButtons.forEach(button => {
    button.addEventListener('click', function () {

      const value = this.dataset.value;

      if (value === '10' || value === '15') {
        //alert('Buy Premium to select more than 5 questions!');
        this.textContent = 'Coming Soon';
        this.style.backgroundColor = '#3E5B7D';
        this.classList.add('pop-up-effect');
        isPremiumTenClicked = true;
        isPremiumFifteenClicked = true;
        return;
      }
      if (value === '5') {
          // Make the five button yellow
          this.style.backgroundColor = '#FFD700'; // Yellow color
          this.classList.add('pop-up-effect')
      }

      // Update selected questions
      selectedQuestions = value;

      // Highlight the selected button
      numQuestionsButtons.forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');

      // Check if the generate button should be enabled
      checkGenerateButton();
    });
  });

  // Handle click for difficulty
  difficultyButtons.forEach(button => {
    button.addEventListener('click', function () {
      const value = this.dataset.value;
      if (value === 'medium' || value === 'hard') {
        // Change the button text to 'commin' and turn the button red
        this.textContent = 'Coming Soon';
        this.style.backgroundColor = '#3E5B7D'; 
        // Add pop-up effect class to the button
        this.classList.add('pop-up-effect');
        isPremiumMediumClicked = true;
        isPremiumHardClicked = true;
        openModal();  // Set the flag to true to prevent hover changes
        return; // Prevent further processing
      }

      if (value === 'easy') {
          // Make the Easy button yellow
          easyButton.style.backgroundColor = '#FFD700'; // Yellow color
          // Add pop-up effect class to the button
          this.classList.add('pop-up-effect');
      }

      // Update selected difficulty
      selectedDifficulty = value;

      // Highlight the selected button
      difficultyButtons.forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');

      // Check if the generate button should be enabled
      checkGenerateButton();
    });

  generateButton.addEventListener('click', function () {
    if (!uploadedFile || !selectedQuestions || !selectedDifficulty) {
        alert('Please complete all fields before generating the quiz.');
        return;
    }
    // Create FormData to send the file and inputs to Flask
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('difficulty', selectedDifficulty);
    formData.append('numQuestions', selectedQuestions);

    // Send the data to the Flask server
    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Parse the response as JSON
    .then(data => {
        if (data.error) {
            alert('Error generating quiz: ' + data.error);
        } else {
            // Clear previous quiz questions
            questionsContainer.innerHTML = '';

            // Assuming 'data.quiz' is an array of questions from the backend
            const questions = data.quiz;  // Directly use the quiz array

            // Display the generated quiz questions
            questions.forEach((question, index) => {
                const questionElement = document.createElement('li');
                questionElement.textContent = `${index + 1}. ${question}`;
                questionsContainer.appendChild(questionElement);
            });

            // Make the quiz section visible
            quizDisplay.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  });
})})