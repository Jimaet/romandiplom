document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        alert(`Вы выбрали: ${button.dataset.name}`);
    });
});
