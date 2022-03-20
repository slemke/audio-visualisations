// Music: https://www.bensound.com credit
const canvas = document.getElementById('visualisation');
let context = canvas.getContext('2d');
let audioSource = document.getElementById('audio-source');

// lookup audio context cross browser
let audioContext = new AudioContext();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
let source = audioContext.createMediaElementSource(audioSource);
source.connect(analyser);
source.connect(audioContext.destination);

let data = new Uint8Array(analyser.frequencyBinCount);

const render = () => {
    requestAnimationFrame(render);
    analyser.getByteFrequencyData(data);
    draw(data);
};

const draw = (data) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    data = [...data];
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    data.forEach((value, index) => {
        context.beginPath();
        context.strokeStyle = '#25587f';
        context.moveTo(canvas.width / 2, canvas.height / 2);
        let radius = getRadius();
        let h = canvas.width / 2;
        let k = canvas.height / 2;
        let degree = index  / (data.length / 360);
        context.lineTo(h + (radius * Math.cos(degree) * (value / 255)), k + (radius * Math.sin(degree)) * (value / 255));
        context.stroke();
    })
};

const radius = 1;

const getRadius = () => {
    if (window.innerHeight > window.innerWidth) {
        return window.innerWidth * 0.5;
    }
    return window.innerHeight * 0.5;
};

const getDegree = (length, index) => {
    const base = length / 360;
    return index / base;
}

const getX = (centerX, degree) => {
    return centerX + radius * Math.cos(degree);
};

const getY = (centerY, degree) => {
    return centerY + radius * Math.sin(degree);
};

let state = 'pause';

const playButton = document.getElementById('play-pause');
playButton.addEventListener('click', (event) => {
    event.preventDefault();
    if(state === 'pause') {
        audioContext.resume();
        audioSource.play();
        state = 'play';
    } else {
        audioSource.pause();
        state = 'pause';
    }
    playButton.innerText = state;
});
requestAnimationFrame(render);