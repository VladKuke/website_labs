// ---------------- 1. Поміняти місцями тексти блоку "1" і блоку "6" ----------------

// Отримуємо елементи заголовків блоку 1 та блоку 6
const block1Title = document.getElementById("block1-title");
const block6Title = document.getElementById("block6-title");

// Зберігаємо початкові тексти
const textBlock1 = block1Title.textContent;
const textBlock6 = block6Title.textContent;

// Міняємо місцями
block1Title.textContent = textBlock6;
block6Title.textContent = textBlock1;


// ---------------- 2. Функція, що обчислює площу ромба і виводить у блок "3" ----------------

// Припустимо, довжини діагоналей ромба:
let d1 = 10;
let d2 = 6;
// Функція обчислення площі
function calculateRhombusArea(d1, d2) {
    return (d1 * d2) / 2;
}

// Знайдемо елемент у блоці 3, куди додамо текст результату
const rhombusResultDiv = document.getElementById("rhombus-result");

// Обчислимо площу й виведемо результат
const rhombusArea = calculateRhombusArea(d1, d2);
rhombusResultDiv.textContent = "Площа ромба = " + rhombusArea;


// ---------------- 3. Перевірка трикутника з форми та збереження результату в cookies ----------------
/*
   Алгоритм:
   - Якщо cookies з результатом існують -> показуємо вікно confirm:
       1) Якщо користувач згоден видалити cookies -> видаляємо і перезавантажуємо.
       2) Якщо відмовляється -> показуємо alert (інформуємо) і не показуємо форму.
   - Якщо cookies НЕ існують -> показуємо форму. При submit перевіряємо трикутник, записуємо в cookies, показуємо alert.
*/

// Допоміжні функції для cookies
function setCookie(name, value, days = 1) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Перевіримо, чи вже є записаний результат трикутника в cookies
const triangleCookie = getCookie("triangleResult");

const triangleForm = document.getElementById("triangleForm");

if(triangleCookie) {
    // Якщо в cookies зберігається результат, запитуємо користувача
    const userChoice = confirm(
        "У cookies збережено: " + triangleCookie +
        ". Видалити дані з cookies?"
    );

    if(userChoice) {
        // Якщо підтвердив – видаляємо cookie та перезавантажуємо сторінку
        deleteCookie("triangleResult");
        location.reload();
    } else {
        // Якщо відмовив – показуємо повідомлення і приховуємо форму
        alert("Cookies залишились. Для відновлення початкового стану перезавантажте сторінку (F5).");
        triangleForm.style.display = "none";
    }
} else {
    // Якщо cookies немає – даємо користувачеві можливість заповнити форму
    triangleForm.addEventListener("submit", function(e){
        e.preventDefault();
        const sideA = parseFloat(document.getElementById("sideA").value);
        const sideB = parseFloat(document.getElementById("sideB").value);
        const sideC = parseFloat(document.getElementById("sideC").value);

        // Перевірка: чи можна побудувати трикутник?
        let canBuild = false;
        if(sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA) {
            canBuild = true;
        }

        const resultText = canBuild
            ? "Трикутник зі сторонами " + sideA + ", " + sideB + ", " + sideC + " побудувати МОЖНА."
            : "Трикутник зі сторонами " + sideA + ", " + sideB + ", " + sideC + " побудувати НЕ можна!";

        // Виводимо результат
        alert(resultText);
        // Зберігаємо в cookies
        setCookie("triangleResult", resultText, 1);
    });
}


// ---------------- 4. Курсив для блоку "2" при mouseover та збереження в LocalStorage ----------------

const block2 = document.getElementById("block2");
const italicForm = document.getElementById("italicForm");

// Перевірити стан "курсиву" з LocalStorage при завантаженні сторінки
let storedItalic = localStorage.getItem("block2Italic");
if(storedItalic && storedItalic === "on") {
    block2.style.fontStyle = "italic";
    // Зробимо checked відповідну радіокнопку
    italicForm.elements["italic"].value = "on";
    italicForm.querySelector("input[value='on']").checked = true;
} else {
    block2.style.fontStyle = "normal";
    italicForm.querySelector("input[value='off']").checked = true;
}

// Вішаємо обробник нарадиокнопки
italicForm.addEventListener("change", function(e){
    const value = e.target.value;
    if(value === "on") {
        localStorage.setItem("block2Italic", "on");
    } else {
        localStorage.setItem("block2Italic", "off");
    }
});

