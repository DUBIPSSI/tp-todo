const todosContainer = document.getElementById('todosContainer');

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
            fetchTodos();
            return response.json();
        })
    }
})
function fetchTodos() {
    todosContainer.innerHTML = '';
    fetch('http://localhost:3000/todos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Réseau a les cramptex');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(todo => {
            displayTodo(todo)
        });
    })
    .catch(error => console.error('trop relou ca bug:', error));
}

function displayTodo(todo) {
    const div = document.createElement('div');

    const p = document.createElement('p');
    p.textContent = todo.description;

    const cross =  document.createElement('img');
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
    div.appendChild(cross);
    todosContainer.appendChild(div);
}
fetchTodos();