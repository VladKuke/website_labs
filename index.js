
const block1Title = document.getElementById("block1-title");
const block6Title = document.getElementById("block6-title");

const textBlock1 = block1Title.textContent;
const textBlock6 = block6Title.textContent;

block1Title.textContent = textBlock6;
block6Title.textContent = textBlock1;

const rhombusForm = document.getElementById("rhombusForm");
const rhombusResultDiv = document.getElementById("rhombus-result");

function calculateRhombusArea(d1, d2) {
    return (d1 * d2) / 2;
}

rhombusForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Відміняємо перезавантаження сторінки
    const d1 = parseFloat(document.getElementById("d1").value);
    const d2 = parseFloat(document.getElementById("d2").value);

    if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) {
        rhombusResultDiv.textContent = "Будь ласка, введіть коректні додатні значення для діагоналей.";
        return;
    }

    const rhombusArea = calculateRhombusArea(d1, d2);
    rhombusResultDiv.textContent = `Площа ромба = ${rhombusArea}`;
});




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


const triangleCookie = getCookie("triangleResult");

const triangleForm = document.getElementById("triangleForm");

if(triangleCookie) {
    const userChoice = confirm(
        "У cookies збережено: " + triangleCookie +
        ". Видалити дані з cookies?"
    );

    if(userChoice) {
        deleteCookie("triangleResult");
        location.reload();
    } else {

        alert("Cookies залишились. Для відновлення початкового стану перезавантажте сторінку (F5).");
        triangleForm.style.display = "none";
    }
} else {

    triangleForm.addEventListener("submit", function(e){
        e.preventDefault();
        const sideA = parseFloat(document.getElementById("sideA").value);
        const sideB = parseFloat(document.getElementById("sideB").value);
        const sideC = parseFloat(document.getElementById("sideC").value);

        let canBuild = false;
        if(sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA) {
            canBuild = true;
        }

        const resultText = canBuild
            ? "Трикутник зі сторонами " + sideA + ", " + sideB + ", " + sideC + " побудувати МОЖНА."
            : "Трикутник зі сторонами " + sideA + ", " + sideB + ", " + sideC + " побудувати НЕ можна!";

        alert(resultText);

        setCookie("triangleResult", resultText, 1);
    });
}


const block2 = document.getElementById("block2");
const italicForm = document.getElementById("italicForm");

let storedItalic = localStorage.getItem("block2Italic");
if(storedItalic && storedItalic === "on") {
    block2.style.fontStyle = "italic";
    italicForm.elements["italic"].value = "on";
    italicForm.querySelector("input[value='on']").checked = true;
} else {
    block2.style.fontStyle = "normal";
    italicForm.querySelector("input[value='off']").checked = true;
}

italicForm.addEventListener("change", function(e){
    const value = e.target.value;
    if(value === "on") {
        localStorage.setItem("block2Italic", "on");
    } else {
        localStorage.setItem("block2Italic", "off");
    }
});

block2.addEventListener("mouseover", function(){
    let status = localStorage.getItem("block2Italic");
    if(status === "on") {
        block2.style.fontStyle = "italic";
    } else {
        block2.style.fontStyle = "normal";
    }
});



function applyZebraToOl(ol) {
    const liItems = ol.querySelectorAll("li");
    liItems.forEach((li, index) => {
        if(index % 2 === 0) {
            li.style.backgroundColor = "#fff";
            li.style.color = "#000";
        } else {
            li.style.backgroundColor = "#000";
            li.style.color = "#fff";
        }
    });
}

function createListForm(blockNumber) {
    const container = document.getElementById(`list-container-${blockNumber}`);
    if(container.querySelector(".list-form")) return;

    const form = document.createElement("form");
    form.className = "list-form";
    form.innerHTML = `
    <label>Введіть пункт списку:</label>
    <input type="text" name="listItem" required>
    <button type="submit">Додати</button>
    <button type="button" class="save-list">Зберегти список</button>
  `;

    const ol = document.createElement("ol");
    ol.className = "zebra-list";

    container.appendChild(form);
    container.appendChild(ol);

    form.addEventListener("submit", function(e){
        e.preventDefault();
        const input = form.querySelector("[name='listItem']");
        const text = input.value.trim();
        if(!text) return;

        const li = document.createElement("li");
        li.textContent = text;
        ol.appendChild(li);
        input.value = "";
        applyZebraToOl(ol);
    });

    const saveBtn = form.querySelector(".save-list");
    saveBtn.addEventListener("click", function(){
        const liItems = ol.querySelectorAll("li");
        let itemsArray = [];
        liItems.forEach(li => itemsArray.push(li.textContent));
        localStorage.setItem(`listData-block${blockNumber}`, JSON.stringify(itemsArray));
        alert("Список збережено в LocalStorage!");
    });
}

function restoreList(blockNumber) {
    const container = document.getElementById(`list-container-${blockNumber}`);
    const data = localStorage.getItem(`listData-block${blockNumber}`);
    if(data) {
        const itemsArray = JSON.parse(data);
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

document.querySelectorAll(".create-list-link").forEach(link => {
    link.addEventListener("click", function(e){
        e.preventDefault();
        const blockNumber = link.getAttribute("data-block");
        createListForm(blockNumber);
    });
});

restoreList(1);
restoreList(5);
restoreList(6);
