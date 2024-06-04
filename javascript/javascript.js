/**
 * NAME: Sushi Box Maker
 * AUTHOR: Esmae Grapendaal
 * DESCRIPTION: Met de Sushi Box Maker kun je een sushi box voor 1 persoon, 2 personen of 3 personen samenstellen.
 * Je maakt één box van maximaal vier sushi soorten.
 * Als je voor 2 personen een sushi box wil, krijg je de sushi box die je hebt samengesteld twee keer.
 * Een sushi box voor 3 personen krijg je dan drie keer.
**/

// -------------------- CONSTANTEN --------------------
const
    naamInvoer = document.getElementById("naamInvoer");
    naamInvoerKnop = document.getElementById("naamInvoer_knop");
    welkomTekst = document.getElementById("welkom_tekst");
    sluitSpan = document.getElementsByClassName("sluit");
    selecteerAantalPersonenBox = document.getElementById("sushi-opties_aantal_personen-input");
    selecteerWaardeAantalPersonen = document.getElementById("bestelling-aantal_personen");
    checkboxes = document.querySelectorAll(".sushi-opties_soort-input");
    sushiAfbeelding = document.getElementById("sushi-box-vlak");
    sushiKeuzes = document.getElementById("bestelling-sushi_keuzes");
    bestellingTotaalPrijs = document.getElementById("bestelling-totaal_prijs");
    labels = document.querySelectorAll(".sushi-opties_soort-label");
    bestelKnop = document.getElementById("bestellingPlaatsen");

// -------------------- LET VARIABELEN --------------------
let
    gebruikersnaam;
    sluit = sluitSpan[0]; // Bron: https://stackoverflow.com/questions/46271503/span-class-does-not-close-in-modal-window
    totaalPrijs = 0; // Zorgt dat de totaalprijs €0,00 is
    geselecteerdeCheckboxes = [];
    gifBestellen = document.getElementById("gifBestellen");

// -------------------- ALLE FUNCTIES --------------------
// Welkom popup
function welkomPopup() {
    document.getElementById("welkom_popup_overlay").style.display = "block";
}

function sluitPopup() {
    document.getElementById("welkom_popup_overlay").style.display = "none";
}

// Voorbeeld van Lisette tijdens de les + eigen toegevoegde code
function logInput() {
    gebruikersnaam = naamInvoer.value;
    if (naamInvoer.value == "") {
        alert("Voer eerst je naam in"); // Bron: https://www.w3schools.com/jsref/met_win_alert.asp
        document.getElementById("welkom_popup_overlay").style.display = "block";
    } else if (naamInvoer.value == " "){
        welkomTekst.textContent = "Welkom! Stel je sushi box samen.";
    } else {
        welkomTekst.textContent = "Welkom, " + gebruikersnaam + "! Stel je sushi box samen.";
    }
}

// Aantal personen tekst veranderen
function updateAantalPersonen() {
    selecteerWaardeAantalPersonen.textContent = selecteerAantalPersonenBox.value;
}

