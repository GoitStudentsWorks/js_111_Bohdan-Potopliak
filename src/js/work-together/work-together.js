import { postRequest } from './work-together-api';
import { showError, showWarning } from './toast-helper';

const contactForm = document.querySelector('#work_together_form');
contactForm.addEventListener('input', handleInput);
contactForm.addEventListener('submit', onContactFormSubmit);

const formData = { email: '', comment: '' };

const messageContent = document.getElementById('work_together_message_content');
const messageWrap = document.getElementById('work_together_message_wrap');
const userCommentTextarea = document.getElementById('work_together_comment');
const hoverWrap = document.querySelector('.work_together_hover');

function handleInput(event) {
  const MAX_COMMENT_LENGTH = 21;

  let userComment = userCommentTextarea.value;

  const pattern = /^\w+(\.\w+)?@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;
  formData[event.target.name] = event.target.value.trim();

  if (
    event.target.name === 'comment' &&
    userComment.length > MAX_COMMENT_LENGTH
  ) {
    userComment = userComment.slice(0, MAX_COMMENT_LENGTH - 3) + '...';
    userCommentTextarea.value = userComment;
  }

  if (event.target.name === 'email') {
    const email = formData.email;

    if (email.length === 0) {
      messageWrap.classList.add('work_together_wrap_email');
      messageContent.textContent = '';
      messageWrap.classList.remove(
        'work_together_wrap_red',
        'work_together_wrap_green'
      );
      messageContent.classList.remove(
        'work_together_succes_red',
        'work_together_succes_green'
      );
    } else if (!pattern.test(email)) {
      messageContent.textContent = 'Invalid email, try again';
      messageContent.classList.remove('work_together_succes_green');
      messageContent.classList.add('work_together_succes_red');
      messageWrap.classList.replace(
        'work_together_wrap_email',
        'work_together_wrap_red'
      ) ||
        messageWrap.classList.replace(
          'work_together_wrap_green',
          'work_together_wrap_red'
        );
    } else {
      console.log(2);
      messageContent.textContent = 'Success!';

      messageWrap.classList.replace(
        'work_together_wrap_email',
        'work_together_wrap_green'
      ) ||
        messageWrap.classList.replace(
          'work_together_wrap_red',
          'work_together_wrap_green'
        );
      messageContent.classList.add('work_together_succes_green');
      messageWrap.classList.remove('work_together_wrap_red');
      messageContent.classList.remove('work_together_succes_red');
    }
  }
}

const modalHandler = handleModal();

async function onContactFormSubmit(event) {
  event.preventDefault();

  if (!formData.email || !formData.comment) {
    return showWarning('Please fill all fields');
  }

  try {
    const response = await postRequest(formData);

    modalHandler.openModal(response.data.title, response.data.message);
    event.target.reset();
  } catch (error) {
    showError(error.message);
  } finally {
    messageContent.textContent = '';
    messageWrap.classList.remove(
      'work_together_wrap_red',
      'work_together_wrap_green'
    );
    messageContent.classList.remove(
      'work_together_succes_red',
      'work_together_succes_green'
    );
    messageWrap.classList.add('work_together_wrap_email');
  }
}

function handleModal() {
  const closeModalBtn = document.querySelector('[data-modal-close]');
  const modal = document.querySelector('[data-modal-messages]');
  const titleField = modal.querySelector('[data-modal-title]');
  const messageField = modal.querySelector('[data-modal-message]');

  const openModal = (title, message) => {
    if (title) titleField.textContent = title;
    if (message) messageField.textContent = message;

    modal.classList.add('is-open');
    // document.body.classList.add('no-scroll'); // Блокуе прокрутку
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    // document.body.classList.remove('no-scroll'); // Разблоковує прокрутку
  };

  closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  return { openModal, closeModal };
}
