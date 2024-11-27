let data = { transactions: [] };

// Initialize or Load Data
function loadData() {
    const savedData = localStorage.getItem('transactions');
    if (savedData) {
        data = JSON.parse(savedData);
    } else {
        localStorage.setItem('transactions', JSON.stringify(data));
    }
    updateSummary();
}
function align(data, staticLength){
    if(data !== null && data !== undefined && data.length > 0){
        length = data.length;
        var value = "";
        if(staticLength > length){
            for(var i=0;i<(staticLength-length);i++){
                value += "-";
            }
        }
        return data+value;
    }else{
        var value = "";
        for(var i=0;i<staticLength;i++){
            value += " ";
        }
        return value;
    }
}

// Update the Summary Display
function updateSummary() {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = '';

    let totals = { card: 0, savings: 0, wallet: 0, house: 0, snacks: 0, stuff: 0 };
    let totalMarked = 0;

    data.transactions.forEach((transaction, index) => {
        totals.card += transaction.card;
        totals.savings += transaction.savings;
        totals.wallet += transaction.wallet;
        totals.house += transaction.house;
        totals.snacks += transaction.snacks;
        totals.stuff += transaction.stuff;

        // Add to totalMarked if the transaction is flagged
        if (transaction.flag) {
            totalMarked +=
                transaction.card +
                transaction.savings +
                transaction.wallet +
                transaction.house +
                transaction.snacks +
                transaction.stuff;
        }

        const row = document.createElement('div');
        row.textContent = `${align(transaction.note,20)} | Card: ${align(transaction.card.toFixed(2),6)} | Savings: ${align(transaction.savings.toFixed(2),6)} | Wallet: ${align(transaction.wallet.toFixed(2),6)}`;
        if (transaction.flag) {
            row.classList.add('flagged'); // CSS class for highlighting
            row.setAttribute('data-flagged', 'true'); // Optional: for semantic use
        }
        if (transaction.card +
            transaction.savings +
            transaction.wallet +
            transaction.house +
            transaction.snacks + transaction.stuff>0) {row.classList.add("positive")}
        else if (transaction.card +
            transaction.savings +
            transaction.wallet +
            transaction.house +
            transaction.snacks + transaction.stuff<0) {
                row.classList.add("negative");
            }
        else {
            row.classList.add("transfer");
        }
        summaryDiv.appendChild(row);
    });

    // Display totals
    const totalsRow = document.createElement('div');
    totalsRow.innerHTML = `
        <strong>Totals:</strong> 
        Card: ${totals.card.toFixed(2)}, 
        Savings: ${totals.savings.toFixed(2)}, 
        Wallet: ${totals.wallet.toFixed(2)}, 
        House: ${totals.house.toFixed(2)}, 
        Total Marked: ${totalMarked.toFixed(2)}
    `;
    summaryDiv.appendChild(totalsRow);
}

// Create a New Transaction
function createTransaction() {
    const newTransaction = {
        card: parseFloat(prompt('Card Amount:')),
        savings: parseFloat(prompt('Savings Amount:')),
        wallet: parseFloat(prompt('Wallet Amount:')),
        house: parseFloat(prompt('House Amount:')),
        snacks: parseFloat(prompt('Snack Budget:')),
        stuff: parseFloat(prompt('Stuff Budget:')),
        note: prompt('Transaction Note:'),
        flag: confirm('Mark this transaction?')
    };
    data.transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(data));
    updateSummary();
}

// Clear All Data
function clearData() {
    if (confirm('Are you sure you want to clear all data?')) {
        localStorage.removeItem('transactions');
        data = { transactions: [] };
        updateSummary();
    }
}
function removeAllFlags() {
    if (confirm('Are you sure you want to remove all flags?')) {
        data.transactions.forEach(transaction => {
            transaction.flag = false;
        });
        localStorage.setItem('transactions', JSON.stringify(data));
        updateSummary();
        alert('All flags have been removed.');
    }
}

// Download Data as a JSON File
function downloadData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.json';
    link.click();
}
// Upload data from a JSON file
function uploadData(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const uploadedData = JSON.parse(e.target.result);
                if (uploadedData.transactions && Array.isArray(uploadedData.transactions)) {
                    data = uploadedData; // Update the data
                    localStorage.setItem('transactions', JSON.stringify(data)); // Save to localStorage
                    updateSummary();
                    alert('Data uploaded successfully.');
                } else {
                    alert('Invalid file format. Please upload a valid JSON file.');
                }
            } catch (error) {
                alert('Error reading the file. Ensure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
}


// Initialize the App
loadData();
