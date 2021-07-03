import '../css/topics.css';

//VARS AND SELECTORS
const errNoteExists = 'Note already exists in this topic';
const errTopicExists = 'Topic already exists in this section';
const errTopicLong = 'Topic is too long';
const errNoTopic = 'No topic entered';
const errMicPermDenied = 'Allow the use of microphone to record a voice note';
const errTopicDeleteFail = 'Failed to delete topic, please try again';
const errTopicEditFail = 'Failed to change topic name, please try again';
const errNoteDeleteFail = 'Failed to delete note, please try again';
const errNoteAddFail = 'Failed to add note, please try again';
const addTextNotes = document.querySelector('.add-text-note');
const addVoiceNotes = document.querySelector('.add-voice-note');
const deleteTopic = document.querySelector('.delete-topic');
const editTopic = document.querySelector('.edit-topic');
const notesForm = document.querySelector('.text-notes-form');
const deleteNote = document.querySelectorAll('.delete-note');
const editTextNote = document.querySelectorAll('.edit-note.edit-text');
const editVoiceNote = document.querySelectorAll('.edit-note.edit-voice');
const audioPlayerContainers = document.querySelectorAll(".audio-player-container");
const editTopicsPopup = document.querySelector('.edit-topics-popup');
const editTopicsPopupFormerName = document.querySelector('.edit-topics-popup input[name="former_topic_name"]');
const editTopicsPopupText = document.querySelector('.edit-topics-popup__text');
const editTopicsPopupCancel = document.querySelector('.edit-topics-popup-btn__cancel');

//FUNCTIONS
function convTime(seconds) {
  if (isFinite(seconds)) {
    if (seconds < 3600 ) return new Date(seconds * 1000).toISOString().substr(14, 5);
    else return new Date(seconds * 1000).toISOString().substr(11, 8);
  } else return seconds
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
  window.scroll(newNotesForm.offsetLeft, newNotesForm.offsetTop);
}

//EVENT LISTENERS
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

  window.scroll(newNotesForm.offsetLeft, newNotesForm.offsetTop);
});

if (deleteTopic)
deleteTopic.addEventListener('click', () => {
  let yesCallback = () => {
    let topicId = new URL(window.location.href).search.slice(4);
    generateThrobber();

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

  if (cleanInput.length > 30) {
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
