import '../css/main.css';

//VARS AND SELECTORS
const errAccChangePassWordFail = 'Failed to change account password, please try again'
const errAccDeleteFail = 'Failed to delete account, please try again';
const errAccLogoutFail = 'Failed to log out of account, please try again';
const errUsernameChangeFail = 'Failed to change username, please try again';
const errUsernameInUse = 'Username is already in use';
const errNoUsername = 'No username entered';
const errUsernameLong = 'Username is too long';
const errNoteExists = 'Note already exists in this topic';
const errTopicExists = 'Topic already exists in this section';
const errSectionExists = 'Section already exists in this subject';
const errSubjectExists = 'Subject already exists';
const errTopicLong = 'Topic is too long';
const errSectionLong = 'Section is too long';
const errSubjectLong = 'Subject is too long';
const errNoTopic = 'No topic entered';
const errNoSection = 'No section entered';
const errNoSubject = 'No subject entered';
const errNoNoteTopic = 'Please select a topic from the navigation bar first';
const errMicPermDenied = 'Allow the use of microphone to record a voice note';
const errPasswordUnmatch = 'Passwords do not match';
const errPasswordShort = 'Password must be at least 8 characters long';
const errSubjectAddFail = 'Failed to add subject, please try again';
const errSubjectEditFail = 'Failed to change subject name, please try again';
const errSubjectDeleteFail = 'Failed to delete subject, please try again';
const errSectionAddFail = 'Failed to add section, please try again';
const errSectionEditFail = 'Failed to change section name, please try again';
const errSectionDeleteFail = 'Failed to delete section, please try again';
const errTopicDeleteFail = 'Failed to delete topic, please try again';
const errTopicEditFail = 'Failed to change topic name, please try again';
const errNoteDeleteFail = 'Failed to delete note, please try again';
const errTopicAddFail = 'Failed to add topic, please try again';
const errNoteAddFail = 'Failed to add note, please try again';
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
const manipulateNotes = document.querySelector('.manipulate-notes');
const addTextNotes = document.querySelector('.add-text-note');
const addVoiceNotes = document.querySelector('.add-voice-note');
const deleteTopic = document.querySelector('.delete-topic');
const editTopic = document.querySelector('.edit-topic');
const notesForm = document.querySelector('.text-notes-form');
const deleteNote = document.querySelectorAll('.delete-note');
const editTextNote = document.querySelectorAll('.edit-note.edit-text');
const editVoiceNote = document.querySelectorAll('.edit-note.edit-voice');
const audioPlayerContainers = document.querySelectorAll(".audio-player-container");
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
const subjectToggles = document.querySelectorAll('.subject-toggle');
const sectionTopics = document.querySelectorAll('.section__topic');
const sectionToggles = document.querySelectorAll('.section-toggle');
const subjectsContainer = document.querySelector('.subjects-container');
const addSubject = document.querySelector('.subject-add');
const subjectsPopup = document.querySelector('.subjects-popup');
const subjectsPopupText = document.querySelector('.subjects-popup__text');
const subjectsPopupCancel = document.querySelector('.subjects-popup-btn__cancel');
const addTopics= document.querySelectorAll('.topic-add');
const topicsPopup = document.querySelector('.topics-popup');
const topicsPopupText = document.querySelector('.topics-popup__text');
const topicsPopupSubjectName = document.querySelector('.topics-popup input[name="subject_name"]');
const topicsPopupSectionName = document.querySelector('.topics-popup input[name="section_name"]');
const topicsPopupCancel = document.querySelector('.topics-popup-btn__cancel');
const addSections = document.querySelectorAll('.section-add');
const sectionsPopup = document.querySelector('.sections-popup');
const sectionsPopupText = document.querySelector('.sections-popup__text');
const sectionsPopupCancel = document.querySelector('.sections-popup-btn__cancel');
const sectionsPopupSubjectName = document.querySelector('.sections-popup input[name="subject_name"]');
const subjectEdits = document.querySelectorAll('.subject-edit');
const editSubjectsPopup = document.querySelector('.edit-subjects-popup');
const editSubjectsPopupText = document.querySelector('.edit-subjects-popup__text');
const editSubjectsPopupFormerName = document.querySelector('.edit-subjects-popup input[name="former_subject_name"]');
const editSubjectsPopupCancel = document.querySelector('.edit-subjects-popup-btn__cancel');
const subjectDeletes = document.querySelectorAll('.subject-delete');
const sectionEdits = document.querySelectorAll('.section-edit');
const sectionDeletes = document.querySelectorAll('.section-delete');
const editSectionsPopup = document.querySelector('.edit-sections-popup');
const editSectionsPopupText = document.querySelector('.edit-sections-popup__text');
const editSectionsPopupFormerName = document.querySelector('.edit-sections-popup input[name="former_section_name"]');
const editSectionsPopupSubjectName = document.querySelector('.edit-sections-popup input[name="subject_name"]');
const editSectionsPopupCancel = document.querySelector('.edit-sections-popup-btn__cancel');
const editTopicsPopup = document.querySelector('.edit-topics-popup');
const editTopicsPopupFormerName = document.querySelector('.edit-topics-popup input[name="former_topic_name"]');
const editTopicsPopupText = document.querySelector('.edit-topics-popup__text');
const editTopicsPopupCancel = document.querySelector('.edit-topics-popup-btn__cancel');
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
function convTime(seconds) {
  if (isFinite(seconds)) {
    if (seconds < 3600 ) return new Date(seconds * 1000).toISOString().substr(14, 5);
    else return new Date(seconds * 1000).toISOString().substr(11, 8);
  } else return seconds
}

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

