const API_URL = 'http://localhost:5005/api';

function showRegisterPage() {
    document.getElementById('register-page').style.display = 'block';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('account-page').style.display = 'none';
    document.getElementById('transaction-page').style.display = 'none';
}

function showLoginPage() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('account-page').style.display = 'none';
    document.getElementById('transaction-page').style.display = 'none';
}

function showAccountPage() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('account-page').style.display = 'block';
    document.getElementById('transaction-page').style.display = 'block';
}

function showTransactionPage() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('account-page').style.display = 'none';
    document.getElementById('transaction-page').style.display = 'block';
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        showAccountPage();
    } else {
        alert(data.error);
    }
}

async function createAccount() {
    const bankAccountNumber = document.getElementById('bank-account-number').value;
    const sortCode = document.getElementById('sort-code').value;
    const dailyWithdrawalLimit = document.getElementById('daily-withdrawal-limit').value;
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/account`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ bankAccountNumber, sortCode, dailyWithdrawalLimit })
    });

    const data = await response.json();
    document.getElementById('account-info').innerText = JSON.stringify(data, null, 2);
    showTransactionPage();
}

async function createTransaction() {
    const type = document.getElementById('transaction-type').value;
    const amount = document.getElementById('amount').value;
    const beneficiaryAccount = document.getElementById('beneficiary-account').value;
    const beneficiarySortCode = document.getElementById('beneficiary-sort-code').value;
    const token = localStorage.getItem('token');
    const accountId = JSON.parse(document.getElementById('account-info').innerText).accountId;

    const response = await fetch(`${API_URL}/account/transaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ type, amount, beneficiaryAccount, beneficiarySortCode })
    });

    const data = await response.json();
    document.getElementById('balance-info').innerText = `New Balance: ${data.balance}`;
}
