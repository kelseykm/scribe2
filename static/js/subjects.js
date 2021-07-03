import '../css/subjects.css';

//VARS AND SELECTORS
const errTopicExists = 'Topic already exists in this section';
const errSectionExists = 'Section already exists in this subject';
const errSubjectExists = 'Subject already exists';
const errTopicLong = 'Topic is too long';
const errSectionLong = 'Section is too long';
const errSubjectLong = 'Subject is too long';
const errNoTopic = 'No topic entered';
const errNoSection = 'No section entered';
const errNoSubject = 'No subject entered';
const errSubjectAddFail = 'Failed to add subject, please try again';
const errSubjectEditFail = 'Failed to change subject name, please try again';
const errSubjectDeleteFail = 'Failed to delete subject, please try again';
const errSectionAddFail = 'Failed to add section, please try again';
const errSectionEditFail = 'Failed to change section name, please try again';
const errSectionDeleteFail = 'Failed to delete section, please try again';
const errTopicAddFail = 'Failed to add topic, please try again';
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

//FUNCTIONS
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

//EVENT LISTENERS
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

  if (cleanInput.length > 30) {
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

  if (cleanInput.length > 30) {
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
  if (cleanInput.length > 30) {
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

  if (cleanInput.length > 30) {
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

  if (cleanInput.length > 30) {
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
    };
    confirmAction(yesCallback);
  });
});
