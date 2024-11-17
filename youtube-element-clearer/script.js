// ==UserScript==
// @name         Youtube clearer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes annoying YouTube short elements on page load
// @author       TierTheTora
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    const waitForShortsContainer = () => {
        const short = document.getElementById("shorts-container");
        if (short) {
            initializeScript(short);
        } else {
            setTimeout(waitForShortsContainer, 1000);
        }
    };

    const initializeScript = (short) => {
        let isEnabled = localStorage.getItem('youtubeClearerEnabled') === 'true';

        const toggleButton = document.createElement("button");
        toggleButton.textContent = isEnabled ? "Disable Youtube Clearer" : "Enable Youtube Clearer";
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '80px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = 1000;
        toggleButton.style.padding = '10px';
        toggleButton.style.backgroundColor = '#ff0000';
        toggleButton.style.color = '#ffffff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.cursor = 'pointer';
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener("click", function() {
            isEnabled = !isEnabled;
            localStorage.setItem('youtubeClearerEnabled', isEnabled);
            toggleButton.textContent = isEnabled ? "Disable Youtube Clearer" : "Enable Youtube Clearer";
            if (isEnabled) {
                main(short);
            }
        });

        const observer = new MutationObserver(() => {
            if (isEnabled) {
                main(short);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        if (isEnabled) {
            main(short);
        }
    };

    function main(short) {
        const delelements = [
            document.querySelector(".YtShortsSuggestedActionViewModelStaticHost"), // Search suggestion text
            document.getElementsByTagName("yt-avatar-shape")[0], // YouTuber avatar
            document.getElementsByClassName("yt-core-attributed-string YtReelMultiFormatLinkViewModelTitle yt-core-attributed-string--white-space-pre-wrap")[0], // Short's video
            document.getElementsByTagName("desktop-shorts-volume-controls")[0], // Mute button
            document.getElementById("fullscreen-button-shape"), // Fullscreen button
            document.getElementById("play-pause-button-shape") // Pause button
        ];


        delelements.forEach((element, i) => {
            if (element) {
                if (i === 0 || i === 1 || i === 3 || i === 4 || i === 5) {
                    element.remove();
                } else {
                    element.textContent = "Video";
                }
            }
        });
    }


    waitForShortsContainer();

})();
