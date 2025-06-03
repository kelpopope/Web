
document.addEventListener('DOMContentLoaded', () => {
  const totalQuestions = 10;
  let correctCount = 0;
  const progressBar = document.getElementById('progressBar');

  document.querySelectorAll('.check-answer').forEach(button => {
    button.addEventListener('click', function() {
      const cardBody = this.closest('.card-body');
      const selected = cardBody.querySelector('input[type="radio"]:checked');
      const feedbackDiv = cardBody.querySelector('.feedback');

      if (!selected) {
        feedbackDiv.textContent = "Please select an answer.";
        feedbackDiv.classList.add('text-danger');
        return;
      }

      const inputs = cardBody.querySelectorAll('input[type="radio"]');
      inputs.forEach(input => input.disabled = true);
      this.disabled = true;

      if (selected.dataset.correct === "true") {
        feedbackDiv.textContent = "Correct!";
        feedbackDiv.classList.add('text-success');
        correctCount++;
      } else {
        const correctInput = cardBody.querySelector('input[data-correct="true"]');
        const correctAnswer = correctInput ? correctInput.value : "";
        feedbackDiv.textContent = "Incorrect. Correct answer: " + correctAnswer;
        feedbackDiv.classList.add('text-danger');
      }

      const percent = Math.round((correctCount / totalQuestions) * 100);
      if (progressBar) {
        progressBar.style.width = percent + "%";
        progressBar.setAttribute('aria-valuenow', percent);
        progressBar.textContent = percent + "%";
      }
    });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
      } else {
        const contactModal = new bootstrap.Modal(document.getElementById('contactSuccessModal'));
        contactModal.show();
        contactForm.reset();
        contactForm.classList.remove('was-validated');
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const password = document.getElementById('signupPassword');
      const confirm = document.getElementById('confirmPassword');
      if (password.value !== confirm.value) {
        confirm.setCustomValidity("Passwords do not match");
      } else {
        confirm.setCustomValidity("");
      }
      if (!signupForm.checkValidity()) {
        signupForm.classList.add('was-validated');
      } else {
        const signupModal = new bootstrap.Modal(document.getElementById('signupSuccessModal'));
        signupModal.show();
        signupForm.reset();
        signupForm.classList.remove('was-validated');
      }
    });
  }

  const apiContainer = document.getElementById('apiCoursesContainer');
  const apiLoading = document.getElementById('apiLoading');

  if (apiContainer && apiLoading) {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        apiLoading.style.display = 'none';

        const courses = data.slice(0, 6);
        courses.forEach(course => {
          const col = document.createElement('div');
          col.className = 'col-md-4';
          col.innerHTML = `
            <div class="card h-100">
              <img src="images/course${(course.id % 3) + 1}.webp" class="card-img-top" alt="API Course" loading="lazy">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${course.title}</h5>
                <p class="card-text">${course.body.substring(0, 100)}...</p>
                <button class="btn btn-primary mt-auto view-details-btn" data-title="${course.title}" data-body="${course.body}">View Details</button>
              </div>
            </div>`;
          apiContainer.appendChild(col);
        });
      })
      .catch(error => {
        apiLoading.innerHTML = '<p class="text-danger">Failed to load courses. Please try again later.</p>';
        console.error('Fetch error:', error);
      });
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-details-btn')) {
      const title = e.target.getAttribute('data-title');
      const body = e.target.getAttribute('data-body');
      let modal = document.getElementById('apiCourseModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'apiCourseModal';
        modal.innerHTML = `
          <div class="modal fade" tabindex="-1" id="apiCourseModalDialog">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 id="apiCourseModalLabel" class="modal-title">Course Title</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div id="apiCourseModalBody" class="modal-body">Course details go here.</div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>`;
        document.body.appendChild(modal);
      }
      document.getElementById('apiCourseModalLabel').textContent = title;
      document.getElementById('apiCourseModalBody').textContent = body;
      const apiModal = new bootstrap.Modal(document.getElementById('apiCourseModalDialog'));
      apiModal.show();
    }
  });
});
