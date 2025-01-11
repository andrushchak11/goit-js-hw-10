import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputDatePicker = document.querySelector('#datetime-picker');
const btnDateStart = document.querySelector('.timer-start');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

let timerInterval = null;
let userSelectedDate = null;

flatpickr(inputDatePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      btnDateStart.disabled = true;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      btnDateStart.disabled = false;

      iziToast.success({
        title: 'Success',
        message: 'Valid date selected!',
      });
    }
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

btnDateStart.addEventListener('click', () => {
  btnDateStart.disabled = true;
  inputDatePicker.disabled = true;

  intervalBack = setInterval(() => {
    const nowDate = new Date();
    const timeResult = userSelectedDate - nowDate;

    if (timeResult <= 0) {
      clearInterval(intervalBack);
      iziToast.success({
        title: 'Timer Ended',
        message: 'The countdown has finished!',
      });
      inputDatePicker.disabled = false;
      return;
    }

    const time = convertMs(timeResult);

    days.textContent = addLeadingZero(time.days);
    hours.textContent = addLeadingZero(time.hours);
    minutes.textContent = addLeadingZero(time.minutes);
    seconds.textContent = addLeadingZero(time.seconds);
  }, 1000);
});
