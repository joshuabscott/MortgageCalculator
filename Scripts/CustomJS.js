﻿// Calculate calls all other functions
function Calculate(loan, term, rate) {
    // Rate includes decimal
    rate = parseFloat(rate);
    loan = parseInt(loan.replace(/$/, '').replace(/,/g, '').replace(/./, ''));
    const table = document.getElementById("tbody");
    
    if (isNaN(loan)) {
        return;
    }
    // If there's already a table, remove it
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    // So money is rounded to 2 decimal places
    let precision = 2;
    // Total Principal = loan
    document.getElementById("totalprincipal").innerHTML = `${accounting.formatMoney(loan)}`;
    console.log(rate);
    console.log(typeof (rate));
    let totalMonthlyPayment;
    if (isNaN(rate)) {
        rate = 0;
        totalMonthlyPayment = loan / term;
    } else {
        //Total Monthly Payment = (amount loaned) * (rate/1200) / (1 – (1 + rate/1200)(-Number of Months) )
        // Equation 1
        totalMonthlyPayment = (loan * (rate / 1200)) / (1 - Math.pow((1 + rate / 1200), -Math.abs(term)));
    }
    
    document.getElementById("monthlypayment").innerHTML = `${accounting.formatMoney(totalMonthlyPayment.toFixed(precision))}`;
    // before the very first month equals the amount of the loan
    // Equation 2
    let remainingBalance = loan;
    // Interest starting at zero 
    let totalInterest = 0;
    for (let i = 1; i <= term; i++) {
        //Equation 3
        let interestPayment = remainingBalance * (rate / 1200);
        totalInterest += interestPayment;
        //Equation 4
        let principalPayment = totalMonthlyPayment - interestPayment;
        //Equation 5 remainingBalance = remainingBalance - principalPayment
        remainingBalance -= principalPayment;
        // Create row in table
        let row = table.insertRow();
        row.setAttribute("scope", "row");
        //the table has a Header, Tbody, Row, Cell, and TextNode
        let cell = row.insertCell();
        let text = document.createTextNode(i.toString());
        cell.appendChild(text);
        // Payment
        cell = row.insertCell();
        text = document.createTextNode(accounting.formatMoney(totalMonthlyPayment.toFixed(precision)));
        cell.appendChild(text);
        // Principal
        cell = row.insertCell();
        text = document.createTextNode(accounting.formatMoney(principalPayment.toFixed(precision)));
        cell.appendChild(text);
        // Interest
        cell = row.insertCell();
        text = document.createTextNode(accounting.formatMoney(interestPayment.toFixed(precision)));
        cell.appendChild(text);
        // Total Interest
        cell = row.insertCell();
        text = document.createTextNode(accounting.formatMoney(totalInterest.toFixed(precision)));
        cell.appendChild(text);
        // Balance
        cell = row.insertCell();
        text = document.createTextNode(accounting.formatMoney(remainingBalance.toFixed(precision)));
        cell.appendChild(text);
    }
    let totalCost = parseInt(loan) + totalInterest;
    document.getElementById("totalinterest").innerHTML = `${accounting.formatMoney(totalInterest.toFixed(precision))}`;
    document.getElementById("totalcost").innerHTML = `${accounting.formatMoney(totalCost)}`;
}

// Rate accepts decimals up to 3 places
function validateRate(rate) {
    let char = rate.charAt(rate.length - 1);
    if (char == '.') {
        rate = rate.split('');
        rate.splice(rate.length - 1, 1);
        if (rate.indexOf(char) < 0) {
            rate.splice(rate.length, 0, char);
        }
        rate = rate.join('');
        document.getElementById("rate").value = rate;
    }
    if ((isNaN(parseInt(char)) && char != '.') || rate.length > 5) {
        rate = rate.split('');
        rate.splice(rate.length - 1, 1);
        rate = rate.join('');
        document.getElementById("rate").value = rate;
    }
}

//Reset button
function Reset() {
    document.getElementById("loan").value = "$100,000";
    document.getElementById("rate").value = "3.92";
    document.getElementById("term").value = "360";
    document.getElementById("monthlypayment").innerText = "$0.00";
    document.getElementById("totalprincipal").innerText  = "$0.00";
    document.getElementById("totalinterest").innerText  = "$0.00";
    document.getElementById("totalcost").innerText  = "$0.00";

    let table = document.getElementById("tbody");
    // If there's already a table, remove it
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}