function generateCreationTime() {
  let dateTime = new Date();
  let isoDateTime = dateTime.toISOString().replace('T', ' ').substr(0,19);
  let isoDateTimeArr = isoDateTime.split(' ');
  let localeHour = dateTime.getHours().toString();
  localeHour = localeHour.length === 1 ? '0' + localeHour : localeHour;
  let isoTimeArr = isoDateTimeArr[1].split(':')
  isoTimeArr[0] = localeHour;
  isoDateTimeArr[1] = isoTimeArr.join(':');
  return isoDateTimeArr.join(' ');
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

function generateTextNotesForm() {
  let newNotesForm = document.createElement('form');
  newNotesForm.setAttribute('method', 'post');
  newNotesForm.setAttribute('action', '/subjects/sections/topics/notes/add');
  newNotesForm.classList.add('text-notes-form');

  let entryNameContainer = document.createElement('div');
  entryNameContainer.classList.add('entry-name-container');

  let entryNameLabel = document.createElement('label');
  entryNameLabel.setAttribute('for', 'entry_name');
  entryNameLabel.innerText = "Entry name:";
  entryNameLabel.classList.add('entry-name-label');

  let entryName = document.createElement('input');
  entryName.setAttribute('name', 'entry_name');
  entryName.setAttribute('required', 'true');
  entryName.classList.add('entry-name');
  entryName.addEventListener('keypress', event => {
    if (event.keyCode === 13) event.preventDefault();
  });

  entryNameContainer.append(entryNameLabel, entryName);

  let textArea = document.createElement('textarea');
  textArea.setAttribute('name', 'text_note_entry');

  let textNotesButtonContainer = document.createElement('div');
  textNotesButtonContainer.classList.add('text-notes-button-container');

  let cancelButton = document.createElement('button');
  cancelButton.setAttribute('type', 'button');
  cancelButton.classList.add('notes-cancel');
  cancelButton.innerText = "Cancel";

  let submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('notes-save');
  submitButton.innerText = "Save";

  cancelButton.addEventListener('click', event => {
    let target = event.currentTarget;

    let defaultNotesForm = document.createElement('form');
    defaultNotesForm.setAttribute('method', 'post');
    defaultNotesForm.setAttribute('action', '/subjects/sections/topics/notes/add');
    defaultNotesForm.classList.add('text-notes-form');

    target.parentElement.parentElement.replaceWith(defaultNotesForm);
  });

  textNotesButtonContainer.append(cancelButton, submitButton);
  newNotesForm.append(entryNameContainer, textArea, textNotesButtonContainer);

  return newNotesForm;
}

function generateTextNote(createdAt, entryName, data) {
  let textNote = document.createElement('div');
  textNote.classList.add('text-note');

  let creationTime = document.createElement('p');
  creationTime.classList.add('creation-time');
  creationTime.innerText = createdAt || generateCreationTime();

  let noteEdit = document.createElement('button');
  noteEdit.classList.add('edit-note');
  noteEdit.classList.add('edit-text');
  noteEdit.setAttribute('title', 'Edit note');
  noteEdit.setAttribute('aria-label', 'Edit note');
  let noteEditImage = document.createElement('img');
  noteEditImage.classList.add('edit-note__image');
  noteEditImage.setAttribute('alt', '');
  noteEditImage.src = '/images/edit.png';
  noteEdit.appendChild(noteEditImage);
  noteEdit.addEventListener('click', editTextNoteHandler);

  let noteDelete = document.createElement('button');
  noteDelete.classList.add('delete-note');
  noteDelete.setAttribute('title', 'Delete note');
  noteDelete.setAttribute('aria-label', 'Delete note');
  let noteDeleteImage = document.createElement('img');
  noteDeleteImage.classList.add('delete-note__image');
  noteDeleteImage.classList.add('delete-note__image');
  noteDeleteImage.setAttribute('alt', '');
  noteDeleteImage.setAttribute('aria-label', 'Delete note');
  noteDeleteImage.src = '/images/dustbin.png';
  noteDelete.appendChild(noteDeleteImage);
  noteDelete.addEventListener('click', event => {
    let target = event.currentTarget;
    let yesCallback = () => {
      generateThrobber();

      import('axios').then(axios => {
        axios = axios.default;

        axios.post('/subjects/sections/topics/notes/delete', {
          topic_id: new URL(window.location.href).search.slice(4),
          entry_name: entryName
        })
        .then(res => {
          removeThrobber();
          if (res.data.status === 200) {
            target.parentElement.remove();
            createErrorSuccess(res.data.message);
          }
          else createErrorSuccess(res.data.message);
        })
        .catch(err => {
          removeThrobber();
          console.error(err);
          createErrorSuccess(errNoteDeleteFail);
        });
      });
    };
    confirmAction(yesCallback);
  });

  let noteName = document.createElement('p');
  noteName.classList.add('note-name');
  noteName.innerText = entryName;

  let noteBody = document.createElement('div');
  noteBody.classList.add('note-body');
  noteBody.innerHTML = data;

  textNote.append(creationTime, noteEdit, noteDelete, noteName, noteBody);

  return textNote;
}

function generateVoiceNote(createdAt, entryName, audioURL) {
  let voiceNote = document.createElement('div');
  voiceNote.classList.add('voice-note');

  let creationTime = document.createElement('p');
  creationTime.classList.add('creation-time');
  creationTime.innerText = createdAt || generateCreationTime();

  let noteEdit = document.createElement('button');
  noteEdit.classList.add('edit-note');
  noteEdit.classList.add('edit-voice');
  noteEdit.setAttribute('title', 'Edit note');
  noteEdit.setAttribute('aria-label', 'Edit note');
  let noteEditImage = document.createElement('img');
  noteEditImage.classList.add('edit-note__image');
  noteEditImage.setAttribute('alt', '');
  noteEditImage.src = '/images/edit.png';
  noteEdit.appendChild(noteEditImage);
  noteEdit.addEventListener('click', editVoiceNoteHandler);

  let noteDelete = document.createElement('button');
  noteDelete.classList.add('delete-note');
  noteDelete.setAttribute('title', 'Delete note');
  noteDelete.setAttribute('aria-label', 'Delete note');
  let noteDeleteImage = document.createElement('img');
  noteDeleteImage.classList.add('delete-note__image');
  noteDeleteImage.setAttribute('alt', '');
  noteDeleteImage.setAttribute('aria-label', 'Delete note');
  noteDeleteImage.src = '/images/dustbin.png';
  noteDelete.appendChild(noteDeleteImage);
  noteDelete.addEventListener('click', event => {
    let target = event.currentTarget;
    let yesCallback = () => {
      generateThrobber();

      import('axios').then(axios => {
        axios = axios.default;

        axios.post('/subjects/sections/topics/notes/delete', {
          topic_id: new URL(window.location.href).search.slice(4),
          entry_name: entryName
        })
        .then(res => {
          removeThrobber();
          if (res.data.status === 200) {
            target.parentElement.remove();
            createErrorSuccess(res.data.message);
          }
          else createErrorSuccess(res.data.message);
        })
        .catch(err => {
          removeThrobber();
          console.error(err);
          createErrorSuccess(errNoteDeleteFail);
        });
      });
    };
    confirmAction(yesCallback);
  });

  let noteName = document.createElement('p');
  noteName.classList.add('note-name');
  noteName.innerText = entryName;

  let audioPlayerContainer = document.createElement('div');
  audioPlayerContainer.classList.add('audio-player-container');

  let audioPlayer = document.createElement('audio');
  audioPlayer.classList.add('audio__player');
  audioPlayer.src = audioURL;

  let audioSeekBar = document.createElement('div');
  audioSeekBar.classList.add('audio__seek-bar');
  let audioSeek = document.createElement('div');
  audioSeek.classList.add('audio__seek');
  audioSeekBar.appendChild(audioSeek);
  audioSeekBar.addEventListener('click', event => {
    audioPlayer.currentTime  = event.offsetX / audioSeekBar.offsetWidth * audioPlayer.duration;
  });

  let audioTime = document.createElement('div');
  audioTime.classList.add('audio__time');
  let audioCurrentTime = document.createElement('span');
  audioCurrentTime.classList.add('current-time');
  audioCurrentTime.innerText = '00:00';
  let audioDuration = document.createElement('span');
  audioDuration.classList.add('duration');
  audioDuration.innerText = '00:00';
  audioTime.append(audioCurrentTime, document.createTextNode('/'), audioDuration);

  let audioActions = document.createElement('div');
  audioActions.classList.add('audio-actions');

  let audioPlayPause = document.createElement('button');
  audioPlayPause.classList.add('audio__play_pause');
  audioPlayPause.setAttribute('type', 'button');
  audioPlayPause.setAttribute('title', 'Play/Pause');
  audioPlayPause.setAttribute('aria-label', 'Play/Pause');
  let d = document.createElement('div');
  let i = document.createElement('img');
  i.src = '/images/play_pause.png';
  d.appendChild(i);
  audioPlayPause.appendChild(d);
  audioPlayPause.addEventListener('click', () => {
    if (audioPlayer.paused) audioPlayer.play();
    else audioPlayer.pause();
  });

  let audioStop = document.createElement('button');
  audioStop.classList.add('audio__stop');
  audioStop.setAttribute('type', 'button');
  audioStop.setAttribute('title', 'Stop');
  audioStop.setAttribute('aria-label', 'Stop');
  let d2 = document.createElement('div');
  let i2 = document.createElement('img');
  i2.src = '/images/stop.png';
  d2.appendChild(i2);
  audioStop.appendChild(d2);
  audioStop.addEventListener('click', () => {
    if (!audioPlayer.paused) audioPlayer.pause();
    audioPlayer.currentTime = 0;
  });

  audioPlayer.addEventListener('timeupdate', () => {
    audioCurrentTime.innerText = convTime(audioPlayer.currentTime);
    audioDuration.innerText = convTime(audioPlayer.duration);
    audioSeek.style.width = `${audioPlayer.currentTime/audioPlayer.duration * 100}%`;
  });

  audioPlayer.currentTime = Math.random() * 10000;
  audioDuration.innerText = convTime(audioPlayer.duration);

  audioActions.append(audioPlayPause, audioStop);
  audioPlayerContainer.append(audioPlayer, audioSeekBar, audioTime, audioActions);
  voiceNote.append(creationTime, noteEdit, noteDelete, noteName, audioPlayerContainer);

  return voiceNote;
}

function generateAudioActionsContainer(audioURL) {
  let audioActionsContainer = document.createElement('div');
  audioActionsContainer.classList.add('audio-actions-container');

  let audioNotesEntry = document.createElement('audio');
  audioNotesEntry.classList.add('audio-notes-entry');
  audioNotesEntry.controls = true;
  audioNotesEntry.src = audioURL;

  let audioActionsBtns = document.createElement('div');
  audioActionsBtns.classList.add('audio-actions__btns');

  let audioBtnDiscard = document.createElement('button');
  audioBtnDiscard.setAttribute('type', 'button');
  audioBtnDiscard.classList.add('audio-btn__discard', 'btn');
  audioBtnDiscard.innerText = "Discard";
  audioBtnDiscard.addEventListener('click', event => {
    audioActionsContainer.replaceWith(generateRecordingContainer());
  });

  let audioBtnSave = document.createElement('button');
  audioBtnSave.setAttribute('type', 'submit');
  audioBtnSave.classList.add('audio-btn__save', 'btn');
  audioBtnSave.innerText = "Save";

  audioActionsBtns.append(audioBtnDiscard, audioBtnSave);
  audioActionsContainer.append(audioNotesEntry, audioActionsBtns);

  return audioActionsContainer;
}

function generateRecordingContainer() {
  let recordingContainer = document.createElement('div');
  recordingContainer.classList.add('recording-container');

  let audioRecordButton = document.createElement('button');
  audioRecordButton.setAttribute('type', 'button');
  audioRecordButton.classList.add('audio-record-button');
  audioRecordButton.appendChild(document.createElement('div'));

  let mediaRecorder;
  let audioBlob;
  audioRecordButton.addEventListener('click', event => {
    audioRecordButton.classList.toggle('recording');

    if (audioRecordButton.classList.contains('recording')) {
      recordingInfo.innerText = "Please wait...";

      navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .then(audioStream => {
        recordingInfo.innerText = "Stop recording";

        mediaRecorder = new MediaRecorder(audioStream);
        let mediaRecorderChunks = [];
        mediaRecorder.start();

        mediaRecorder.addEventListener('dataavailable', event => {
          mediaRecorderChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', event => {
          audioBlob = mediaRecorderChunks.pop();

          let fileReader = new FileReader;
          fileReader.onloadend = event => {
            let audioURL = event.currentTarget.result;

            let audioActionsContainer = generateAudioActionsContainer(audioURL);
            recordingContainer.replaceWith(audioActionsContainer);
          };
          fileReader.readAsDataURL(audioBlob);
        });
      })
      .catch(err => {
        console.error(err);
        recordingContainer.remove();
        createErrorSuccess(errMicPermDenied);
      });
    } else {
      mediaRecorder.stop()
      recordingInfo.innerText = "Please wait...";
    }
  });

  let recordingInfo = document.createElement('p');
  recordingInfo.classList.add('recording-info');
  recordingInfo.innerText = "Start recording";

  recordingContainer.append(audioRecordButton, recordingInfo);
  return recordingContainer;
}

function generateVoiceNotesForm() {
  let newNotesForm = document.createElement('form');
  newNotesForm.setAttribute('method', 'post');
  newNotesForm.setAttribute('action', '/subjects/sections/topics/notes/add');
  newNotesForm.classList.add('voice-notes-form');

  let newAudioEntryContainer = document.createElement('div');
  newAudioEntryContainer.classList.add('audio-entry-container');

  let entryNameContainer = document.createElement('div');
  entryNameContainer.classList.add('entry-name-container');

  let entryNameLabel = document.createElement('label');
  entryNameLabel.setAttribute('for', 'entry_name');
  entryNameLabel.innerText = "Entry name:";
  entryNameLabel.classList.add('entry-name-label');

  let entryName = document.createElement('input');
  entryName.setAttribute('name', 'entry_name');
  entryName.setAttribute('required', 'true');
  entryName.classList.add('entry-name');
  entryName.addEventListener('keypress', event => {
    if (event.keyCode === 13) event.preventDefault();
  });

  entryNameContainer.append(entryNameLabel, entryName);

  let cancelButton = document.createElement('button');
  cancelButton.setAttribute('type', 'button');
  cancelButton.classList.add('notes-cancel');
  cancelButton.innerText = "Cancel";
  cancelButton.addEventListener('click', event => {
    let defaultNotesForm = document.createElement('form');
    defaultNotesForm.setAttribute('method', 'post');
    defaultNotesForm.setAttribute('action', '/subjects/sections/topics/notes/add');
    defaultNotesForm.classList.add('voice-notes-form');

    newNotesForm.replaceWith(defaultNotesForm);
  });

  newAudioEntryContainer.append(entryNameContainer, cancelButton);

  newNotesForm.append(newAudioEntryContainer);

  return newNotesForm;
}

function generateSubjectContainer(subject) {
  let subjectContainer = document.createElement('div');
  subjectContainer.classList.add('subject-container');

  let subjectInfo = document.createElement('div');
  subjectInfo.classList.add('subject-info');

  let subjectName = document.createElement('p');
  subjectName.classList.add('subject-name');
  subjectName.innerText = subject;

  let subjectActions = document.createElement('div');
  subjectActions.classList.add('subject-actions');

  let subjectToggle = document.createElement('div');
  subjectToggle.classList.add('subject-toggle');
  subjectToggle.setAttribute('title', 'Show sections');
  subjectToggle.addEventListener('click', () => {
    subjectToggle.classList.toggle('show');
    subjectContainer.classList.toggle('show');
    if (subjectToggle.classList.contains('show')) subjectToggle.setAttribute('title', 'Hide sections');
    else subjectToggle.setAttribute('title', 'Show sections');
  });

  let addSection = document.createElement('div');
  addSection.classList.add('section-add');
  addSection.setAttribute('title', 'Add section');
  addSection.appendChild(document.createElement('div'));
  addSection.addEventListener('click', event => {
    sectionsPopupSubjectName.value = subjectName.innerText;
    sectionsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });

  let subjectEdit = document.createElement('div');
  subjectEdit.classList.add('subject-edit');
  subjectEdit.setAttribute('title', 'Edit subject name');

  let subjectEditImage = document.createElement('img');
  subjectEditImage.setAttribute('src', '/images/edit_white.png');
  subjectEditImage.setAttribute('alt', '');
  subjectEditImage.addEventListener('click', event => {
    editSubjectsPopupFormerName.value = subjectName.innerText;
    editSubjectsPopupText.value = subjectName.innerText;
    editSubjectsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });
  subjectEdit.appendChild(subjectEditImage);

  let subjectDelete = document.createElement('div');
  subjectDelete.classList.add('subject-delete');
  subjectDelete.setAttribute('title', 'Delete subject');

  let subjectDeleteImage = document.createElement('img');
  subjectDeleteImage.setAttribute('src', '/images/dustbin_white.png');
  subjectDeleteImage.setAttribute('alt', '');
  subjectDeleteImage.addEventListener('click', () => {
    let yesCallback = () => {
      generateThrobber();

      import('axios').then(axios => {
        axios = axios.default;

        axios.post('/subjects/delete', { subject_name: subjectName.innerText })
        .then(res => {
          removeThrobber();
          if (res.data.status === 200) {
            subjectContainer.remove();
            createErrorSuccess(res.data.message);
          }
          else createErrorSuccess(res.data.message);
        })
        .catch(err =>{
          removeThrobber();
          console.error(err);
          createErrorSuccess(errSubjectDeleteFail);
        });
      });
    };
    confirmAction(yesCallback);
  });
  subjectDelete.appendChild(subjectDeleteImage);

  subjectActions.append(subjectToggle, addSection, subjectEdit, subjectDelete);
  subjectInfo.append(subjectName, subjectActions);
  subjectContainer.appendChild(subjectInfo);

  return subjectContainer;
}

function generateSubjectSection(section) {
  let subjectSection = document.createElement('div');
  subjectSection.classList.add('subject__section');

  let sectionInfo = document.createElement('div');
  sectionInfo.classList.add('section-info');

  let subjectSectionName = document.createElement('p');
  subjectSectionName.classList.add('subject-section__name');
  subjectSectionName.innerText = section;

  let sectionActions = document.createElement('div');
  sectionActions.classList.add('section-actions');

  let sectionToggle = document.createElement('div');
  sectionToggle.classList.add('section-toggle');
  sectionToggle.setAttribute('title', 'Show topics');
  sectionToggle.addEventListener('click', () => {
    sectionToggle.classList.toggle('show');
    subjectSection.classList.toggle('show');
    if (sectionToggle.classList.contains('show')) sectionToggle.setAttribute('title', 'Hide topics');
    else sectionToggle.setAttribute('title', 'Show topics');
  });

  let addTopic = document.createElement('div');
  addTopic.classList.add('topic-add');
  addTopic.setAttribute('title', 'Add topic');
  addTopic.appendChild(document.createElement('div'));
  addTopic.addEventListener('click', event => {
    let target = event.currentTarget;
    outerLoop: for (let child of target.parentElement.parentElement.parentElement.parentElement.children) {
      if (child.classList.contains('subject-info')) {
        innerLoop: for (let lowerChild of child.children) {
          if (lowerChild.classList.contains('subject-name')) {
            topicsPopupSubjectName.value = lowerChild.innerText;
            break outerLoop;
          }
        }
      }
    }
    topicsPopupSectionName.value = subjectSectionName.innerText;
    topicsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });

  let sectionEdit = document.createElement('div');
  sectionEdit.classList.add('section-edit');
  sectionEdit.setAttribute('title', 'Edit section name');

  let sectionEditImage = document.createElement('img');
  sectionEditImage.setAttribute('src', '/images/edit.png');
  sectionEditImage.setAttribute('alt', '');
  sectionEdit.appendChild(sectionEditImage);
  sectionEdit.addEventListener('click', event => {
    let target = event.currentTarget;

    editSectionsPopupFormerName.value = subjectSectionName.innerText;
    editSectionsPopupText.value = subjectSectionName.innerText;

    outerLoop: for (let child of target.parentElement.parentElement.parentElement.parentElement.children) {
      if (child.classList.contains('subject-info')) {
        innerLoop: for (let lowerChild of child.children) {
          if (lowerChild.classList.contains('subject-name')) {
            editSectionsPopupSubjectName.value = lowerChild.innerText;
            break outerLoop;
          }
        }
      }
    }
    editSectionsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });

  let sectionDelete = document.createElement('div');
  sectionDelete.classList.add('section-delete');
  sectionDelete.setAttribute('title', 'Delete section');

  let sectionDeleteImage = document.createElement('img');
  sectionDeleteImage.setAttribute('src', '/images/dustbin.png');
  sectionDeleteImage.setAttribute('alt', '');
  sectionDelete.addEventListener('click', event => {
    let target = event.currentTarget;
    let yesCallback = () => {
      let sectionName = subjectSectionName.innerText;
      let subjectName;
      outerLoop: for (let child of target.parentElement.parentElement.parentElement.parentElement.children) {
        if (child.classList.contains('subject-info')) {
          innerLoop: for (let lowerChild of child.children) {
            if (lowerChild.classList.contains('subject-name')) {
              subjectName = lowerChild.innerText;
              break outerLoop;
            }
          }
        }
      }
      generateThrobber();

      import('axios').then(axios => {
        axios = axios.default;

        axios.post('/subjects/sections/delete', {
          subject_name: subjectName,
          section_name: sectionName
        })
        .then(res => {
          removeThrobber();
          if (res.data.status === 200) {
            subjectSection.remove();
            createErrorSuccess(res.data.message);
          }
          else createErrorSuccess(res.data.message);
        })
        .catch(err => {
          removeThrobber();
          console.error(err);
          createErrorSuccess(errSectionDeleteFail);
        });
      });
    };
    confirmAction(yesCallback);
  });
  sectionDelete.appendChild(sectionDeleteImage);

  sectionActions.append(sectionToggle, addTopic, sectionEdit, sectionDelete);
  sectionInfo.append(subjectSectionName, sectionActions);
  subjectSection.appendChild(sectionInfo);

  return subjectSection;
}

function generateSectionTopic(topic, topicId) {
  let sectionTopic = document.createElement('div');
  sectionTopic.classList.add('section__topic');

  let sectionTopicName = document.createElement('a');
  sectionTopicName.classList.add('section-topic__name');
  sectionTopicName.setAttribute('href', `/subjects/sections/topics/${generateTopicLink(topic, topicId)}`);
  sectionTopicName.innerText = topic;

  sectionTopic.appendChild(sectionTopicName);
  sectionTopic.addEventListener('click', () => {
    sectionTopicName.click();
  });

  return sectionTopic;
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

// EVENT HANDLERS

function editTextNoteHandler(event) {
  let originalTarget = event.currentTarget;
  event.preventDefault();

  let editableEntryName;
  let editableCreationTime;
  for (let element of originalTarget.parentElement.children) {
    if (element.classList.contains('creation-time'))
    editableCreationTime = element.innerText;
    else if (element.classList.contains('note-name'))
    editableEntryName = element.innerText;
  }
  let editableChildren = Array.from(originalTarget.parentElement.children);
  editableChildren.splice(0,4);

  let editableData = '';
  editableChildren.forEach(child => {
    editableData += child.innerHTML;
  });

  let currentNotesForm = document.querySelector('.text-notes-form');
  let newNotesForm = generateTextNotesForm();
  currentNotesForm.replaceWith(newNotesForm);

  CKEDITOR.replace('text_note_entry');
  CKEDITOR.instances['text_note_entry'].setData(editableData);
  document.querySelector('.text-notes-form .notes-save').onclick = () => CKEDITOR.instances['text_note_entry'].updateElement();

  document.querySelector('.text-notes-form .entry-name').value = editableEntryName;

  newNotesForm.addEventListener('submit', event => {
    event.preventDefault();
    let form = new FormData(newNotesForm);
    form.set('entry_name', removeWhitespace(form.get('entry_name')));
    form.append('topic_id', new URL(window.location.href).search.slice(4));
    form.append('former_entry_name', editableEntryName);

    for (let noteName of document.querySelectorAll('.note-name'))
    if (noteName.innerText === form.get('entry_name') && form.get('entry_name') !== form.get('former_entry_name')) {
      createErrorSuccess(errNoteExists);
      return;
    }

    generateThrobber();

    import('axios').then(axios => {
      axios = axios.default;

      axios.post('/subjects/sections/topics/notes/edit', form)
      .then(res => {
        removeThrobber();
        if (res.data.status === 200) {
          let textNote = generateTextNote(editableCreationTime, form.get('entry_name'), form.get('text_note_entry'));
          originalTarget.parentElement.replaceWith(textNote);
          document.querySelector('.text-notes-form .notes-cancel').click();
          createErrorSuccess(res.data.message);
        }
        else createErrorSuccess(res.data.message);
      })
      .catch(err => {
        removeThrobber();
        console.error(err);
        createErrorSuccess(errNoteAddFail);
      });
    });
  });
  window.scroll(newNotesForm.offsetLeft, newNotesForm.offsetTop);
}

function editVoiceNoteHandler(event) {
  let originalTarget = event.currentTarget;

  let editableEntryName;
  let editableCreationTime;
  let audioURL;

  for (let element of originalTarget.parentElement.children) {
    if (element.classList.contains('creation-time'))
    editableCreationTime = element.innerText;
    else if (element.classList.contains('note-name'))
    editableEntryName = element.innerText;
    else if (element.classList.contains('audio-player-container'))
    for (let child of element.children)
    if (child.classList.contains('audio__player'))
    audioURL = child.src;
  }

  let currentNotesForm = document.querySelector('.voice-notes-form');
  let newNotesForm = generateVoiceNotesForm();
  currentNotesForm.replaceWith(newNotesForm);

  let audioEntryContainer = document.querySelector('.audio-entry-container');
  let cancelButton = document.querySelector('.voice-notes-form .notes-cancel');
  let audioActionsContainer = generateAudioActionsContainer(audioURL);

  audioEntryContainer.insertBefore(audioActionsContainer, cancelButton);

  document.querySelector('.voice-notes-form .entry-name').value = editableEntryName;

  newNotesForm.addEventListener('submit', event => {
    let target = event.currentTarget;
    event.preventDefault();

    let voiceNoteEntry = document.querySelector('.audio-notes-entry').src;

    let form = new FormData(target);
    form.set('entry_name', removeWhitespace(form.get('entry_name')));
    form.append('voice_note_entry', voiceNoteEntry);
    form.append('topic_id', new URL(window.location.href).search.slice(4));
    form.append('former_entry_name', editableEntryName);

    for (let noteName of document.querySelectorAll('.note-name'))
    if (noteName.innerText === form.get('entry_name') && form.get('entry_name') !== form.get('former_entry_name')) {
      createErrorSuccess(errNoteExists);
      return;
    }

    generateThrobber();

    import('axios').then(axios => {
      axios = axios.default;

      axios.post('/subjects/sections/topics/notes/edit', form)
      .then(res => {
        removeThrobber();
        if (res.data.status === 200) {
          let voiceNote = generateVoiceNote(editableCreationTime, form.get('entry_name'), voiceNoteEntry);
          originalTarget.parentElement.replaceWith(voiceNote);
          cancelButton.click();
          createErrorSuccess(res.data.message);
        }
        else createErrorSuccess(res.data.message);
      })
      .catch(err => {
        removeThrobber();
        console.error(err);
        createErrorSuccess(errNoteAddFail);
      });
    });
  });
  window.scroll(newNotesForm.offsetLeft, newNotesForm.offsetTop);
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

    import('axios').then(axios => {
      axios = axios.default;

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
    });
  };
  confirmAction(yesCallback);
});

