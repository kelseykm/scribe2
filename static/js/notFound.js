import '../css/notFound.css';

//VARS AND SELECTORS
const errAccChangePassWordFail = 'Failed to change account password, please try again'
const errAccDeleteFail = 'Failed to delete account, please try again';
const errAccLogoutFail = 'Failed to log out of account, please try again';
const errUsernameChangeFail = 'Failed to change username, please try again';
const errUsernameInUse = 'Username is already in use';
const errNoUsername = 'No username entered';
const errUsernameLong = 'Username is too long';
const titleBar = document.querySelector('.title-bar');
const bread = document.querySelector('.bread');
const burgers = document.querySelectorAll('.burger');
const burgerMiddle = document.querySelector('.burger-middle');
const navBar = document.querySelector('.nav-bar');
const topicSection = document.querySelector('.topic-section');
const overlay = document.querySelector('.overlay');
const errorSuccess = document.querySelector('.error-success');
const errorSuccessMesg = document.querySelector('.error-success__mesg');
const errorSuccessClose = document.querySelector('.error-success__close');
const accountChangeUsername = document.querySelector('.account-changeusername');
const accountChangePassword = document.querySelector('.account-changepassword');
const changeUsernamePopup = document.querySelector('.changeusername-popup');
const changeUsernamePopupCancel = document.querySelector('.username-popup-btn__cancel');
const changeUsernamePopupText = document.querySelector('.changeusername-popup__text');
const changePasswordPopup = document.querySelector('.changepassword-popup');
const changePasswordPopupCancel = document.querySelector('.password-popup-btn__cancel');
const changePasswordPopupText = document.querySelectorAll('.changepassword-popup input');
let blockList = [
  navBar,
  titleBar,
  ...document.querySelectorAll('body main section:not(:nth-child(1))')
];
const accountDelete = document.querySelector('.account-delete');
const accountLogout = document.querySelector('.account-logout');
const confirmActionPopup = document.querySelector('.confirm-action-popup');
const currentPassword = changePasswordPopupText[0];
const showCurrentPassword = document.querySelector('.show-current-password');
const showCurrentPasswordImage = document.querySelector('.show-current-password__image');
const newPassword = changePasswordPopupText[1];
const showNewPassword = document.querySelector('.show-new-password');
const showNewPasswordImage = document.querySelector('.show-new-password__image');
const confirmPassword = changePasswordPopupText[2];
const showConfirmPassword = document.querySelector('.show-confirm-password ');
const showConfirmPasswordImage = document.querySelector('.show-confirm-password__image');

//update recent topics on page load
updateRecentTopics();

//FUNCTIONS
function removeWhitespace(input) {
  if (input === null || input === undefined) return;
  return input.toString().trim();
}

function updateSesionStorage() {
  if (!sessionStorage.length) {
    let recentTopics = {
      numberOfTopics: 0,
      maxTopics: 7,
      topics: []
    };

    let topic = generateRecentTopic();
    recentTopics.topics.push({
      topicName: topic.innerText,
      topicLink: topic.href,
      topicId: new URL(topic.href).search.slice(4)
    });
    recentTopics.numberOfTopics += 1;

    sessionStorage.setItem('recentTopics', JSON.stringify(recentTopics));
  }
  else {
    let recentTopics = JSON.parse(sessionStorage.getItem('recentTopics'));
    let topic = generateRecentTopic();
    let topicId = new URL(topic.href).search.slice(4);

    let wasAlreadySaved = false;

    for (let index = 0; index < recentTopics.topics.length; index++)
    if (topicId === recentTopics.topics[index].topicId) {
      recentTopics.topics.splice(index, 1);
      recentTopics.topics.unshift({
        topicName: topic.innerText,
        topicLink: topic.href,
        topicId: topicId
      });
      wasAlreadySaved = true;
    }

    if (!wasAlreadySaved) {
      switch (recentTopics.numberOfTopics < recentTopics.maxTopics) {
        case true:
          recentTopics.topics.unshift({
            topicName: topic.innerText,
            topicLink: topic.href,
            topicId: topicId
          });
          recentTopics.numberOfTopics += 1;
          break;
        case false:
          recentTopics.topics.pop();
          recentTopics.topics.unshift({
            topicName: topic.innerText,
            topicLink: topic.href,
            topicId: topicId
          });
      }
    }
    sessionStorage.setItem('recentTopics', JSON.stringify(recentTopics));
  }
}

