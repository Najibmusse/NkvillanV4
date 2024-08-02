const schedule = document.getElementById('weekly-table');
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');

let currentDate = new Date();
let currentWeekOffset = 0;

const updateDates = () => {
  const baseDate = new Date(currentDate);
  baseDate.setDate(baseDate.getDate() + currentWeekOffset * 7);
  
  const rows = schedule.getElementsByTagName('tr');
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i - 1);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
    row.cells[0].textContent = formattedDate;
  }
};

prevWeekBtn.addEventListener('click', () => {
  if (currentWeekOffset > -26) {
    currentWeekOffset--;
    updateDates();
    loadData();
  }
});

nextWeekBtn.addEventListener('click', () => {
  if (currentWeekOffset < 26) {
    currentWeekOffset++;
    updateDates();
    loadData();
  }
});

updateDates();