// Sushi toevoegen en verwijderen (img + list item)
function updateSushi(sushiOptie) {
    let src = sushiOptie.getAttribute("data-src");
    let labels = sushiOptie.nextElementSibling.textContent; // Haal de tekst van het label op - Bron: https://developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling
    if (sushiOptie.checked) {
        // Controleer of het maximum aantal geselecteerde checkboxes is bereikt
        if (geselecteerdeCheckboxes.length >= 4) {
            sushiOptie.checked = false; // Je kan de checkbox niet selecteren - Bron: https://www.w3schools.com/jsref/prop_checkbox_checked.asp
            alert("Je mag maar 4 sushi soorten selecteren!");
            return; // Stopt de functie - Bron: https://www.w3schools.com/jsref/jsref_return.asp
        }

        // Als de checkbox is aangevinkt, wordt er een afbeelding toegevoegd
        let img = document.createElement("img");
        img.src = src;
        img.setAttribute("data-src", src);
        sushiAfbeelding.appendChild(img); // Bron: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
        
        // Als de checkbox is aangevinkt, wordt er een list item toegevoegd
        document.getElementById("verborgen-li").style.display = "none";
        let li = document.createElement("li");
        li.textContent = labels; // Voeg de tekst van het label toe aan het lijstitem
        sushiKeuzes.appendChild(li);
        
        // Voegt €3,00 bij de totaalprijs toe
        totaalPrijs += 3;

        // Voegt de checkbox toe aan de lijst met geselecteerde checkboxes
        geselecteerdeCheckboxes.push(sushiOptie); // Bron: https://www.w3schools.com/jsref/jsref_push.asp

        // Controleert of het aantal geselecteerde checkboxes nu 4 is
        if (geselecteerdeCheckboxes.length === 4) {
            // Als er 4 checkboxes zijn geselecteerd, laat de knop zien
            document.getElementById("bestellingPlaatsen").style.display = "block";
            document.getElementById("bestelling-totaal_prijs").style.marginBottom = "32px";
        }
    } else {
        // Als de checkbox niet is aangevinkt, wordt de afbeelding verwijderd
        let afbeeldingen = Array.from(sushiAfbeelding.children).filter(img => img.getAttribute("data-src") === src); // Bron: https://www.w3schools.com/jsref/jsref_from.asp & https://www.w3schools.com/jsref/jsref_filter.asp
        afbeeldingen.forEach(img => sushiAfbeelding.removeChild(img));

        // Als de checkbox niet is aangevinkt, wordt de list item verwijderd
        let listItems = Array.from(sushiKeuzes.children).filter(li => li.textContent === labels);
        listItems.forEach(li => sushiKeuzes.removeChild(li));

        // Haalt €3,00 bij de totaalprijs eraf
        totaalPrijs -= 3;
        
        // Als alle list-items zijn gedeselecteerd, zie je de #verborgen-li weer
        if (sushiKeuzes.children.length <= 1) {
            document.getElementById("verborgen-li").style.display = "list-item";
        } else {
            document.getElementById("verborgen-li").style.display = "none";
        }

        // Verwijderd de checkbox uit de lijst met geselecteerde checkboxes
        geselecteerdeCheckboxes = geselecteerdeCheckboxes.filter(checkbox => checkbox !== sushiOptie);
        if (geselecteerdeCheckboxes.length <= 4) {
            // Als er 4 checkboxes zijn geselecteerd, verbergt de knop
            document.getElementById("bestellingPlaatsen").style.display = "none";
            document.getElementById("bestelling-totaal_prijs").style.marginBottom = "inherit";
        }
    }
    updateTotaalPrijs();
}

// Totaalprijs updaten
function updateTotaalPrijs() {
    bestellingTotaalPrijs.textContent = "€" + totaalPrijs.toFixed(2); // Bron: https://www.w3schools.com/js/js_number_methods.asp, veranderd de totaalprijs in de HTML en schrijft met 2 decimalen.
}

// Zie bronvermelding.txt voor alle audio bronnen
function bestelAudio() {
    let eersteAudio = new Audio("Waiting_sound_effect.mp3"); // Bron: https://www.youtube.com/watch?v=KDPhIQcaovQ
    eersteAudio.play();
    eersteAudio.currentTime = 0;
    setTimeout(function() {
        eersteAudio.pause();
        gifBestellen.style.display = "block";
        let tweedeAudio = new Audio("Applause_Crowd_Cheering_sound_effect.mp3"); // Bron: https://www.youtube.com/watch?v=barWV7RWkq0
        tweedeAudio.play();
        setTimeout(function() {
            tweedeAudio.pause();
            gifBestellen.style.display = "none";
        }, 10000);
        setInterval('herlaadPagina()', 5000);
    }, 5000);
}

function herlaadPagina() {
    window.location = window.location.href; // Bron: https://www.geeksforgeeks.org/how-to-automatic-refresh-a-web-page-in-fixed-time/
}

// -------------------- EVENT LISTENERS --------------------
sluit.addEventListener("click", sluitPopup);
naamInvoerKnop.addEventListener("click", sluitPopup);
naamInvoerKnop.addEventListener("click", logInput);
selecteerAantalPersonenBox.addEventListener("change", updateAantalPersonen);

// Samen met Lisette gedaan tijdens de les
checkboxes.forEach((sushiOptie) => {
    sushiOptie.addEventListener("click", ()=> {
        updateSushi(sushiOptie);
    });
});

bestellingTotaalPrijs.addEventListener("change", updateTotaalPrijs);
bestelKnop.addEventListener("click", bestelAudio);