function pruneSessionStorage(topicIds) {
  if (!sessionStorage.length) return;

  let recentTopics = JSON.parse(sessionStorage.getItem('recentTopics'));

  for (let topicId of topicIds)
  for (let index = 0; index < recentTopics.topics.length; index++)
  if (topicId === recentTopics.topics[index].topicId) {
    recentTopics.topics.splice(index, 1);
    recentTopics.numberOfTopics -= 1;
    break;
  }
  sessionStorage.setItem('recentTopics', JSON.stringify(recentTopics));
}

function generateRecentTopic() {
  let recentTopic = document.createElement('a');
  recentTopic.classList.add('recent-topic');

  let topicName = document.querySelector('.topic-name').innerText;
  let topicLink = '/subjects/sections/topics/' + generateTopicLink(topicName, new URL(window.location.href).search.slice(4));

  recentTopic.setAttribute('href', topicLink);
  recentTopic.innerText = topicName;
  return recentTopic;
}

function updateRecentTopics() {
  if (window.location.href.includes('topics') && document.querySelector('.topic-name'))
  updateSesionStorage();

  if (!sessionStorage.length) return;

  let recentTopics = JSON.parse(sessionStorage.getItem('recentTopics'));
  const topicSection = document.querySelector('.topic-section');

  document.querySelectorAll('.recent-topic').forEach(topic => {
    topic.remove();
  });

  for (let topic of recentTopics.topics) {
    let topicAnchor = document.createElement('a');
    topicAnchor.classList.add('recent-topic');
    topicAnchor.href = topic.topicLink;
    topicAnchor.innerText = topic.topicName;

    topicSection.appendChild(topicAnchor);
  }
}

