const form = document.getElementById('item-form');
const nameInput = document.getElementById('name');
const quantityInput = document.getElementById('quantity');
const categoryInput = document.getElementById('category');
const itemList = document.getElementById('item-list');
const clearAllBtn = document.getElementById('clear-all');
const exportBtn = document.getElementById('export-list');

let items = [];

function loadItems() {
    const data = localStorage.getItem('shoppingList');
    if (data) {
        items = JSON.parse(data);
    } else {
        items = [
            { id: '1', name: 'Leche', quantity: '2 litros', category: 'Lácteos', purchased: false },
            { id: '2', name: 'Pan', quantity: '1 barra', category: 'Panadería', purchased: false },
            { id: '3', name: 'Manzanas', quantity: '6 unidades', category: 'Frutas', purchased: false }
        ];
    }
}

function saveItems() {
    localStorage.setItem('shoppingList', JSON.stringify(items));
}

function createItemElement(item) {
    const li = document.createElement('li');
    li.className = 'item';
    if (item.purchased) li.classList.add('purchased');
    li.dataset.id = item.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.purchased;
    checkbox.addEventListener('change', () => togglePurchased(item.id));

    const label = document.createElement('label');
    label.textContent = `${item.name} (${item.category}) - ${item.quantity}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.style.color = '#007bff';
    editBtn.addEventListener('click', () => editItem(item.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => deleteItem(item.id, li));

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
}

function renderItems() {
    itemList.innerHTML = '';
    items.forEach(item => {
        const li = createItemElement(item);
        itemList.appendChild(li);
        requestAnimationFrame(() => li.classList.add('show'));
    });
}

function addItem(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const quantity = quantityInput.value.trim();
    const category = categoryInput.value.trim();
    if (!name || !quantity || !category) return;

    const item = {
        id: Date.now().toString(),
        name,
        quantity,
        category,
        purchased: false
    };
    items.push(item);
    saveItems();
    const li = createItemElement(item);
    itemList.appendChild(li);
    requestAnimationFrame(() => li.classList.add('show'));
    form.reset();
}

function togglePurchased(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.purchased = !item.purchased;
    saveItems();
    renderItems();
}

function deleteItem(id, element) {
    element.classList.remove('show');
    setTimeout(() => {
        items = items.filter(i => i.id !== id);
        saveItems();
        renderItems();
    }, 300);
}

function editItem(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newName = prompt('Nombre del producto', item.name);
    if (newName !== null && newName.trim() !== '') {
        item.name = newName.trim();
    }
    const newQty = prompt('Cantidad', item.quantity);
    if (newQty !== null && newQty.trim() !== '') {
        item.quantity = newQty.trim();
    }
    const newCategory = prompt('Categoría', item.category);
    if (newCategory !== null && newCategory.trim() !== '') {
        item.category = newCategory.trim();
    }
    saveItems();
    renderItems();
}

function clearAll() {
    items = [];
    saveItems();
    renderItems();
}

function exportList() {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista_compra.json';
    a.click();
    URL.revokeObjectURL(url);
}

form.addEventListener('submit', addItem);
clearAllBtn.addEventListener('click', clearAll);
exportBtn.addEventListener('click', exportList);

loadItems();
renderItems();