if (accountLogout)
accountLogout.addEventListener('click', () => {
  let yesCallback = () => {
    generateThrobber();

    import('axios').then(axios => {
      axios = axios.default;

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
    });
  }
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

  import('axios').then(axios => {
    axios = axios.default;

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

  import('axios').then(axios => {
    axios = axios.default;

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

if (addTextNotes)
addTextNotes.addEventListener('click', () => {
  let currentNotesForm = document.querySelector('.text-notes-form');
  let newNotesForm = generateTextNotesForm();
  currentNotesForm.replaceWith(newNotesForm);

  CKEDITOR.replace('text_note_entry');
  document.querySelector('.text-notes-form .notes-save').onclick = () => CKEDITOR.instances['text_note_entry'].updateElement();

  newNotesForm.addEventListener('submit', event => {
    let target = event.currentTarget;
    event.preventDefault();

    let form = new FormData(target);
    form.set('entry_name', removeWhitespace(form.get('entry_name')));
    form.append('topic_id', new URL(window.location.href).search.slice(4));

    for (let noteName of document.querySelectorAll('.note-name'))
    if (noteName.innerText === form.get('entry_name')) {
      createErrorSuccess(errNoteExists);
      return;
    }

    generateThrobber();

    import('axios').then(axios => {
      axios = axios.default;

      axios.post('/subjects/sections/topics/notes/add', form)
      .then(res => {
        removeThrobber();
        if (res.data.status === 201) {
          let textNote = generateTextNote(null, form.get('entry_name'), form.get('text_note_entry'));
          document.querySelector('.text-notes').appendChild(textNote);
          document.querySelector('.text-notes-form .notes-cancel').click();
          createErrorSuccess(res.data.message);
        }
        else createErrorSuccess(res.data.message);
      })
      .catch(err => {
        removeThrobber();
        console.error(err);
        createErrorSuccess(errNoteAddFail);
      });
    });
  });

  window.scroll(newNotesForm.offsetLeft, newNotesForm.offsetTop);
});

if (addVoiceNotes)
addVoiceNotes.addEventListener('click', () => {
  let currentNotesForm = document.querySelector('.voice-notes-form');
  let newNotesForm = generateVoiceNotesForm();
  currentNotesForm.replaceWith(newNotesForm);

  let audioEntryContainer = document.querySelector('.audio-entry-container');
  let cancelButton = document.querySelector('.voice-notes-form .notes-cancel');
  let recordingContainer = generateRecordingContainer();

  audioEntryContainer.insertBefore(recordingContainer, cancelButton);

  newNotesForm.addEventListener('submit', event => {
    let target = event.currentTarget;
    event.preventDefault();

    let voiceNoteEntry = document.querySelector('.audio-notes-entry').src;

    let form = new FormData(target);
    form.set('entry_name', removeWhitespace(form.get('entry_name')));
    form.append('voice_note_entry', voiceNoteEntry);
    form.append('topic_id', new URL(window.location.href).search.slice(4));

    for (let noteName of document.querySelectorAll('.note-name'))
    if (noteName.innerText === form.get('entry_name')) {
      createErrorSuccess(errNoteExists);
      return;
    }

    generateThrobber();

    import('axios').then(axios => {
      axios = axios.default;

      axios.post('/subjects/sections/topics/notes/add', form)
      .then(res => {
        removeThrobber();
        if (res.data.status === 201) {
          let voiceNote = generateVoiceNote(null, form.get('entry_name'), voiceNoteEntry);
          document.querySelector('.voice-notes').appendChild(voiceNote);
          cancelButton.click();
          createErrorSuccess(res.data.message);
        }
        else createErrorSuccess(res.data.message);
      })
      .catch(err => {
        removeThrobber();
        console.error(err);
        createErrorSuccess(errNoteAddFail);
      });
    });
  });

  window.scroll(newNotesForm.offsetLeft, newNotesForm.offsetTop);
});

if (deleteTopic)
deleteTopic.addEventListener('click', () => {
  let yesCallback = () => {
    let topicId = new URL(window.location.href).search.slice(4);
    generateThrobber();

    import('axios').then(axios => {
      axios = axios.default;

      axios.post('/subjects/sections/topics/delete', { topic_id: topicId })
      .then(res => {
        removeThrobber();
        if (res.data.status === 200) {
          pruneSessionStorage([topicId]);
          window.location.href = '/';
        }
        else createErrorSuccess(res.data.message);
      })
      .catch(err => {
        removeThrobber();
        console.error(err);
        createErrorSuccess(errTopicDeleteFail);
      });
    });
  };
  confirmAction(yesCallback);
});

if (editTopic)
editTopic.addEventListener('click', event => {
  let currentTopicName = document.querySelector('.topic-name').innerText;
  editTopicsPopupFormerName.value = currentTopicName;
  editTopicsPopupText.value = currentTopicName;
  editTopicsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
  overlay.style.display = 'unset';
  bread.style.pointerEvents = 'none';
});

if (deleteNote)
deleteNote.forEach(element => {
  element.addEventListener('click', event => {
    let target = event.currentTarget;
    let yesCallback = () => {
      let entryName;
      for (let element of target.parentElement.children) {
        if (element.classList.contains('note-name')) {
          entryName = element.innerText;
          break;
        }
      }
      generateThrobber();

      import('axios').then(axios => {
        axios = axios.default;

        axios.post('/subjects/sections/topics/notes/delete', {
          topic_id: new URL(window.location.href).search.slice(4),
          entry_name: entryName
        })
        .then(res => {
          removeThrobber();
          if (res.data.status === 200) {
            target.parentElement.remove();
            createErrorSuccess(res.data.message);
          }
          else createErrorSuccess(res.data.message);
        })
        .catch(err => {
          removeThrobber();
          console.error(err);
          createErrorSuccess(errNoteDeleteFail);
        });
      });
    };
    confirmAction(yesCallback);
  });
});

if (editTextNote)
editTextNote.forEach(element => {
  element.addEventListener('click', editTextNoteHandler);
});

if (editVoiceNote)
editVoiceNote.forEach(element => {
  element.addEventListener('click', editVoiceNoteHandler);
});

if (audioPlayerContainers)
audioPlayerContainers.forEach(container => {
  let children = [];
  let audioPlayer;
  let audioSeekBar;
  let audioSeek;
  let audioCurrentTime;
  let audioDuration;
  let audioPlayPause;
  let audioStop;

  for (let element of container.children) {
    children.push(element);
    if (element.children.length > 0) {
      for (let child of element.children) {
        children.push(child);
      }
    }
  }

  for (let element of children) {
    switch (element.classList.value) {
      case 'audio__player':
        audioPlayer = element;
        break;
      case 'audio__seek-bar':
        audioSeekBar = element;
        break;
      case 'audio__seek':
        audioSeek = element;
        break;
      case 'current-time':
        audioCurrentTime = element;
        break;
      case 'duration':
        audioDuration = element;
        break;
      case 'audio__play_pause':
        audioPlayPause = element;
        break;
      case 'audio__stop':
        audioStop = element;
        break;
    }
  }

  audioPlayPause.addEventListener('click', () => {
    if (audioPlayer.paused) audioPlayer.play();
    else audioPlayer.pause();
  });

  audioStop.addEventListener('click', () => {
    if (!audioPlayer.paused) audioPlayer.pause();
    audioPlayer.currentTime = 0;
  });

  audioPlayer.addEventListener('timeupdate', () => {
    audioCurrentTime.innerText = convTime(audioPlayer.currentTime);
    audioDuration.innerText = convTime(audioPlayer.duration);
    audioSeek.style.width = `${audioPlayer.currentTime/audioPlayer.duration * 100}%`;
  });

  audioPlayer.currentTime = Math.random() * 10000;
  audioDuration.innerText = convTime(audioPlayer.duration);

  audioSeekBar.addEventListener('click', event => {
    audioPlayer.currentTime  = event.offsetX / audioSeekBar.offsetWidth * audioPlayer.duration;
  });
});

if (subjectToggles)
subjectToggles.forEach(subjectToggle => {
  subjectToggle.addEventListener('click', event => {
    let target = event.currentTarget;
    target.classList.toggle('show');
    target.parentElement.parentElement.parentElement.classList.toggle('show');
    if (target.classList.contains('show')) target.setAttribute('title', 'Hide sections');
    else target.setAttribute('title', 'Show sections');
  });
});

if (sectionTopics)
sectionTopics.forEach(sectionTopic => {
  sectionTopic.addEventListener('click', event => {
    let target = event.currentTarget;
    for (let child of target.children)
    if (child.classList.contains('section-topic__name')) {
      child.click();
      break;
    }
  });
});

if (sectionToggles)
sectionToggles.forEach(sectionToggle => {
  sectionToggle.addEventListener('click', event => {
    let target = event.currentTarget;
    target.classList.toggle('show');
    target.parentElement.parentElement.parentElement.classList.toggle('show');
    if (target.classList.contains('show')) target.setAttribute('title', 'Hide topics');
    else target.setAttribute('title', 'Show topics');
  });
});

if (addSections)
addSections.forEach(addSection => {
  addSection.addEventListener('click', event => {
    let target = event.currentTarget;
    for (let child of target.parentElement.parentElement.children)
    if (child.classList.contains('subject-name')) {
      sectionsPopupSubjectName.value = child.innerText;
      break;
    }
    sectionsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });
});

if (sectionsPopupCancel)
sectionsPopupCancel.addEventListener('click', () => {
  sectionsPopupText.value = null;
  sectionsPopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';
  blockList = blockList.filter(element => element !== sectionsPopup);
});

if (sectionsPopup)
sectionsPopup.addEventListener('submit', event => {
  event.preventDefault();
  let cleanInput = removeWhitespace(sectionsPopupText.value);
  sectionsPopupText.value = cleanInput;
  if (cleanInput === '' || cleanInput === null) {
    if (!blockList.includes(sectionsPopup))
    blockList.push(sectionsPopup);
    createErrorSuccess(errNoSection);
    return;
  }

  if (cleanInput.length > 26) {
    if (!blockList.includes(sectionsPopup))
    blockList.push(sectionsPopup);
    createErrorSuccess(errSectionLong);
    return;
  }

  for (let subjectName of document.querySelectorAll('.subject-name'))
  if (subjectName.innerText === sectionsPopupSubjectName.value) {
    for (let child of subjectName.parentElement.parentElement.children)
    if (child.classList.contains('subject__section'))
    for (let lowerChild of child.children)
    if (lowerChild.classList.contains('section-info'))
    for (let lowestChild of lowerChild.children)
    if (lowestChild.classList.contains('subject-section__name'))
    if (lowestChild.innerText === cleanInput) {
      if (!blockList.includes(sectionsPopup))
      blockList.push(sectionsPopup);
      createErrorSuccess(errSectionExists);
      return;
    }
    break;
  }

  generateThrobber();

  import('axios').then(axios => {
    axios = axios.default;

    axios.post('/subjects/sections/add', {
      subject_name: sectionsPopupSubjectName.value,
      section_name: cleanInput
    })
    .then(res => {
      removeThrobber();
      if (res.data.status === 201) {
        sectionsPopupText.value = null;

        let subjectSection = generateSubjectSection(cleanInput);
        for (let subjectName of document.querySelectorAll('.subject-name'))
        if (subjectName.innerText === sectionsPopupSubjectName.value) {
          subjectName.parentElement.parentElement.appendChild(subjectSection);
          break;
        }
        sectionsPopupCancel.click();
        createErrorSuccess(res.data.message);
      }
      else {
        if (!blockList.includes(subjectsPopup))
        blockList.push(subjectsPopup);
        createErrorSuccess(res.data.message);
      }
    })
    .catch(error => {
      removeThrobber();
      console.error(error);
      if (!blockList.includes(subjectsPopup))
      blockList.push(subjectsPopup);
      createErrorSuccess(errSectionAddFail);
    });
  });
});

if (addTopics)
addTopics.forEach(addTopic => {
  addTopic.addEventListener('click', event => {
    let target = event.currentTarget;
    outerLoop: for (let child of target.parentElement.parentElement.parentElement.parentElement.children) {
      if (child.classList.contains('subject-info')) {
        innerLoop: for (let lowerChild of child.children) {
          if (lowerChild.classList.contains('subject-name')) {
            topicsPopupSubjectName.value = lowerChild.innerText;
            break outerLoop;
          }
        }
      }
    }

    for (let child of target.parentElement.parentElement.children)
    if (child.classList.contains('subject-section__name')) {
      topicsPopupSectionName.value = child.innerText;
      break;
    }
    topicsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });
});

if (topicsPopupCancel)
topicsPopupCancel.addEventListener('click', () => {
  topicsPopupText.value = null;
  topicsPopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';
  blockList = blockList.filter(element => element !== topicsPopup);
});

if (topicsPopup)
topicsPopup.addEventListener('submit', event => {
  event.preventDefault();

  let cleanInput = removeWhitespace(topicsPopupText.value);
  topicsPopupText.value = cleanInput;

  if (cleanInput === '' || cleanInput === null) {
    if (!blockList.includes(topicsPopup))
    blockList.push(topicsPopup);
    createErrorSuccess(errNoTopic);
    return;
  }

  if (cleanInput.length > 26) {
    if (!blockList.includes(topicsPopup))
    blockList.push(topicsPopup);
    createErrorSuccess(errTopicLong);
    return;
  }

  loop1: for (let subjectName of document.querySelectorAll('.subject-name'))
  if (subjectName.innerText === topicsPopupSubjectName.value) {
    for (let child of subjectName.parentElement.parentElement.children)
    if (child.classList.contains('subject__section'))
    for (let lowChild of child.children)
    if (lowChild.classList.contains('section-info'))
    for (let lowerChild of lowChild.children)
    if (lowerChild.classList.contains('subject-section__name'))
    if (lowerChild.innerText === topicsPopupSectionName.value)
    for (let lowChild2 of child.children)
    if (lowChild2.classList.contains('section__topic'))
    for (let lowerChild2 of lowChild2.children)
    if (lowerChild2.innerText === cleanInput) {
      if (!blockList.includes(topicsPopup))
      blockList.push(topicsPopup);
      createErrorSuccess(errTopicExists);
      return;
    }
    break loop1;
  }

  let topicId = new Date().toISOString().replace('T','').replace('Z','').replaceAll('-','').replaceAll(':','').replaceAll('.', '');

  generateThrobber();

  import('axios').then(axios => {
    axios = axios.default;

    axios.post('/subjects/sections/topics/add', {
      subject_name: topicsPopupSubjectName.value,
      section_name: topicsPopupSectionName.value,
      topic_name: cleanInput,
      topic_id: topicId
    })
    .then(res => {
      removeThrobber();
      if (res.data.status === 201) {
        let sectionTopic = generateSectionTopic(cleanInput, topicId);

        loop1: for (let subjectName of document.querySelectorAll('.subject-name'))
        if (subjectName.innerText === topicsPopupSubjectName.value)
        loop2: for (let child of subjectName.parentElement.parentElement.children)
        if (child.classList.contains('subject__section'))
        for (let lowChild of child.children)
        if (lowChild.classList.contains('section-info'))
        for (let lowerChild of lowChild.children)
        if (lowerChild.classList.contains('subject-section__name')) {
          if (lowerChild.innerText === topicsPopupSectionName.value) {
            child.appendChild(sectionTopic);
            break loop1;
          }
          else continue loop2;
        }
        topicsPopupCancel.click();
        createErrorSuccess(res.data.message);
      }
      else {
        if (!blockList.includes(subjectsPopup))
        blockList.push(subjectsPopup);
        createErrorSuccess(res.data.message);
      }
    })
    .catch(error => {
      removeThrobber();
      console.error(error);
      if (!blockList.includes(topicsPopup))
      blockList.push(topicsPopup);
      createErrorSuccess(errTopicAddFail);
    });
  });
});

if (editTopicsPopupCancel)
editTopicsPopupCancel.addEventListener('click', () => {
  editTopicsPopupText.value = null;
  editTopicsPopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';
  blockList = blockList.filter(element => element !== editTopicsPopup);
});

if (editTopicsPopup)
editTopicsPopup.addEventListener('submit', event => {
  let target = event.currentTarget;
  event.preventDefault();
  let cleanInput = removeWhitespace(editTopicsPopupText.value);
  editTopicsPopupText.value = cleanInput;
  if (cleanInput === '' || cleanInput === null) {
    if (!blockList.includes(editTopicsPopup))
    blockList.push(editTopicsPopup);
    createErrorSuccess(errNoTopic);
    return;
  }

  if (cleanInput.length > 26) {
    if (!blockList.includes(editTopicsPopup))
    blockList.push(editTopicsPopup);
    createErrorSuccess(errTopicLong);
    return;
  }

  if (cleanInput === editTopicsPopupFormerName.value) {
    if (!blockList.includes(editTopicsPopup))
    blockList.push(editTopicsPopup);
    createErrorSuccess(errTopicExists);
    return;
  }

  let form = new FormData(target);
  form.append('topic_id', new URL(window.location.href).search.slice(4));

  generateThrobber();

  import('axios').then(axios => {
    axios = axios.default;

    axios.post('/subjects/sections/topics/edit', form)
    .then(res => {
      removeThrobber();
      if (res.data.status === 200) {
        document.querySelector('.topic-name').innerText = cleanInput;
        editTopicsPopupText.value = null;
        editTopicsPopup.style.transform = 'translate(-50%,-50%) scale(0)';
        overlay.style.display = 'none';
        bread.style.pointerEvents = 'unset';
        createErrorSuccess(res.data.message);
        updateRecentTopics();
      }
      else {
        if (!blockList.includes(editTopicsPopup))
        blockList.push(editTopicsPopup);
        createErrorSuccess(res.data.message);
      }
    })
    .catch(err => {
      removeThrobber();
      console.error(err);
      if (!blockList.includes(editTopicsPopup))
      blockList.push(editTopicsPopup);
      createErrorSuccess(errTopicEditFail);
    });
  });
});

if (addSubject)
addSubject.addEventListener('click', event => {
  subjectsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
  overlay.style.display = 'unset';
  bread.style.pointerEvents = 'none';
});

if (subjectsPopupCancel)
subjectsPopupCancel.addEventListener('click', () => {
  subjectsPopupText.value = null;
  subjectsPopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';
  blockList = blockList.filter(element => element !== subjectsPopup);
});

if (subjectsPopup)
subjectsPopup.addEventListener('submit', event => {
  event.preventDefault();
  let cleanInput = removeWhitespace(subjectsPopupText.value);
  subjectsPopupText.value = cleanInput;
  if (cleanInput === '' || cleanInput === null) {
    if (!blockList.includes(subjectsPopup))
    blockList.push(subjectsPopup);
    createErrorSuccess(errNoSubject);
    return;
  }
  if (cleanInput.length > 26) {
    if (!blockList.includes(subjectsPopup))
    blockList.push(subjectsPopup);
    createErrorSuccess(errSubjectLong);
    return;
  }

  for (let subject of document.querySelectorAll('.subject-name')) {
    if (subject.innerText === cleanInput) {
      if (!blockList.includes(subjectsPopup))
      blockList.push(subjectsPopup);
      createErrorSuccess(errSubjectExists);
      return;
    }
  }

  generateThrobber();

  import('axios').then(axios => {
    axios = axios.default;

    axios.post('/subjects/add', { subject_name: cleanInput })
    .then(res => {
      removeThrobber();
      if (res.data.status === 201) {
        subjectsPopupText.value = null;

        let subjectContainer = generateSubjectContainer(cleanInput);
        subjectsContainer.insertBefore(subjectContainer, addSubject);

        subjectsPopupCancel.click();
        createErrorSuccess(res.data.message);
      }
      else {
        if (!blockList.includes(subjectsPopup))
        blockList.push(subjectsPopup);
        createErrorSuccess(res.data.message);
      }
    })
    .catch(error => {
      removeThrobber();
      console.error(error);
      if (!blockList.includes(subjectsPopup))
      blockList.push(subjectsPopup);
      createErrorSuccess(errSubjectAddFail);
    });
  });
});

if (subjectEdits)
subjectEdits.forEach(subjectEdit => {
  subjectEdit.addEventListener('click', event => {
    let target = event.currentTarget;
    for (let child of target.parentElement.parentElement.children) {
      if (child.classList.contains('subject-name')) {
        editSubjectsPopupFormerName.value = child.innerText;
        editSubjectsPopupText.value = child.innerText;
        break;
      }
    }
    editSubjectsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });
});

if (editSubjectsPopupCancel)
editSubjectsPopupCancel.addEventListener('click', () => {
  editSubjectsPopupText.value = null;
  editSubjectsPopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';
  blockList = blockList.filter(element => element !== editSubjectsPopup);
});

if (editSubjectsPopup)
editSubjectsPopup.addEventListener('submit', event => {
  event.preventDefault();
  let cleanInput = removeWhitespace(editSubjectsPopupText.value);
  editSubjectsPopupText.value = cleanInput;
  if (cleanInput === '' || cleanInput === null) {
    if (!blockList.includes(editSubjectsPopup))
    blockList.push(editSubjectsPopup);
    createErrorSuccess(errNoSubject);
    return;
  }

  if (cleanInput.length > 26) {
    if (!blockList.includes(editSubjectsPopup))
    blockList.push(editSubjectsPopup);
    createErrorSuccess(errSubjectLong);
    return;
  }

  for (let subject of document.querySelectorAll('.subject-name')) {
    if (subject.innerText === cleanInput) {
      if (!blockList.includes(subjectsPopup))
      blockList.push(subjectsPopup);
      createErrorSuccess(errSubjectExists);
      return;
    }
  }

  generateThrobber();

  import('axios').then(axios => {
    axios = axios.default;

    axios.post('/subjects/edit', {
      former_subject_name: editSubjectsPopupFormerName.value,
      subject_name: cleanInput
    })
    .then(res => {
      removeThrobber();
      if (res.data.status === 200) {
        editSubjectsPopupText.value = null;
        for (let subjectName of document.querySelectorAll('.subject-name'))
        if (subjectName.innerText === editSubjectsPopupFormerName.value) {
          subjectName.innerText = cleanInput;
          break;
        }
        editSubjectsPopupCancel.click();
        createErrorSuccess(res.data.message);
      }
      else {
        if (!blockList.includes(editSubjectsPopup))
        blockList.push(editSubjectsPopup);
        createErrorSuccess(res.data.message);
      }
    })
    .catch(error => {
      removeThrobber();
      console.error(error);
      if (!blockList.includes(editSubjectsPopup))
      blockList.push(editSubjectsPopup);
      createErrorSuccess(errSubjectEditFail);
    });
  });
});

if (subjectDeletes)
subjectDeletes.forEach(subjectDelete => {
  subjectDelete.addEventListener('click', event => {
    let target = event.currentTarget;
    let yesCallback = () => {
      let subjectName;
      for (let child of target.parentElement.parentElement.children)
      if (child.classList.contains('subject-name')) {
        subjectName = child.innerText;
        break;
      }
      generateThrobber();

      import('axios').then(axios => {
        axios = axios.default;

        axios.post('/subjects/delete', { subject_name: subjectName })
        .then(res => {
          removeThrobber();
          if (res.data.status === 200) {
            let topicIds = [];
            for (let topic of document.querySelectorAll('.section__topic a'))
            if (topic.parentElement.parentElement.parentElement === target.parentElement.parentElement.parentElement) {
              topicIds.push(new URL(topic.href).search.slice(4));
            }
            target.parentElement.parentElement.parentElement.remove();
            createErrorSuccess(res.data.message);
            pruneSessionStorage(topicIds);
            updateRecentTopics();
          }
          else createErrorSuccess(res.data.message);
        })
        .catch(err => {
          removeThrobber();
          console.error(err);
          createErrorSuccess(errSubjectDeleteFail);
        });
      });
    };
    confirmAction(yesCallback);
  });
});

if (sectionEdits)
sectionEdits.forEach(sectionEdit => {
  sectionEdit.addEventListener('click', event => {
    let target = event.currentTarget;
    for (let child of target.parentElement.parentElement.children) {
      if (child.classList.contains('subject-section__name')) {
        editSectionsPopupFormerName.value = child.innerText;
        editSectionsPopupText.value = child.innerText;
        break;
      }
    }
    outerLoop: for (let child of target.parentElement.parentElement.parentElement.parentElement.children) {
      if (child.classList.contains('subject-info')) {
        innerLoop: for (let lowerChild of child.children) {
          if (lowerChild.classList.contains('subject-name')) {
            editSectionsPopupSubjectName.value = lowerChild.innerText;
            break outerLoop;
          }
        }
      }
    }
    editSectionsPopup.style.transform = 'translate(-50%,-50%) scale(1)';
    overlay.style.display = 'unset';
    bread.style.pointerEvents = 'none';
  });
});

if (editSectionsPopupCancel)
editSectionsPopupCancel.addEventListener('click', () => {
  editSectionsPopupText.value = null;
  editSectionsPopup.style.transform = 'translate(-50%,-50%) scale(0)';
  overlay.style.display = 'none';
  bread.style.pointerEvents = 'unset';
  blockList = blockList.filter(element => element !== editSectionsPopup);
});

if (editSectionsPopup)
editSectionsPopup.addEventListener('submit', event => {
  event.preventDefault();
  let cleanInput = removeWhitespace(editSectionsPopupText.value);
  editSectionsPopupText.value = cleanInput;
  if (cleanInput === '' || cleanInput === null) {
    if (!blockList.includes(editSectionsPopup))
    blockList.push(editSectionsPopup);
    createErrorSuccess(errNoSection);
    return;
  }

  if (cleanInput.length > 26) {
    if (!blockList.includes(editSectionsPopup))
    blockList.push(editSectionsPopup);
    createErrorSuccess(errSectionLong);
    return;
  }

  for (let subjectName of document.querySelectorAll('.subject-name'))
  if (subjectName.innerText === editSectionsPopupSubjectName.value) {
    for (let child of subjectName.parentElement.parentElement.children)
    if (child.classList.contains('subject__section'))
    for (let lowerChild of child.children)
    if (lowerChild.classList.contains('section-info'))
    for (let lowestChild of lowerChild.children)
    if (lowestChild.classList.contains('subject-section__name'))
    if (lowestChild.innerText === cleanInput) {
      if (!blockList.includes(sectionsPopup))
      blockList.push(sectionsPopup);
      createErrorSuccess(errSectionExists);
      return;
    }
    break;
  }

  generateThrobber();

  import('axios').then(axios => {
    axios = axios.default;

    axios.post('/subjects/sections/edit', {
      subject_name: editSectionsPopupSubjectName.value,
      former_section_name: editSectionsPopupFormerName.value,
      section_name: cleanInput
    })
    .then(res => {
      removeThrobber();
      if (res.data.status === 200) {
        editSectionsPopupText.value = null;
        for (let subjectName of document.querySelectorAll('.subject-name'))
        if (subjectName.innerText === editSectionsPopupSubjectName.value) {
          for (let child of subjectName.parentElement.parentElement.children)
          if (child.classList.contains('subject__section'))
          for (let lowerChild of child.children)
          if (lowerChild.classList.contains('section-info'))
          for (let lowestChild of lowerChild.children)
          if (lowestChild.classList.contains('subject-section__name'))
          if (lowestChild.innerText === editSectionsPopupFormerName.value)
          lowestChild.innerText = cleanInput;
          break;
        }
        editSectionsPopupCancel.click();
        createErrorSuccess(res.data.message);
      }
      else {
        if (!blockList.includes(editSectionsPopup))
        blockList.push(editSectionsPopup);
        createErrorSuccess(res.data.message);
      }
    })
    .catch(error => {
      removeThrobber();
      console.error(error);
      if (!blockList.includes(editSectionsPopup))
      blockList.push(editSectionsPopup);
      createErrorSuccess(errSectionEditFail);
    });
  });
});

if (sectionDeletes)
sectionDeletes.forEach(sectionDelete => {
  sectionDelete.addEventListener('click', event => {
    let target = event.currentTarget;
    let yesCallback = () => {
      let sectionName;
      let subjectName;
      for (let child of target.parentElement.parentElement.children)
      if (child.classList.contains('subject-section__name')) {
        sectionName = child.innerText;
        break;
      }
      outerLoop: for (let child of target.parentElement.parentElement.parentElement.parentElement.children) {
        if (child.classList.contains('subject-info')) {
          innerLoop: for (let lowerChild of child.children) {
            if (lowerChild.classList.contains('subject-name')) {
              subjectName = lowerChild.innerText;
              break outerLoop;
            }
          }
        }
      }
      generateThrobber();

      import('axios').then(axios => {
        axios = axios.default;

        axios.post('/subjects/sections/delete', {
          subject_name: subjectName,
          section_name: sectionName
        })
        .then(res => {
          removeThrobber();
          if (res.data.status === 200) {
            let topicIds = [];
            for (let topic of document.querySelectorAll('.section__topic a'))
            if (topic.parentElement.parentElement === target.parentElement.parentElement.parentElement) {
              topicIds.push(new URL(topic.href).search.slice(4));
            }
            target.parentElement.parentElement.parentElement.remove();
            createErrorSuccess(res.data.message);
            pruneSessionStorage(topicIds);
            updateRecentTopics();
          }
          else createErrorSuccess(res.data.message);
        })
        .catch(err => {
          removeThrobber();
          console.error(err);
          createErrorSuccess(errSectionDeleteFail);
        });
      });
    };
    confirmAction(yesCallback);
  });
});