function generateTopicLink(topicName, id) {
  return `${encodeURIComponent(topicName.toLowerCase().replaceAll(' ', '-'))}?id=${id}`;
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

function confirmAction(yesCallback = () => {}, cancelCallback = () => {}) {
  confirmActionPopup.style.transform = 'translate(-50%, -50%) scale(1)';
  overlay.style.display = 'unset';
  bread.style.pointerEvents = 'none';

  const confirmActionPopupYes = document.querySelector('.confirm-action-popup-btn__yes');
  confirmActionPopupYes.onclick = () => {
    confirmActionPopup.style.transform = 'translate(-50%, -50%) scale(0)';
    overlay.style.display = 'none';
    bread.style.pointerEvents = 'unset';
    yesCallback();
  };

  const confirmActionPopupCancel = document.querySelector('.confirm-action-popup-btn__cancel');
  confirmActionPopupCancel.onclick = () => {
    confirmActionPopup.style.transform = 'translate(-50%, -50%) scale(0)';
    overlay.style.display = 'none';
    bread.style.pointerEvents = 'unset';
    cancelCallback();
  };
}

//EVENT LISTENERS
if (bread)
bread.addEventListener('click', () => {
  navBar.classList.toggle('open');
  bread.classList.toggle('open');
  burgers.forEach(burger => burger.classList.toggle('open'));

  if (navBar.classList.contains('open')) {
    navBar.style.userSelect = 'auto';
    navBar.style.pointerEvents = 'unset';
    navBar.style.transform = 'translateX(0%)';
  } else {
    navBar.style.transform = 'translateX(-100%)';
    navBar.style.userSelect = 'none';
    navBar.style.pointerEvents = 'none';
  }

  if (burgerMiddle.classList.contains('open')) {
    let xLimbOne = document.createElement('div');
    let xLimbTwo = document.createElement('div');
    for (let xLimb of [ xLimbOne, xLimbTwo ]){
      xLimb.style.height = '0.25em';
      xLimb.style.width = '1.5em';
      xLimb.style.borderRadius = '0.06em';
      xLimb.style.backgroundColor = 'var(--primary-color)';
      xLimb.style.position = 'absolute';
    }
    burgerMiddle.style.display = 'flex';
    burgerMiddle.style.flexDirection = 'column';
    burgerMiddle.style.alignItems = 'center';
    burgerMiddle.style.justifyContent = 'center';
    burgerMiddle.style.position = 'relative';
    setTimeout(() => {
      burgerMiddle.appendChild(xLimbOne);
      burgerMiddle.appendChild(xLimbTwo);
      xLimbOne.style.transform = 'rotate(45deg)';
      xLimbTwo.style.transform = 'rotate(-45deg)';
    }, 500)
  } else document.querySelectorAll('.burger-middle div').forEach(div => burgerMiddle.removeChild(div));
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

if (accountDelete)
accountDelete.addEventListener('click', () => {
  let yesCallback = () => {
    generateThrobber();

    axios.get('/accounts/delete-account')
    .then(res => {
      removeThrobber();
      if (res.data.status === 200) {
        sessionStorage.clear();
        window.location.href = '/';
      }
      else createErrorSuccess(res.data.message);
    })
    .catch(err => {
      removeThrobber();
      console.error(err);
      createErrorSuccess(errAccDeleteFail);
    });
  };
  confirmAction(yesCallback);
});

if (accountLogout)
accountLogout.addEventListener('click', () => {
  let yesCallback = () => {
    generateThrobber();

    axios.get('/accounts/log-out')
    .then(res => {
      removeThrobber();
      if (res.data.status === 200) {
        sessionStorage.clear();
        window.location.href = '/';
      }
      else createErrorSuccess(res.data.message);
    })
    .catch(err => {
      removeThrobber();
      console.error(err);
      createErrorSuccess(errAccLogoutFail);
    });
  };
  confirmAction(yesCallback);
});

if (accountChangeUsername)
accountChangeUsername.addEventListener('click', () => {
  changeUsernamePopupText.value = document.querySelector('.username').innerText;
  changeUsernamePopup.style.transform = 'translate(-50%, -50%) scale(1)';
  overlay.style.display = 'unset';
  bread.style.pointerEvents = 'none';
});

if (changeUsernamePopup)
changeUsernamePopup.addEventListener('submit', event => {
  event.preventDefault();
  let cleanInput = removeWhitespace(changeUsernamePopupText.value);
  changeUsernamePopupText.value = cleanInput;
  if (cleanInput === '' || cleanInput === null) {
    if (!blockList.includes(changeUsernamePopup))
    blockList.push(changeUsernamePopup);
    createErrorSuccess(errNoUsername);
    return;
  }

  if (cleanInput.length > 26) {
    if (!blockList.includes(changeUsernamePopup))
    blockList.push(changeUsernamePopup);
    createErrorSuccess(errUsernameLong);
    return;
  }

  const username = document.querySelector('.username');
  if (cleanInput === username.innerText) {
    if (!blockList.includes(changeUsernamePopup))
    blockList.push(changeUsernamePopup);
    createErrorSuccess(errUsernameInUse);
    return;
  }

  generateThrobber();

  axios.post('/accounts/change-username', { username: cleanInput })
  .then(res => {
    removeThrobber();
    if (res.data.status === 200) {
      username.innerText = cleanInput;
      createErrorSuccess(res.data.message);
      changeUsernamePopupCancel.click();
    }
    else createErrorSuccess(res.data.message);
  })
  .catch(err => {
    removeThrobber();
    console.error(err);
    createErrorSuccess(errUsernameChangeFail);
  });
});

if (changeUsernamePopupCancel)
changeUsernamePopupCancel.addEventListener('click', () => {
  changeUsernamePopupText.value = null;
  changeUsernamePopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';
});

if (accountChangePassword)
accountChangePassword.addEventListener('click', event => {
  event.preventDefault();
  overlay.style.display = 'unset';
  changePasswordPopup.style.transform = 'translate(-50%, -50%) scale(1)';
  bread.style.pointerEvents = 'none';
});

if (changePasswordPopup)
changePasswordPopup.addEventListener('submit', event => {
  let target = event.currentTarget;
  event.preventDefault();

  if (newPassword.value !== confirmPassword.value) {
    newPassword.style.boxShadow = "0 0 0.44em 0.17em red";
    confirmPassword.style.boxShadow = "0 0 0.44em 0.17em red";
    if (!blockList.includes(changePasswordPopup))
    blockList.push(changePasswordPopup);
    createErrorSuccess(errPasswordUnmatch);
    return;
  }
  else if (currentPassword.value.length < 8) {
    currentPassword.style.boxShadow = "0 0 0.44em 0.17em red";
    if (!blockList.includes(changePasswordPopup))
    blockList.push(changePasswordPopup);
    createErrorSuccess(errPasswordShort);
    return;
  }
  else if (newPassword.value.length < 8) {
    newPassword.style.boxShadow = "0 0 0.44em 0.17em red";
    confirmPassword.style.boxShadow = "0 0 0.44em 0.17em red";
    if (!blockList.includes(changePasswordPopup))
    blockList.push(changePasswordPopup);
    createErrorSuccess(errPasswordShort);
    return;
  }

  let form = new FormData(target);

  generateThrobber();

  axios.post('/accounts/change-password', form)
  .then(res => {
    removeThrobber();
    if (res.data.status === 200) {
      blockList = blockList.filter(element => element !== changePasswordPopup);
      createErrorSuccess(res.data.message);
      changePasswordPopupCancel.click();
    }
    else {
      if (!blockList.includes(changePasswordPopup))
      blockList.push(changePasswordPopup);
      createErrorSuccess(res.data.message);
    }
  })
  .catch(err => {
    removeThrobber();
    console.error(err);
    if (!blockList.includes(changePasswordPopup))
    blockList.push(changePasswordPopup);
    createErrorSuccess(errAccChangePassWordFail);
  });
});

if (showCurrentPassword)
showCurrentPassword.addEventListener('click', event => {
  let target = event.currentTarget;
  target.classList.toggle('show');

  if (target.classList.contains('show')) {
    showCurrentPasswordImage.src = '/images/hide-password.png';
    target.setAttribute('title', 'Hide password');
    currentPassword.type = 'text';
  } else {
    showCurrentPasswordImage.src = '/images/show-password.png';
    target.setAttribute('title', 'Show password');
    currentPassword.type = 'password';
  }
});

if (showNewPassword)
showNewPassword.addEventListener('click', event => {
  let target = event.currentTarget;
  target.classList.toggle('show');

  if (target.classList.contains('show')) {
    showNewPasswordImage.src = '/images/hide-password.png';
    target.setAttribute('title', 'Hide password');
    newPassword.type = 'text';
  } else {
    showNewPasswordImage.src = '/images/show-password.png';
    target.setAttribute('title', 'Show password');
    newPassword.type = 'password';
  }
});

if (showConfirmPassword)
showConfirmPassword.addEventListener('click', event => {
  let target = event.currentTarget;
  target.classList.toggle('show');

  if (target.classList.contains('show')) {
    showConfirmPasswordImage.src = '/images/hide-password.png';
    target.setAttribute('title', 'Hide password');
    confirmPassword.type = 'text';
  } else {
    showConfirmPasswordImage.src = '/images/show-password.png';
    target.setAttribute('title', 'Show password');
    confirmPassword.type = 'password';
  }
});

if (changePasswordPopupCancel)
changePasswordPopupCancel.addEventListener('click', () => {
  changePasswordPopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';

  changePasswordPopupText.forEach(input => {
    input.value = null;
    input.style.boxShadow = "0 0 0.17em 0.11em var(--accent-color)";
  });

  if (showCurrentPassword.classList.contains('show')) {
    showCurrentPasswordImage.src = '/images/show-password.png';
    showCurrentPassword.setAttribute('title', 'Show password');
    currentPassword.type = 'password';
  }

  if (showNewPassword.classList.contains('show')) {
    showNewPasswordImage.src = '/images/show-password.png';
    showNewPassword.setAttribute('title', 'Show password');
    newPassword.type = 'password';
  }

  if (showConfirmPassword.classList.contains('show')) {
    showConfirmPasswordImage.src = '/images/show-password.png';
    showConfirmPassword.setAttribute('title', 'Show password');
    confirmPassword.type = 'password';
  }
});