// При наведенні (mouseover) – перевіримо, чи увімкнено «курсив»
block2.addEventListener("mouseover", function(){
    let status = localStorage.getItem("block2Italic");
    if(status === "on") {
        block2.style.fontStyle = "italic";
    } else {
        block2.style.fontStyle = "normal";
    }
});


// ---------------- 5. Створення нумерованого списку ("зебра") та збереження в LocalStorage ----------------

// Ідея: при кліку на "Додати нумерований список" з'являється форма, користувач додає пункти, ми формуємо <ol> з «зеброю».
// Потім натискає "Зберегти" – і ми зберігаємо це у LocalStorage. При оновленні сторінки перевіряємо LocalStorage
// і якщо дані є – відображаємо одразу готовий список замість початкового контенту.

// Функція для створення "зебри" (парні/непарні) – можна робити і через CSS-класи
function applyZebraToOl(ol) {
    const liItems = ol.querySelectorAll("li");
    liItems.forEach((li, index) => {
        if(index % 2 === 0) {
            // парний індекс, нехай фон білий, текст чорний
            li.style.backgroundColor = "#fff";
            li.style.color = "#000";
        } else {
            // непарний індекс, навпаки
            li.style.backgroundColor = "#000";
            li.style.color = "#fff";
        }
    });
}

// Функція для відображення форми введення пункту списку
function createListForm(blockNumber) {
    const container = document.getElementById(`list-container-${blockNumber}`);

    // Якщо форма вже існує – не створюємо ще раз
    if(container.querySelector(".list-form")) return;

    // Створимо форму
    const form = document.createElement("form");
    form.className = "list-form";
    form.innerHTML = `
    <label>Введіть пункт списку:</label>
    <input type="text" name="listItem" required>
    <button type="submit">Додати</button>
    <button type="button" class="save-list">Зберегти список</button>
  `;

    // Створимо <ol> для пунктів
    const ol = document.createElement("ol");
    ol.className = "zebra-list";

    container.appendChild(form);
    container.appendChild(ol);

    // Обробник події "submit" форми для додавання нового пункту
    form.addEventListener("submit", function(e){
        e.preventDefault();
        const input = form.querySelector("[name='listItem']");
        const text = input.value.trim();
        if(!text) return;
        // Створюємо li
        const li = document.createElement("li");
        li.textContent = text;
        ol.appendChild(li);
        input.value = "";
        // Оновлюємо «зебру»
        applyZebraToOl(ol);
    });

    // Кнопка "Зберегти список"
    const saveBtn = form.querySelector(".save-list");
    saveBtn.addEventListener("click", function(){
        // Зберегти дані списку в LocalStorage
        const liItems = ol.querySelectorAll("li");
        let itemsArray = [];
        liItems.forEach(li => itemsArray.push(li.textContent));
        // Збережемо у вигляді JSON
        localStorage.setItem(`listData-block${blockNumber}`, JSON.stringify(itemsArray));
        alert("Список збережено в LocalStorage!");
    });
}

// Функція для відновлення списку з LocalStorage (якщо існує)
function restoreList(blockNumber) {
    const container = document.getElementById(`list-container-${blockNumber}`);
    const data = localStorage.getItem(`listData-block${blockNumber}`);
    if(data) {
        // Припустимо, початковий контент блоку треба сховати. (Можна й видалити, на ваш розсуд.)
        // Наприклад, якщо там лиш текст – можна його приховати, або замінити.
        // У прикладі ми просто додаємо список нижче, не видаляючи нічого.
        const itemsArray = JSON.parse(data);
        // Створюємо <ol> і вставляємо
        const ol = document.createElement("ol");
        ol.className = "zebra-list";
        itemsArray.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ol.appendChild(li);
        });
        applyZebraToOl(ol);
        container.appendChild(ol);
    }
}

// 1) Повісити обробники на всі посилання "Додати нумерований список"
document.querySelectorAll(".create-list-link").forEach(link => {
    link.addEventListener("click", function(e){
        e.preventDefault();
        // Визначимо, до якого блоку додаємо список
        const blockNumber = link.getAttribute("data-block");
        createListForm(blockNumber);
    });
});

// 2) При завантаженні відновити (якщо є) списки з LocalStorage
restoreList(1);
restoreList(5);
restoreList(6);
