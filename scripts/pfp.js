// script.js

const backgroundLayerSelect = document.getElementById('backgroundLayer');
const bodyLayerSelect = document.getElementById('bodyLayer');
const eyesLayerSelect = document.getElementById('eyesLayer');
const mouthLayerSelect = document.getElementById('mouthLayer'); // Add this line
// const nftImage = document.getElementById('nftImage');

const backgrounds = {
    background0: null,
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
    body0: null,
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
    eyes0: null,
    eyes1: 'images/eyes/Milady%20Blue.png',
    eyes2: 'images/eyes/Milady%20Green.png',
    eyes3: 'images/eyes/Milady%20Pink.png',
    eyes4: 'images/eyes/Pit%20Viper%20Knockoff.png',
    // ... (other eye types)
};

const mouthLayers = {
    mouth0: null,
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


let selectedLayerNames = {
    background: null,
    body: null,
    eyes: null,
    mouth: null,
};


backgroundLayerSelect.addEventListener('change', () => {
    // Split the string by a space character
    const parts =  backgrounds[backgroundLayerSelect.value].split('/');
    const traitName = parts[parts.length - 1];
    selectedLayerNames.background = traitName.replace(/\.png$/, '')
    selectedLayers.background = backgrounds[backgroundLayerSelect.value];
    renderNFT();
});

bodyLayerSelect.addEventListener('change', () => {
    const parts =  bodyLayers[bodyLayerSelect.value].split('/');
    const traitName = parts[parts.length - 1];
    selectedLayerNames.body = traitName.replace(/\.png$/, '')
    selectedLayers.body = bodyLayers[bodyLayerSelect.value];
    renderNFT();
});

eyesLayerSelect.addEventListener('change', () => {
    const parts = eyesLayers[eyesLayerSelect.value].split('/');
    const traitName = parts[parts.length - 1];
    selectedLayerNames.eyes = traitName.replace(/\.png$/, '')
    selectedLayers.eyes = eyesLayers[eyesLayerSelect.value];
    renderNFT();
});

mouthLayerSelect.addEventListener('change', () => { // Add this event listener
    const parts = mouthLayers[mouthLayerSelect.value].split('/');
    const traitName = parts[parts.length - 1];
    selectedLayerNames.mouth = traitName.replace(/\.png$/, '')
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
    generateTweet();
}


// Add an event listener for the download button
const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', downloadPng);

function generateTweet() {

    const baseUrl = new URL("https://pixelsquids-generator.fly.dev/share");

    for (const [key, value] of Object.entries(selectedLayerNames)) {
        if (value !== null) {
            baseUrl.searchParams.set(key, value);
        }
    }

    const imageUrl = baseUrl.toString();
    
    const tweetText = `Check out my PixelSquid ${imageUrl}`;
 
    downloadButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
}

async function downloadImage(
    imageSrc,
    nameOfDownload = 'squid.png',
  ) {
    const response = await fetch(imageSrc);
  
    const blobImage = await response.blob();
  
    const href = URL.createObjectURL(blobImage);
  
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = nameOfDownload;
  
    document.body.appendChild(anchorElement);
    anchorElement.click();
  
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
  }
  

function downloadPng(e) {
   
    const baseUrl = new URL("https://pixelsquids-generator.fly.dev/generate");

    for (const [key, value] of Object.entries(selectedLayerNames)) {
        if (value !== null) {
            baseUrl.searchParams.set(key, value);
        }
    }

    const imageUrl = baseUrl.toString();   
    downloadImage(imageUrl).then(() => console.log('Downloaded!'));
    // console.log('Download button clicked');
    // var element = document.getElementById("nftImage");
    // html2canvas(element, {
    //     allowTaint: true,
    //     useCORS: true
    // }).then(function (canvas) {
    //     canvas.toBlob(function (blob) {
    //         saveAs(blob, "squid.png");
    //     });
    // });
}
