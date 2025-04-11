const components = {
    cpu: [
        { name: "Intel Core i9-12900K", compatibility: "intel" },
        { name: "Intel Core i7-12700K", compatibility: "intel" },
        { name: "AMD Ryzen 9 5950X", compatibility: "amd" },
        { name: "AMD Ryzen 7 5800X", compatibility: "amd" }
    ],
    motherboard: [
        { name: "ASUS ROG Maximus Z690 Hero (Intel)", compatibility: "intel" },
        { name: "MSI MPG Z690 Carbon WiFi (Intel)", compatibility: "intel" },
        { name: "ASUS ROG Crosshair VIII Hero (AMD)", compatibility: "amd" },
        { name: "MSI MPG B550 Gaming Edge WiFi (AMD)", compatibility: "amd" }
    ],
    ram: [
        { name: "Corsair Vengeance LPX 16GB DDR4", compatibility: "all" },
        { name: "G.Skill Trident Z RGB 32GB DDR4", compatibility: "all" },
        { name: "Kingston Fury Beast 16GB DDR5", compatibility: "all" },
        { name: "Crucial Ballistix 32GB DDR4", compatibility: "all" }
    ],
    storage: [
        { name: "Samsung 970 EVO Plus 1TB SSD", compatibility: "all" },
        { name: "WD Black SN850 1TB SSD", compatibility: "all" },
        { name: "Seagate Barracuda 2TB HDD", compatibility: "all" },
        { name: "Crucial MX500 1TB SSD", compatibility: "all" }
    ],
    gpu: [
        { name: "NVIDIA GeForce RTX 3080", compatibility: "all" },
        { name: "NVIDIA GeForce RTX 3070", compatibility: "all" },
        { name: "AMD Radeon RX 6800 XT", compatibility: "all" },
        { name: "AMD Radeon RX 6700 XT", compatibility: "all" }
    ],
    psu: [
        { name: "Corsair RM850x 850W", compatibility: "all" },
        { name: "EVGA SuperNOVA 750 G5", compatibility: "all" },
        { name: "Seasonic Focus GX-750 750W", compatibility: "all" },
        { name: "Cooler Master MWE Gold 750W", compatibility: "all" }
    ],
    case: [
        { name: "NZXT H510 Elite", compatibility: "all" },
        { name: "Corsair iCUE 4000X RGB", compatibility: "all" },
        { name: "Lian Li PC-O11 Dynamic", compatibility: "all" },
        { name: "Fractal Design Meshify C", compatibility: "all" }
    ]
};

const selectedComponents = {};
let currentStep = 0;
const componentTypes = Object.keys(components);

function loadComponentOptions() {
    const componentList = document.getElementById("component-list");
    componentList.innerHTML = "";

    if (currentStep >= componentTypes.length) {
        componentList.innerHTML = "<p>All components selected!</p>";
        return;
    }

    const currentType = componentTypes[currentStep];
    const options = components[currentType];

    options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option.name;
        button.className = "select-button";
        button.onclick = () => selectComponent(currentType, option);
        componentList.appendChild(button);
    });
}

function selectComponent(type, option) {
    selectedComponents[type] = option;

    const selectedList = document.getElementById("selected-list");
    const listItem = document.createElement("li");
    listItem.textContent = `${type.toUpperCase()}: ${option.name}`;
    selectedList.appendChild(listItem);

    currentStep++;
    loadComponentOptions();
}

document.addEventListener("DOMContentLoaded", loadComponentOptions);
