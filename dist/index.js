"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// General elements
const main = document.querySelector('main');
const overview = document.querySelector('#overview');
const articlesLink = document.querySelector('#articlesLink');
const overviewLink = document.querySelector('#overviewLink');
const capturesContainer = document.querySelector('#captures');
// Buttons and interactables
const pictureButtons = document.querySelectorAll('.pictureButton');
const toggleButtons = document.querySelectorAll('.toggleButton');
const flipButtons = document.querySelectorAll('.flipButton');
// Video and utilities
const previewVideos = document.querySelectorAll('video');
const canvas = document.createElement('canvas');
const captures = [];
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
let videoTracks = [];
function initVideoStream() {
    return __awaiter(this, void 0, void 0, function* () {
        previewVideos.forEach(v => v.pause());
        videoTracks.forEach(t => t.stop());
        const u = yield navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facingMode } }, audio: false });
        videoTracks = u.getTracks();
        previewVideos.forEach(v => v.srcObject = u);
        const { width, height } = u.getVideoTracks()[0].getSettings();
        canvas.width = width;
        canvas.height = height;
        previewVideos.forEach(v => v.play());
    });
}
function takePicture() {
    var _a;
    (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.drawImage(previewVideos[0], 0, 0);
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
    };
    capturesContainer.appendChild(downloadButton);
}
initVideoStream();
