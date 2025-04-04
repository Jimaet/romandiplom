function showCategory(category) {
    // Скрыть все категории
    const categories = document.querySelectorAll('.category');
    categories.forEach(cat => cat.style.display = 'none');
    
    // Показать выбранную категорию
    const selectedCategory = document.getElementById(category);
    selectedCategory.style.display = 'flex';
}

function openPage(page) {
    alert("Открыта страница с кнопкой: " + page);
    // Здесь можно добавлять переходы или дополнительные действия при выборе.
}
