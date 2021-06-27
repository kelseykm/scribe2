import '../css/login.css';

// VARIABLES
const errLoginFail = 'Log in failed. Try again with the correct email and/or password';
const errPasswordShort = 'Password must be at least 8 characters long';
const errBadEmail = 'Email is malformed';
const emailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

// SELECTORS
const titleBar = document.querySelector('.title-bar');
const errorSuccess = document.querySelector('.error-success');
const errorSuccessMesg = document.querySelector('.error-success__mesg');
const errorSuccessClose = document.querySelector('.error-success__close');
const loginForm = document.querySelector('.login-form');
const email = document.querySelector('.email-container input');
const password = document.querySelector('.password-container input');
const showPassword = document.querySelector('.show-password');
const showPasswordImage = document.querySelector('.show-password__image');
let blockList = [
  titleBar,
  ...document.querySelectorAll('body main section:not(:nth-child(1))')
];

// FUNCTIONS
function removeWhitespace(input) {
  if (input === null || input === undefined) return;
  return input.toString().trim();
}

function createErrorSuccess(mesg) {
  errorSuccessMesg.innerText = removeWhitespace(mesg);

  errorSuccessClose.style.transform = 'rotate(0deg)';
  errorSuccessClose.style.transition = 'transform 1500ms ease-in-out';

  errorSuccess.style.transform = 'translateX(0%)';
  blockList.forEach(element => {
    element.style.pointerEvents = 'none';
    element.style.userSelect = 'none';
  });
}

function normalizeForm(options) {
  if (options.values) {
    email.value = null;
    password.value = null;
  }
  if (options.boxshadows) {
    email.style.boxShadow = "0 0 0.17em 0.11em rgb(131, 40, 74)";
    password.style.boxShadow = "0 0 0.17em 0.11em rgb(131, 40, 74)";
  }
}

function generateThrobber() {
  if (document.querySelector('.throbber-container')) return;

  let throbberContainer = document.createElement('div');
  throbberContainer.classList.add('throbber-container');

  let throbberOverlay = document.createElement('div');
  throbberOverlay.classList.add('throbber-overlay');

  let throbber = document.createElement('div');
  throbber.classList.add('throbber');

  throbberContainer.append(throbberOverlay, throbber);
  document.querySelector('body').appendChild(throbberContainer);
}

function removeThrobber() {
  let throbberContainer = document.querySelector('.throbber-container');
  if (!throbberContainer) return;
  throbberContainer.remove();
}

// EVENT HANDLERS
showPassword.addEventListener('click', event => {
  let target = event.currentTarget;
  target.classList.toggle('show');

  if (target.classList.contains('show')) {
    showPasswordImage.src = '/images/hide-password.png';
    target.setAttribute('title', 'Hide password');
    password.type = 'text';
  } else {
    showPasswordImage.src = '/images/show-password.png';
    target.setAttribute('title', 'Show password');
    password.type = 'password';
  }
});

loginForm.addEventListener('submit', event => {
  let target = event.currentTarget;
  event.preventDefault();

  email.value = removeWhitespace(email.value);
  if (!emailregex.test(email.value)) {
    normalizeForm({ boxshadows: true });
    email.style.boxShadow = "0 0 0.44em 0.17em red";
    createErrorSuccess(errBadEmail);
    return;
  }

  if (password.value.length < 8) {
    normalizeForm({ boxshadows: true });
    password.style.boxShadow = "0 0 0.44em 0.17em red";
    createErrorSuccess(errPasswordShort);
    return;
  }

  let form = new FormData(target);

  generateThrobber();

  import('axios').then(axios => {
    axios = axios.default;
    
    axios.post('/accounts/log-in', form)
    .then(res => {
      removeThrobber();
      if (res.data.status === 200) {
        normalizeForm({ values: true, boxshadows: true });
        window.location.href = '/';
      }
      else {
        normalizeForm({ boxshadows: true });
        createErrorSuccess(res.data.message);
      }
    })
    .catch(err => {
      removeThrobber();
      normalizeForm({ boxshadows: true });
      createErrorSuccess(errLoginFail);
      console.error(err);
    });
  });
});

if (errorSuccessClose)
errorSuccessClose.addEventListener('click', () => {
  errorSuccessClose.style.transform = 'rotate(360deg)';
  errorSuccessClose.style.transition = 'transform 350ms ease-in-out';

  errorSuccess.style.transform = 'translateX(-110%)';
  blockList.forEach(element => {
    element.style.pointerEvents = 'unset';
    element.style.userSelect = 'auto';
  });
});
