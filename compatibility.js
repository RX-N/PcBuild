const selectedComponents = {};

function selectComponent(type, compatibility) {
    selectedComponents[type] = compatibility;

    const allCards = document.querySelectorAll('.component-card');
    allCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        const cardCompatibility = card.getAttribute('data-compatible');

        if (cardType !== type && cardCompatibility !== 'all') {
            if (!isCompatible(cardCompatibility)) {
                card.classList.add('disabled');
                card.querySelector('.select-button').disabled = true;
            } else {
                card.classList.remove('disabled');
                card.querySelector('.select-button').disabled = false;
            }
        }
    });
}

function isCompatible(cardCompatibility) {
    for (const type in selectedComponents) {
        if (selectedComponents[type] === cardCompatibility) {
            return true;
        }
    }
    return false;
}
