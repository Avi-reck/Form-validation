const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const passwordStrength = document.getElementById("passwordStrength");
const passwordInput = document.getElementById("password");
const passwordToggle = document.querySelector(".password-toggle");

const fields = {
  prefix: document.getElementById("prefix"),
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  username: document.getElementById("username"),
  dob: document.getElementById("dob"),
  password: passwordInput,
  confirmPassword: document.getElementById("confirmPassword"),
  countryCode: document.getElementById("countryCode"),
  contact: document.getElementById("contact"),
  email: document.getElementById("email"),
  age: document.getElementById("age")
};

function showError(fieldName, message) {
  const error = document.getElementById(`${fieldName}Error`);
  const field = fields[fieldName];

  if (error) {
    error.textContent = message;
  }

  if (field) {
    field.classList.toggle("invalid", Boolean(message));
  }
}

function getAgeFromDob(dobValue) {
  const birthDate = new Date(dobValue);
  const today = new Date();

  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    calculatedAge -= 1;
  }

  return calculatedAge;
}

function validateForm() {
  let isValid = true;
  successMessage.textContent = "";

  Object.keys(fields).forEach((fieldName) => showError(fieldName, ""));
  document.getElementById("genderError").textContent = "";

  if (!fields.prefix.value) {
    showError("prefix", "Please select a prefix.");
    isValid = false;
  }

  if (fields.firstName.value.trim().length < 2) {
    showError("firstName", "First name must be at least 2 characters.");
    isValid = false;
  }

  if (fields.lastName.value.trim().length < 2) {
    showError("lastName", "Last name must be at least 2 characters.");
    isValid = false;
  }

  if (fields.username.value.trim().length < 4) {
    showError("username", "Username must be at least 4 characters.");
    isValid = false;
  }

  if (!fields.dob.value) {
    showError("dob", "Date of birth is required.");
    isValid = false;
  }

  if (fields.password.value.length < 6) {
    showError("password", "Password must be at least 6 characters.");
    isValid = false;
  }

  if (fields.confirmPassword.value !== fields.password.value) {
    showError("confirmPassword", "Passwords do not match.");
    isValid = false;
  }

  const selectedGender = document.querySelector("input[name='gender']:checked");

  if (!selectedGender) {
    document.getElementById("genderError").textContent = "Please select gender.";
    isValid = false;
  }

  if (!fields.countryCode.value) {
    showError("countryCode", "Please select country code.");
    isValid = false;
  }

  if (!/^[0-9\s-]{7,14}$/.test(fields.contact.value.trim())) {
    showError("contact", "Enter a valid 7 to 14 digit number.");
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
    showError("email", "Enter a valid email address.");
    isValid = false;
  }

  const age = Number(fields.age.value);

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    showError("age", "Age must be between 1 and 120.");
    isValid = false;
  }

  if (fields.dob.value && age) {
    const calculatedAge = getAgeFromDob(fields.dob.value);

    if (calculatedAge !== age) {
      showError("age", "Age should match the date of birth.");
      isValid = false;
    }
  }

  return isValid;
}

function updatePasswordStrength() {
  const password = fields.password.value;
  passwordStrength.className = "password-strength";

  if (!password) {
    passwordStrength.textContent = "";
    return;
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasLetter && (hasNumber || hasSpecial)) {
    passwordStrength.textContent = "Strong password";
    passwordStrength.classList.add("strong-password");
  } else {
    passwordStrength.textContent = "Weak password";
    passwordStrength.classList.add("weak-password");
  }
}

passwordToggle.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  passwordToggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

fields.password.addEventListener("input", updatePasswordStrength);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (validateForm()) {
    successMessage.textContent = "Form submitted successfully!";
    form.reset();
    updatePasswordStrength();
    passwordInput.type = "password";
    passwordToggle.setAttribute("aria-label", "Show password");
  }
});
