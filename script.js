const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const passwordStrength = document.getElementById("passwordStrength");

const fields = {
  prefix: document.getElementById("prefix"),
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  username: document.getElementById("username"),
  dob: document.getElementById("dob"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
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

  if (!/^[0-9]{10}$/.test(fields.contact.value.trim())) {
    showError("contact", "Enter a valid 10 digit contact number.");
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

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (password.length >= 8 && hasUppercase && hasLowercase && hasNumber && hasSpecial) {
    passwordStrength.textContent = "Strong password";
    passwordStrength.classList.add("strong-password");
  } else if (password.length >= 6 && hasNumber && (hasUppercase || hasLowercase)) {
    passwordStrength.textContent = "Moderate password";
    passwordStrength.classList.add("moderate-password");
  } else {
    passwordStrength.textContent = "Weak password";
    passwordStrength.classList.add("weak-password");
  }
}

fields.password.addEventListener("input", updatePasswordStrength);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (validateForm()) {
    successMessage.textContent = "Form submitted successfully!";
    form.reset();
    updatePasswordStrength();
  }
});
