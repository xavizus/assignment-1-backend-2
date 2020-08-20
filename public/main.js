window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.autoSizingInput').forEach( element => {
        element.addEventListener('input', changeInputSize);
    });
    document.querySelector('#submitTask').addEventListener('click', addTask);
    init();
});

async function addTask() {
    let title = document.querySelector('#addTask').value;
    let response = await fetch('/api/v1/addTodoItem', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"title": title})
    }).then(response => {
        let result = response.json()
        if(response.status != 200) {
            throw new Error(result);
        }
        return result;
    }).catch(error => {
        console.log(error);
       return false;
    });
    console.log(response);
}

function changeInputSize () {
    const minSize = 25;
    const maxSize = 100;
    let sizeToSet;
    let charactersLength = this.value.length;

    if (charactersLength >= minSize && charactersLength <= maxSize) {
        sizeToSet = charactersLength;
    } else if (charactersLength < minSize) {
        sizeToSet = minSize;
    } else if (charactersLength > maxSize) {
        sizeToSet = maxSize;
    }
    this.style.width = sizeToSet + "ch";
}

function init() {
    getTodoItems();
}


async function getTodoItems(sortDir="DESC") {
    let tableElement = document.querySelector('#tableContent');
    let todoItems = await fetch('/api/v1/allTodoItems').then(response => response.json());
    if(!Array.isArray(todoItems) || todoItems.length === 0) {
        tableElement.textContent = "No todo items";
        return;
    }
    let table = document.createElement('table');
    table.setAttribute('class', 'table');
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    let columns = ['Title', 'Done', 'Created', 'Last updated'];
    for (let column of columns) {
        let th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.textContent = column;
        tr.append(th);
    }
    thead.append(tr);
    table.append(thead);
    tableElement.append(table);

    let tbody = document.createElement('tbody');
    for(todoItem of todoItems) {
        console.log(todoItem);
        let tr = document.createElement('tr');
        let title = document.createElement('th').textContent = todoItem.title;
        let done = document.createElement('th');

        tr.append(title);
        tbody.append(tr);
    }
    table.append(tbody);
}