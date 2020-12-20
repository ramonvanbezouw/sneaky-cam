// General elements
const main = document.querySelector('main')!;
const overview = document.querySelector('#overview')!;
const articlesLink = document.querySelector('#articlesLink')!;
const overviewLink = document.querySelector('#overviewLink')!;
const capturesContainer: HTMLDivElement = document.querySelector('#captures') as HTMLDivElement;
// Buttons and interactables
const pictureButtons = document.querySelectorAll('.pictureButton')!;
const toggleButtons = document.querySelectorAll('.toggleButton')!;
const flipButtons = document.querySelectorAll('.flipButton')!;
// Video and utilities
const previewVideos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');
const canvas: HTMLCanvasElement = document.createElement('canvas');
const captures: HTMLImageElement[] = [];


// Event handlers
articlesLink.addEventListener('click', () => {
    main.classList.remove('hidden');
    overview.classList.add('hidden');
});
overviewLink.addEventListener('click', () => {
    main.classList.add('hidden');
    overview.classList.remove('hidden');
});

toggleButtons.forEach(b => b.addEventListener('click', () => {
    previewVideos.forEach(v => v.classList.toggle('hidden'));
}));

flipButtons.forEach(b => b.addEventListener('click', () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    initVideoStream();
}));

pictureButtons.forEach(b => b.addEventListener('click', () => takePicture()));



// VIDEO STUFF
let facingMode = 'environment';
let videoTracks: MediaStreamTrack[] = [];

async function initVideoStream() {
    previewVideos.forEach(v => v.pause());
    videoTracks.forEach(t => t.stop());
    const u = await navigator.mediaDevices.getUserMedia({video: { facingMode: {ideal: facingMode }}, audio: false });
    videoTracks = u.getTracks();
    previewVideos.forEach(v => v.srcObject = u);
    const { width, height } = u.getVideoTracks()[0].getSettings();
    canvas.width = width!;
    canvas.height = height!;
    previewVideos.forEach(v => v.play());
}


function takePicture(): void {
    canvas.getContext('2d')?.drawImage(previewVideos[0],0,0);
    const image = new Image();
    image.src = canvas.toDataURL();
    captures.push(image);
    capturesContainer.appendChild(image);
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    const name = 'sneaky-pic.png';
    downloadButton.onclick = () => {
        const a = document.createElement('a');
        a.download = name;
        a.target = '_blank';
        a.href = image.src;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    capturesContainer.appendChild(downloadButton);
}

initVideoStream();
