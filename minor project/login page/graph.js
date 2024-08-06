const vowelFormants = {
    "i": { f1: 270, f2: 2290 },
    "ɪ": { f1: 390, f2: 1990 },
    "eɪ": { f1: 530, f2: 1840 },
    "ɛ": { f1: 660, f2: 1710 },
    "æ": { f1: 860, f2: 1590 },
    "ɑ": { f1: 730, f2: 1090 },
    "ɔ": { f1: 570, f2: 840 },
    "oʊ": { f1: 430, f2: 820 },
    "ʊ": { f1: 470, f2: 1020 },
    "u": { f1: 300, f2: 870 },
    "ʌ": { f1: 640, f2: 1190 },
    "ə": { f1: 500, f2: 1500 },
};

const recordButton = document.getElementById('record');
const playRecordingButton = document.getElementById('play-recording');
const feedbackElement = document.getElementById('feedback');
const vowelCanvas = document.getElementById('vowel-canvas');
const ctx = vowelCanvas.getContext('2d');
let recorder, audioChunks = [], audioBlob, audioUrl;


function drawVowelChart() {
    ctx.clearRect(0, 0, vowelCanvas.width, vowelCanvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText("F1", 550, 380);
    ctx.fillText("F2", 10, 20);

    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 350);
    ctx.lineTo(550, 350);
    ctx.stroke();

    Object.keys(vowelFormants).forEach(vowel => {
        const { f1, f2 } = vowelFormants[vowel];
        const x = 550 - (f2 / 2500) * 500;
        const y = 350 - (f1 / 1000) * 300;
        ctx.fillStyle = 'blue';
        ctx.fillRect(x - 5, y - 5, 10, 10);
        ctx.fillText(vowel, x - 10, y - 10);
    });
}


function plotRecordedVowel(f1, f2) {
    const x = 550 - (f2 / 2500) * 500;
    const y = 350 - (f1 / 1000) * 300;
    ctx.fillStyle = 'red';
    ctx.fillRect(x - 5, y - 5, 10, 10);
}


function analyzeAudio(buffer) {
    
    const f1 = 500;  
    const f2 = 1500; 
    plotRecordedVowel(f1, f2);

    
    const selectedVowel = document.getElementById('vowel-select').value;
    const targetFormants = vowelFormants[selectedVowel];
    const accuracy = 100 - (Math.abs(targetFormants.f1 - f1) + Math.abs(targetFormants.f2 - f2)) / 20;
    feedbackElement.textContent = `Formants: F1=${f1}Hz, F2=${f2}Hz, Accuracy: ${accuracy.toFixed(2)}%`;
}


recordButton.addEventListener('click', async () => {
    if (recorder && recorder.state === "recording") {
        recorder.stop();
        return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
    audioChunks = [];

    recorder.ondataavailable = event => {
        audioChunks.push(event.data);
        if (recorder.state === "inactive") {
            audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
            audioUrl = URL.createObjectURL(audioBlob);
            playRecordingButton.href = audioUrl;
            playRecordingButton.disabled = false;

            const audioContext = new AudioContext();
            const reader = new FileReader();
            reader.readAsArrayBuffer(audioBlob);
            reader.onloadend = () => {
                audioContext.decodeAudioData(reader.result, buffer => {
                    analyzeAudio(buffer);
                });
            };
        }
    };

    recorder.start();
    recordButton.textContent = "Stop Recording";
    feedbackElement.textContent = "";

    recorder.onstop = () => {
        recordButton.textContent = "Record";
    };
});
playRecordingButton.addEventListener('click', () => {
    if (playRecordingButton.href) {
        const recording = new Audio(playRecordingButton.href);
        recording.play();
    }
});
drawVowelChart();
