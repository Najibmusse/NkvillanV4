var firebaseConfig = {
    apiKey: "AIzaSyDMELt3JOL1AZ9wOdwQ0U-MwuH8B6fUAFw",
    authDomain: "nkvillanv3.firebaseapp.com",
    databaseURL: "https://nkvillanv3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nkvillanv3",
    storageBucket: "nkvillanv3.appspot.com",
    messagingSenderId: "434279332272",
    appId: "1:434279332272:web:3c3b447420535b59c8be75",
    measurementId: "G-2NPE9HML8X"
  };

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById('weekly-table');
    const cells = table.querySelectorAll("td[contenteditable='true']");
    let currentDate = new Date();

    const getWeekKey = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const year = startOfWeek.getFullYear();
        const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
        const day = String(startOfWeek.getDate()).padStart(2, '0');
        return `week_${year}-${month}-${day}`;
    };

    const loadData = () => {
        const weekKey = getWeekKey(currentDate);
        database.ref('weeklySchedule/' + weekKey).once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                cells.forEach((cell, index) => {
                    if (data[index] !== undefined) {
                        cell.textContent = data[index];
                    }
                });
            } else {
                cells.forEach(cell => cell.textContent = '');
            }
        }).catch((error) => {
            console.error("Fel vid laddning av data: ", error);
        });
    };

    const saveData = () => {
        const data = {};
        cells.forEach((cell, index) => {
            data[index] = cell.textContent;
        });
        const weekKey = getWeekKey(currentDate);
        database.ref('weeklySchedule/' + weekKey).set(data)
            .then(() => {
                console.log("Data sparades framgångsrikt!");
            })
            .catch((error) => {
                console.error("Fel vid sparning av data: ", error);
            });
    };

    const updateTableDates = () => {
        const rows = table.getElementsByTagName('tr');
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i - 1 - currentDate.getDay());
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            row.cells[0].textContent = formattedDate;
        }
    };

    const updateWeekDisplay = () => {
        const weekDisplay = document.getElementById('week-display');
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        weekDisplay.textContent = `Vecka: ${startOfWeek.toLocaleDateString('sv-SE', options)} - ${endOfWeek.toLocaleDateString('sv-SE', options)}`;
    };

    document.getElementById('prev-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateTableDates();
        updateWeekDisplay();
        loadData();
    });

    document.getElementById('next-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateTableDates();
        updateWeekDisplay();
        loadData();
    });

    cells.forEach((cell) => {
        cell.addEventListener("input", () => {
            saveData();
        });
    });

    updateTableDates();
    updateWeekDisplay();
    loadData();
});