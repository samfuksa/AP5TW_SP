const apiKey = 'fca_live_5VAfoVp6ys7W8pHISA6t1xNnEIJ2ckD0TW1Gh0gu';

// Funkce pro získání a výpis kurzů k ostatním měnám
function displayAllCurrencies(startCurrency) {
    const allCurrenciesDiv = document.getElementById("all_currencies");



    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${startCurrency}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const allCurrencies = Object.keys(myJson.data);

            // Vytvoření a výpis kurzů ke všem měnám
            allCurrencies.forEach(currency => {
                if (currency !== startCurrency) {
                    const rate = myJson.data[currency];
                    const currencyItem = document.createElement('div');
                    currencyItem.textContent = `${startCurrency} k ${currency}: ${rate.toFixed(4)}`;
                    allCurrenciesDiv.appendChild(currencyItem);
                }
            });
        })
        .catch(function (error) {
            console.error('Chyba při získávání dat:', error);
        });
}

// Funkce pro uložení konverze do localStorage
function saveConversionToLocalStorage(startCurrency, endCurrency, valueCurrency, convertedValue) {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    const timestamp = new Date().toLocaleString();
    history.unshift({ startCurrency, endCurrency, valueCurrency, convertedValue, timestamp });
    localStorage.setItem('conversionHistory', JSON.stringify(history));
}

// Funkce pro zobrazení historie konverzí s omezením na posledních 10 záznamů
function displayConversionHistory() {
    const historyDiv = document.getElementById('history');
    const conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    // Omezení na posledních 5 záznamů
    const lastTenEntries = conversionHistory.slice(0, 5);

    // Vypisování historie konverzí od nejnovějšího po nejstarší
    historyDiv.innerHTML = '';
    lastTenEntries.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.textContent = `${entry.timestamp} - Převedeno ${entry.valueCurrency} ${entry.startCurrency} na ${entry.endCurrency}: ${entry.convertedValue}`;
        historyDiv.appendChild(historyItem);
    });
}


// Zavolání funkce pro zobrazení kurzů při načtení stránky s výchozí měnou CZK
document.addEventListener('DOMContentLoaded', function () {
    displayAllCurrencies('CZK');
    displayConversionHistory();
});

// Reakce na odeslání formuláře pro převod měn (EUR -> USD atd..)
const form = document.getElementById("change_currency");

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const startCurrency = document.querySelector("#start_currency").value;
    const endCurrency = document.querySelector("#end_currency").value;
    const valueCurrency = parseFloat(document.querySelector("#value_currency").value);

    if (isNaN(valueCurrency)) {
        alert('Zadejte platné číslo pro částku k převedení.');
        return;
    }

    const finalCurrency = document.querySelector("#prevod_aktualni");

    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${startCurrency}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const exchangeRate = myJson.data[endCurrency];
            const convertedValue = valueCurrency * exchangeRate;
            finalCurrency.textContent = "Váš převod  " + startCurrency + " do " + endCurrency + " je: " + convertedValue.toFixed(2);

            // Uložení konverze do localStorage
            saveConversionToLocalStorage(startCurrency, endCurrency, valueCurrency, convertedValue);
            // Znovu zobrazit historii konverzí
            displayConversionHistory();
        })
        .catch(function (error) {
            console.error('Chyba při získávání dat:', error);
        });
});



// Funkce pro uložení oblíbené měny do localStorage
function saveFavouriteCurrencyToLocalStorage(favouriteCurrency) {
    localStorage.setItem('favouriteCurrency', favouriteCurrency);
    displayFavouriteCurrency();
}

// Funkce pro zobrazení oblíbené měny
function displayFavouriteCurrency() {
    const favouriteCurrencyDiv = document.getElementById('favourite_currency');
    const storedFavouriteCurrency = localStorage.getItem('favouriteCurrency');

    if (storedFavouriteCurrency) {
        favouriteCurrencyDiv.textContent = `Vaše oblíbená měna: ${storedFavouriteCurrency}`;
    } else {
        favouriteCurrencyDiv.textContent = 'Vaše oblíbená měna není nastavena.';
    }
}

// Zobrazení uložené oblíbené měny při načtení stránky
document.addEventListener('DOMContentLoaded', function () {
    displayFavouriteCurrency();
});

// Reakce na odeslání formuláře pro uložení oblíbené měny
const favouriteCurrencyForm = document.getElementById('favourite_currency_form');

favouriteCurrencyForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const favouriteCurrency = document.querySelector('#start_currency_favourite').value;
    saveFavouriteCurrencyToLocalStorage(favouriteCurrency);
});

// Reakce na odeslání formuláře pro převod oblíbené měny
const favouriteCurrencyFormConvert = document.getElementById('favourite_currency_form_convert');

favouriteCurrencyFormConvert.addEventListener('submit', function (event) {
    event.preventDefault();

    const startCurrency = localStorage.getItem('favouriteCurrency');
    const endCurrency = 'CZK'; // Konverze na CZK
    const valueCurrency = parseFloat(document.querySelector('#value_currency_favourite').value);

    if (isNaN(valueCurrency)) {
        alert('Zadejte platné číslo pro částku k převedení.');
        return;
    }

    const finalCurrency = document.querySelector('#prevod_aktualni_oblibena');

    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${startCurrency}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const exchangeRate = myJson.data[endCurrency];
            const convertedValue = valueCurrency * exchangeRate;
            finalCurrency.textContent = `Váš převod ${startCurrency} do ${endCurrency} je: ${convertedValue.toFixed(2)}`;

            // Uložení konverze do localStorage
            saveConversionToLocalStorage(startCurrency, endCurrency, valueCurrency, convertedValue);
            // Znovu zobrazit historii konverzí
            displayConversionHistory();
        })
        .catch(function (error) {
            console.error('Chyba při získávání dat:', error);
        });
});

