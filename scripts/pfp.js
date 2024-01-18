// script.js

const backgroundLayerSelect = document.getElementById('backgroundLayer');
const bodyLayerSelect = document.getElementById('bodyLayer');
const eyesLayerSelect = document.getElementById('eyesLayer');
const mouthLayerSelect = document.getElementById('mouthLayer'); // Add this line
// const nftImage = document.getElementById('nftImage');

const backgrounds = {
    background1: 'images/background/Celadon.png',
    background2: 'images/background/Flax.png',
    background3: 'images/background/Mauve.png',
    background4: 'images/background/Munsell.png',
    background5: 'images/background/Orange%20Web.png',
    background6: 'images/background/Rose%20Quartz.png',
    background7: 'images/background/Salmon%20Pink.png',
    background8: 'images/background/Sky%20Magenta.png',
    background9: 'images/background/Thistle.png',
    background10: 'images/background/Vivid%20Sky%20Blue.png',
    background11: 'images/background/Yellow%20Green.png',
    // ... (other backgrounds)
};

const bodyLayers = {
    body1: 'images/body/Squid%20Router.png',
    body2: 'images/body/newt.png',
    body3: 'images/body/Blue.png',
    body4: 'images/body/Green.png',
    body5: 'images/body/Orange.png',
    body6: 'images/body/Pink.png',
    body7: 'images/body/Red.png',
    // ... (other body types)
};

const eyesLayers = {
    eyes1: 'images/eyes/Milady%20Blue.png',
    eyes2: 'images/eyes/Milady%20Green.png',
    eyes3: 'images/eyes/Milady%20Pink.png',
    eyes4: 'images/eyes/Pit%20Viper%20Knockoff.png',
    // ... (other eye types)
};

const mouthLayers = {
    mouth1: 'images/mouth/Cheery.png',
    mouth2: 'images/mouth/Clown.png',
    mouth3: 'images/mouth/Flirty.png',
    mouth4: 'images/mouth/Grill.png',
    mouth5: 'images/mouth/Sad.png',
    mouth6: 'images/mouth/Smile.png',
    mouth7: 'images/mouth/Tongue.png',
    mouth8: 'images/mouth/Unimpressed.png',
    // ... (other mouth types)
};

let selectedLayers = {
    background: null,
    body: null,
    eyes: null,
    mouth: null, // Add this line
};

backgroundLayerSelect.addEventListener('change', () => {
    selectedLayers.background = backgrounds[backgroundLayerSelect.value];
    renderNFT();
});

bodyLayerSelect.addEventListener('change', () => {
    selectedLayers.body = bodyLayers[bodyLayerSelect.value];
    renderNFT();
});

eyesLayerSelect.addEventListener('change', () => {
    selectedLayers.eyes = eyesLayers[eyesLayerSelect.value];
    renderNFT();
});

mouthLayerSelect.addEventListener('change', () => { // Add this event listener
    selectedLayers.mouth = mouthLayers[mouthLayerSelect.value];
    renderNFT();
});



const nftImage = document.getElementById('nftImage');
const imageWidth = 400; // Adjust the desired width
const imageHeight = 400; // Adjust the desired height

function renderNFT() {
    const { background, body, eyes, mouth } = selectedLayers;

    // Set the size for each layer separately
    const backgroundLayer = `url(${background})`;
    const bodyLayer = `url(${body})`;
    const eyesLayer = `url(${eyes})`;
    const mouthLayer = `url(${mouth})`;

    // Set the background-size for each layer
    nftImage.style.backgroundImage = `${mouthLayer}, ${eyesLayer}, ${bodyLayer}, ${backgroundLayer}`;
    nftImage.style.backgroundRepeat = 'no-repeat, no-repeat, no-repeat, no-repeat';
    nftImage.style.backgroundSize = `${imageWidth}px ${imageHeight}px, ${imageWidth}px ${imageHeight}px, ${imageWidth}px ${imageHeight}px, ${imageWidth}px ${imageHeight}px`;
    nftImage.style.backgroundPosition = 'center center, center center, center center, center center';

    // Set the size for the container div
    nftImage.style.width = `${imageWidth}px`;
    nftImage.style.height = `${imageHeight}px`;
    nftImage.style.margin = 'auto';
}


// Add an event listener for the download button
const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', () => {
    // Convert the canvas content to a data URL
    const canvas = document.getElementById('nftImage'); // Change this to the ID of your canvas element
    const dataUrl = canvas.toDataURL('image/png');

    // Create an anchor element for the downloadable link
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'generated-nft.png'; // Specify the filename

    // Simulate a click on the anchor element to trigger the download
    downloadLink.click();
});
