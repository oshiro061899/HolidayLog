document.querySelector('.add-btn').addEventListener('click', () => {
    const inputTitle = document.querySelector('input[name= "todo_title"]');
    const selectedCategory = document.querySelector('input[name="todo_category"]:checked');

    if (inputTitle.value === '') {
        alert('タイトルを入力してください！');
        return;
    }
    if (!selectedCategory) {
        alert('カテゴリーを選択してください！');
        return;
    }

    // 入力欄のデータを取得
    const newData = {
        title: document.querySelector('input[name="todo_title"]').value,
        note: document.querySelector('textarea[name="todo_note"]').value || '',
        category: document.querySelector('input[name="todo_category"]:checked')?.value,
        priority: document.querySelector('input[name="todo_priority"]:checked')?.value || '低',
        url: document.querySelector('input[name="todo_url"]').value || '',
        date: document.querySelector('input[name="todo_date"]').value || '未定',
        area: document.querySelector('input[name="todo_area"]').value || '未定',
    };
    // 既存のリストを取得（なければ空の配列を作る）
    const existingData = JSON.parse(localStorage.getItem('holidayLogs')) || [];
    // データを追加
    existingData.push(newData);
    // 文字列に変換して保存
    localStorage.setItem('holidayLogs', JSON.stringify(existingData));
    alert('保存しました！');
    // 入力内容のリセット
    document.querySelector('input[name="todo_title"]').value = '';
    document.querySelector('textarea[name="todo_note"]').value = '';
    // ラジオボタンのチェックを外す
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    // 選択ボタンの表示を戻す
    document.getElementById('now_category').textContent = '選択 ▼';
    document.getElementById('now_priority').textContent = '選択 ▼';
    // その他のリセット
    document.querySelector('input[name="todo_url"]').value = '';
    document.querySelector('input[name="todo_date"]').value = '';
    document.querySelector('input[name="todo_area"]').value = '';
});

// JSONファイルの読み込み
async function loadIdeas() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            console.error('HTTPエラー:', response.status); // ここで404などが出たらパスが違います
            return;
        }
        const data = await response.json();
        ideas = data;
        renderIdeas();
    } catch (error) {
        console.error('fetchエラー:', error); // JSONの書き方が間違っている場合ここに出る
    }
}
loadIdeas();


// アイデアをリスト表示
function renderIdeas() {

    // カテゴリのラジオボタンをすべて取得
    const categoryRadios = document.querySelectorAll('input[name="todo_category"]');
    const displayElement = document.getElementById('now_category');

    categoryRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // ラジオボタンの値をセット
            displayElement.innerText = `${e.target.value} ▼`;
             // 選択したら自動的に details を閉じる
            e.target.closest('details').removeAttribute('open');
        });
    });

    // 優先度のラジオボタンをすべて取得
    const priorityRadios = document.querySelectorAll('input[name="todo_priority"]');
    const priorityDisplay = document.getElementById('now_priority');

    priorityRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // summary内のテキストを更新
            priorityDisplay.innerText = `${e.target.value} ▼`;

            // 選択したら自動的に details を閉じる
            e.target.closest('details').removeAttribute('open');
        });
    });


    const ideaContainer = document.querySelector('.list-layout ul');
    ideaContainer.innerHTML = ''; // クリア

    ideas.forEach(idea => {
        const li = document.createElement('li');
        li.className = 'todo-card card';
        li.dataset.title = idea.title;
        li.dataset.category = idea.category;

        li.innerHTML = `
            <h3>${idea.title}</h3>
            <span class="category">${idea.category}</span>
        `;

        // カードをクリックした時の処理
        li.addEventListener('click', () => fillForm(idea));

        ideaContainer.appendChild(li);
    });
}

function fillForm(idea) {
    // フォームの入力欄を取得
    const titleInput = document.querySelector('input[name="todo_title"]');

    // 値をセット
    titleInput.value = idea.title;

    // ラジオボタンの選択（カテゴリー）
    const categoryRadios = document.querySelectorAll('input[name="todo_category"]');
    categoryRadios.forEach(radio => {
        if (radio.value === idea.category) {
            radio.checked = true;
        }
    });

    // 選択されたカテゴリーを表示部分にセット
    const displayElement = document.getElementById('now_category');
    if (displayElement) {
        displayElement.innerText = `${idea.category} ▼`;
    }

    // ユーザーに分かりやすくフォーム位置へスクロール
    document.querySelector('.create-card').scrollIntoView({ behavior: 'smooth' });
}


// 実行
renderIdeas();
