const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")

/*let transactions = [
    { id: 1, name: 'Açai', amount: -10 },
    { id: 2, name: 'Salário', amount: 1000 },
    { id: 3, name: 'Cheese Cake', amount: -20 },
    { id: 4, name: 'Beat', amount: 150 }
]*/

const localStorageTransactions = JSON.parse(localStorage
    .getItem("transactions"))
let transactions = localStorage
    .getItem("transactions") !== null ? localStorageTransactions : []

function removeTransaction(ID) {
    transactions = transactions
        .filter(function(transaction){
            if (transaction.id !== ID) {
                return transaction
            }
    })
    updateLocalStorage()
    init()
}

function addTransactionIntoDOM(transaction) {
    const operator = transaction.amount < 0 ? "-" : "+"
    const CSSclass = transaction.amount < 0 ? "minus" : "plus"
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement("li")

    li.classList.add(CSSclass)
    li.innerHTML = `${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick = "removeTransaction(${transaction.id})">
            x
        </button>`

    transactionsUl.prepend(li)
};

function updateBalanceValue() {
    const transactionsAmounts = transactions.map(function(transaction) {
        return transaction.amount
    })
    const total = transactionsAmounts  
        .reduce(function(accumulator, transaction){
            return accumulator + transaction
        }, 0)  
        .toFixed(2)
    const income = transactionsAmounts
        .filter(function(value) {
            if (value > 0) {return value}
        })
        .reduce(function(accumulator, value) {
            return accumulator + value
        }, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmounts
        .filter(function(value){
            if (value < 0) {return value}
        })
        .reduce(function(accumulator, value){
            return accumulator + value
        }, 0))
        .toFixed(2)

    balanceDisplay.innerText = `R$ ${total}`
    incomeDisplay.innerText =  `R$ ${income}`
    expenseDisplay.innerText =  `R$ ${expense}`
};

function init() {
    transactionsUl.innerHTML = ""
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValue()
};

init()

const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', function(event) {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.replace(",",".").trim()

    if (transactionName === "" || transactionAmount === "") {
        alert("Preencha os dois campos antes de enviar.")
        return
    }

    const transaction = { 
        id: generateID(), 
        name: transactionName, 
        amount: parseFloat(transactionAmount)
    }
    console.log(transaction)
    transactions.push(transaction)
    init()
    updateLocalStorage()

    inputTransactionName.value = ""
    inputTransactionAmount.value = ""
})