const form = document.querySelector("#contactForm");
const successMessage = document.querySelector("#successMessage");

const validators = {
  prefix: value => value ? "" : "Please choose a prefix.",

  username: value => {
    if (!value.trim()) return "Username is required.";
    return /^[a-zA-Z0-9_]{4,20}$/.test(value)
      ? ""
      : "Use 4-20 letters, numbers, or underscores.";
  },

  firstName: value => value.trim() ? "" : "First name is required.",

  lastName: value => value.trim() ? "" : "Last name is required.",

  dateOfBirth: value => {
    if (!value) return "Date of birth is required.";

    const selectedDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? "" : "Enter a date in the past.";
  },

  age: value => {
    if (!value) return "Age is required.";

    const age = Number(value);

    return Number.isInteger(age) && age >= 1 && age <= 120
      ? ""
      : "Enter an age between 1 and 120.";
  },

  email: value => {
    if (!value.trim()) return "Email address is required.";

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ""
      : "Enter a valid email address.";
  },

  contactNumber: value => {
    if (!value.trim()) return "Contact number is required.";

    return /^[0-9+\-\s()]{7,16}$/.test(value)
      ? ""
      : "Enter a valid contact number.";
  },

  password: value => {
    if (!value) return "Password is required.";

    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)
      ? ""
      : "Use at least 8 characters with a letter and number.";
  },

  confirmPassword: value => {
    if (!value) return "Please confirm your password.";

    return value === document.querySelector("#password").value
      ? ""
      : "Passwords do not match.";
  },

  gender: value => value ? "" : "Please select a gender.",

  message: value => {
    if (!value.trim()) return "Message is required.";

    return value.trim().length >= 10
      ? ""
      : "Message must be at least 10 characters.";
  },

  consent: checked => checked ? "" : "Please agree before submitting."
};

function setFieldState(field, message) {
  const label = field.closest("label");

  const error = field.name === "gender"
    ? document.querySelector("#genderError")
    : field.id === "consent"
    ? document.querySelector("#consentError")
    : label.querySelector(".error-message");

  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", Boolean(message));
  error.textContent = message;
}

function validateField(field) {
  const value = field.type === "checkbox"
    ? field.checked
    : field.type === "radio"
    ? Boolean(form.querySelector(`input[name="${field.name}"]:checked`))
    : field.value;

  const message = validators[field.name](value);

  setFieldState(field, message);

  return !message;
}

form.addEventListener("input", event => {
  const field = event.target;

  if (field.name && validators[field.name]) {
    validateField(field);
    successMessage.textContent = "";
  }
});

form.addEventListener("change", event => {
  const field = event.target;

  if (field.name && validators[field.name]) {
    validateField(field);
    successMessage.textContent = "";
  }
});

form.addEventListener("submit", event => {
  event.preventDefault();

  const fields = Array.from(form.elements).filter(field => validators[field.name]);

  const uniqueFields = fields.filter((field, index, list) => {
    return field.type !== "radio" || list.findIndex(item => item.name === field.name) === index;
  });

  const isValid = uniqueFields.every(validateField);

  if (!isValid) {
    successMessage.textContent = "";
    return;
  }

  successMessage.textContent = "Thanks! Your message is ready to send.";

  form.reset();

  uniqueFields.forEach(field => setFieldState(field, ""));
});
