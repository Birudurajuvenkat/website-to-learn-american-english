const word = "through";
const wordAudio = new Audio('https://www.oxfordlearnersdictionaries.com/media/english/us_pron/t/thu/through/through__us_1.mp3');

const playAudioButton = document.getElementById('play-audio');
const recordButton = document.getElementById('record');
const playRecordingButton = document.getElementById('play-recording');
const feedbackElement = document.getElementById('feedback');

let recorder;
let audioChunks = [];

playAudioButton.addEventListener('click', () => {
    wordAudio.play();
});

recordButton.addEventListener('click', async () => {
    if (recorder && recorder.state === "recording") {
        recorder.stop();
        return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = event => {
        audioChunks.push(event.data);
        if (recorder.state === "inactive") {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            playRecordingButton.href = audioUrl;
            playRecordingButton.disabled = false;
        }
    };

    audioChunks = [];
    recorder.start();
    recordButton.textContent = "Stop Recording";
    feedbackElement.textContent = "";

    recorder.onstop = () => {
        recordButton.textContent = "Record";
        feedbackElement.textContent = "Recording saved. Click 'Play Recording' to listen.";
    };
});

playRecordingButton.addEventListener('click', () => {
    if (playRecordingButton.href) {
        const recording = new Audio(playRecordingButton.href);
        recording.play();
    }
});
