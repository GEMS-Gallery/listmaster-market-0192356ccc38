import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item-input');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `shopping-item ${item.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" ${item.completed ? 'checked' : ''}>
        <span>${item.name}</span>
        <button><i class="fas fa-trash"></i></button>
      `;
      
      // Toggle item completion
      li.querySelector('input[type="checkbox"]').addEventListener('change', async () => {
        await backend.toggleItem(item.id);
        renderShoppingList();
      });

      // Delete item
      li.querySelector('button').addEventListener('click', async () => {
        await backend.deleteItem(item.id);
        renderShoppingList();
      });

      shoppingList.appendChild(li);
    });
  }

  // Add new item
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = newItemInput.value.trim();
    if (name) {
      await backend.addItem(name);
      newItemInput.value = '';
      renderShoppingList();
    }
  });

  // Initial render
  renderShoppingList();
});
