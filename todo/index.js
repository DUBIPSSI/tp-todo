const todosContainer = document.getElementById('todosContainer');
const editModal = document.getElementById('editModal');
const modifTodo = document.getElementById('modifTodo');
const selectCategorie = document.getElementById('selectCategorie');

document.addEventListener('click', (e)=>{
    if (e.target.id === "addTodo") {
        const description = document.getElementById('todoDescription').value;
        const categorie = document.getElementById('todoCategorie').value;
        fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, categorie })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            getTodos();
            return response.json();
        })
    }
    if (e.target.id === "editModal") {
        editModal.style.display = "none";
    }
})

selectCategorie.addEventListener('input', ()=>{
    getTodos();
})
function getTodos() {
    todosContainer.innerHTML = '';
    fetch('http://localhost:3000/todos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Réseau a les cramptex');
        }
        return response.json();
    })
    .then(data => {
        const selectedCategorie = document.getElementById('selectCategorie').value;
        if (selectedCategorie === "all") {
            data.forEach(todo => {
                displayTodo(todo);
            });
        } else {
            data.forEach(todo => {
                if (todo.categorie == selectedCategorie) {
                    displayTodo(todo);
                }
            });
        }
    })
    .catch(error => console.error('trop relou ca bug:', error));
}

function displayEditModal() {
    editModal.querySelector('#editDescription').value = "";
    editModal.style.display='flex';
}

function displayTodo(todo) {
    const div = document.createElement('div');

    const p = document.createElement('p');
    console.log(todo.description);
    p.textContent = todo.description;

    const edit = document.createElement('img');
    edit.className = "edit";
    edit.src = "edit.svg";
    edit.dataset.id = todo.id;
    edit.addEventListener('click', ()=>{
        displayEditModal();
        document.getElementById('editDescription').value = todo.description;
        modifTodo.addEventListener('click', ()=>{
            const description = document.getElementById('editDescription').value;
            const categorie = document.getElementById('editCategorie').value;
            console.log(description,'categorie : ', categorie,'id : ' , todo.id);
            fetch(`http://localhost:3000/todos/${todo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, categorie})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                editModal.style.display='none';
                getTodos();
                return response.text();
            })
        })
    })

    const cross =  document.createElement('img');
    cross.className = "cross";
    cross.src="cross.svg";
    cross.dataset.id = todo.id;
    cross.addEventListener('click', ()=>{
        fetch(`http://localhost:3000/todos/${todo.id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            div.remove();
            return response.text();
        })
    })

    div.appendChild(p);
    div.appendChild(edit);
    div.appendChild(cross);
    todosContainer.appendChild(div);
}
getTodos();