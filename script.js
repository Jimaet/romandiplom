document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchResult = document.getElementById("search-result");

    searchInput.addEventListener("input", async function () {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 3) {
            searchResult.innerHTML = "";
            return;
        }

        const files = ["macroscope_data.json", "stahanovets_data.json", "glpi_data.json", "outlook_data.json"];
        let bestMatch = null;
        let bestMatchScore = 0;

        for (const file of files) {
            try {
                const response = await fetch(file);
                const data = await response.json();

                for (const category in data) {
                    data[category].forEach(item => {
                        const problem = item.проблема.toLowerCase();
                        const solution = item.решение;

                        // Проверяем, есть ли точное вхождение
                        if (problem.includes(query)) {
                            searchResult.innerHTML = `<p><strong>Найдено решение:</strong></p><p>${solution}</p>`;
                            return;
                        }

                        // Если нет точного вхождения, проверяем на схожесть
                        const similarity = levenshtein(query, problem);
                        if (similarity > bestMatchScore) {
                            bestMatchScore = similarity;
                            bestMatch = solution;
                        }
                    });
                }
            } catch (error) {
                console.error(`Ошибка загрузки ${file}:`, error);
            }
        }

        // Если точного совпадения не найдено, выводим ближайшее
        if (bestMatch) {
            searchResult.innerHTML = `<p><strong>Возможно, вы имели в виду:</strong></p><p>${bestMatch}</p>`;
        } else {
            searchResult.innerHTML = `<p>Решение не найдено. Попробуйте изменить запрос.</p>`;
        }
    });
});

// Алгоритм Левенштейна (поиск наибольшего сходства)
function levenshtein(a, b) {
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
        for (let j = 0; j <= b.length; j++) {
            if (i === 0) {
                matrix[i][j] = j;
            } else if (j === 0) {
                matrix[i][j] = i;
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1, // Удаление
                    matrix[i][j - 1] + 1, // Вставка
                    matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // Замена
                );
            }
        }
    }
    return 1 - matrix[a.length][b.length] / Math.max(a.length, b.length);
}

// Функция для перехода на страницы
function redirectTo(page) {
    window.location.href = page;
}

