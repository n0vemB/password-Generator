document.addEventListener('DOMContentLoaded', () => {
    const passwordsList = document.getElementById('passwordsList');
    const lengthInput = document.getElementById('length');
    const quantityInput = document.getElementById('quantity');
    const excludeInput = document.getElementById('exclude');
    const generateBtn = document.getElementById('generateBtn');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const exportBtn = document.getElementById('exportBtn');

    // 生成密码的函数
    function generatePassword(length, excludeChars = '') {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        
        let chars = uppercase + lowercase + numbers;
        
        // 移除要规避的字符
        if (excludeChars) {
            chars = chars.split('').filter(char => !excludeChars.includes(char)).join('');
        }
        
        // 确保至少包含每种类型的一个字符
        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        
        // 填充剩余长度
        for (let i = password.length; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }
        
        // 打乱密码字符顺序
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    // 创建密码项的函数
    function createPasswordItem(password) {
        const item = document.createElement('div');
        item.className = 'password-item';
        
        const text = document.createElement('span');
        text.className = 'password-text';
        text.textContent = password;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '复制';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(password).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '已复制!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        });
        
        item.appendChild(text);
        item.appendChild(copyBtn);
        return item;
    }

    // 导出Excel文件
    function exportToExcel() {
        const passwords = Array.from(passwordsList.getElementsByClassName('password-text'))
            .map(span => span.textContent);
            
        if (passwords.length === 0) {
            alert('请先生成密码');
            return;
        }

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 创建工作表数据
        const wsData = [
            ['序号', '密码'],
            ...passwords.map((password, index) => [index + 1, password])
        ];
        
        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '密码列表');
        
        // 生成文件名
        const fileName = `密码列表_${new Date().toISOString().slice(0,10)}.xlsx`;
        
        // 导出文件
        XLSX.writeFile(wb, fileName);
    }

    // 生成按钮点击事件
    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthInput.value);
        const quantity = parseInt(quantityInput.value);
        const excludeChars = excludeInput.value;
        
        if (length < 4 || length > 32) {
            alert('密码长度必须在4-32位之间');
            return;
        }
        
        if (quantity < 1 || quantity > 100) {
            alert('生成数量必须在1-100之间');
            return;
        }
        
        if (excludeChars.length > 6) {
            alert('最多只能规避6个字符');
            return;
        }
        
        // 清空现有密码列表
        passwordsList.innerHTML = '';
        
        // 生成指定数量的密码
        for (let i = 0; i < quantity; i++) {
            const password = generatePassword(length, excludeChars);
            passwordsList.appendChild(createPasswordItem(password));
        }
    });

    // 复制所有密码按钮点击事件
    copyAllBtn.addEventListener('click', () => {
        const passwords = Array.from(passwordsList.getElementsByClassName('password-text'))
            .map(span => span.textContent)
            .join('\n');
            
        if (passwords) {
            navigator.clipboard.writeText(passwords).then(() => {
                const originalText = copyAllBtn.textContent;
                copyAllBtn.textContent = '已复制所有密码!';
                setTimeout(() => {
                    copyAllBtn.textContent = originalText;
                }, 2000);
            });
        }
    });

    // 导出按钮点击事件
    exportBtn.addEventListener('click', exportToExcel);

    // 页面加载时生成一个初始密码
    generateBtn.click();
});