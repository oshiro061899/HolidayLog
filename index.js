// 現在のステータスフィルター
let currentFilter = 'all'; // 'all', 'todo', 'done'
let currentCategoryFilter = 'すべて'; // 初期値はすべて表示

// 進捗状況の処理
function statusButtonCounts() {
    const logs = JSON.parse(localStorage.getItem('holidayLogs')) || [];
    // 全データ数
    const totalCount = logs.length;
    // 完了済みの数
    const doneCount = logs.filter(l => l.status === 'done').length;
    // 未達成の数
    const todoCount = totalCount - doneCount;
    document.getElementById('status-all').innerText = `すべて(${totalCount})`;
    document.getElementById('status-todo').innerText = `未達成(${todoCount})`;
    document.getElementById('status-done').innerText = `達成済み(${doneCount})`;
    document.getElementById('status-card_todo').innerHTML = `
        <span>残りの予定</span>
        <h3>□${todoCount}</h3>
        <span>${totalCount}個中</span>
    `;
    document.getElementById('status-card_done').innerHTML = `
        <span>達成済み</span>
        <h3>☑${doneCount}</h3>
        <span>${totalCount}個中</span>
    `;
}


// 画面表示するメイン処理
function renderLogs() {
    // localStorageからデータを取得
    const savedData = localStorage.getItem('holidayLogs');
    // データを配列に変換する(データが空なら空の配列 []を使用)
    let logs = savedData ? JSON.parse(savedData) : [];

    // --- 絞り込み ---
    if (currentFilter === 'todo') {
        logs = logs.filter(log => log.status !== 'done');
    } else if (currentFilter === 'done') {
        logs = logs.filter(log => log.status === 'done');
    }
    if (currentCategoryFilter !== 'すべて') {
        logs = logs.filter(log => log.category === currentCategoryFilter);
    }

    const listContainer = document.getElementById('list_container');
    listContainer.innerHTML = ''; // クリア

    // 空の場合
    if (logs.length === 0) {
        listContainer.innerHTML = '<p class="empty-msg">表示する予定はありません。</p>';
        return;
    }

    // 予定の表示
    logs.forEach((log, index) => {
        const li = document.createElement('li');
        li.className = 'todo-card';
        const isDone = log.status === 'done'; // ステータスがdoneならtrue
        li.innerHTML = `
            <details class="card">
                <summary class="detail-open">
                    <input type="checkbox" data-index="${index}" class="status-checkbox"${log.status === 'done' ? 'checked' : ''}>
                    <h3>${log.title}</h3>
                    <span class="note">${log.note}</span><br>
                    <div class="bats">
                        <span class="category tag">${log.category}</span><br>
                        <span class="priority tag">${log.priority}</span>
                    </div>
                    <span class="delete-btn" data-index="${index}">🗑️</span>
                </summary>
                <a href="${log.url}" class="url-link"+><span class="url">${log.url}</span></a><br>
                <span class="date">📆${log.date}</span>
                <span class="area">📍${log.area}</span>
            </details>
        `;
        listContainer.appendChild(li);
    });
}


// 削除処理
document.getElementById('list_container').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        // 確認ダイアログを表示
        const isConfirmed = confirm("本当にこの予定を削除しますか？");

        // 「キャンセル」が押された場合は中断
        if (!isConfirmed) {
            return;
        }

        const index = e.target.getAttribute('data-index');
        // 配列から削除
        const logs = JSON.parse(localStorage.getItem('holidayLogs'));
        logs.splice(index, 1); // index番目から1つ分を削除
        // localStorageを更新
        localStorage.setItem('holidayLogs', JSON.stringify(logs));
        renderLogs();
        statusButtonCounts();
    }
});


// チェックボックスの処理
document.getElementById('list_container').addEventListener('change', (e) => {
    if (e.target.classList.contains('status-checkbox')) {
        if (currentFilter === 'done' && !e.target.checked) {
            e.target.checked = true; // 強制的にONに戻す
            return;
        }
        const index = e.target.getAttribute('data-index');
        const isChecked = e.target.checked; // true(ON) か false(OFF) か
        // LocalStorageからデータを取得
        const logs = JSON.parse(localStorage.getItem('holidayLogs'));
        // ステータスを更新
        logs[index].status = isChecked ? 'done' : 'todo';
        // LocalStorageを保存し直す
        localStorage.setItem('holidayLogs', JSON.stringify(logs));
        statusButtonCounts();
    }
});


// フィルターボタン
document.querySelector('.status-filter').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        // 全てのボタンから 'active-now' を消す
        document.querySelectorAll('.status-filter button').forEach(btn => {
            btn.classList.remove('active-now');
        });
        // クリックされたボタンに 'active-now' を付ける
        e.target.classList.add('active-now');

        if (e.target.id === 'status-all'){currentFilter = 'all'};
        if (e.target.id === 'status-todo') currentFilter = 'todo';
        if (e.target.id === 'status-done') currentFilter = 'done';

        renderLogs();
    }
});

// カテゴリー選択ボタン
document.querySelector('.category-section').addEventListener('click', (e) => {
    if (e.target.classList.contains('category-filter')) {
        currentCategoryFilter = e.target.textContent; // ボタンの文字を取得
        renderLogs();
    }
});


renderLogs();
statusButtonCounts();