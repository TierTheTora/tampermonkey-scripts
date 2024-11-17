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
    // Wait until the shorts container is available
    const waitForShortsContainer = () => {
        const short = document.getElementById("shorts-container");
        if (short) {
            // If it's already available, proceed with the script
            initializeScript(short);
        } else {
            // If it's not yet available, try again after a delay
            setTimeout(waitForShortsContainer, 1000);
        }
    };

    // Initialize the script
    const initializeScript = (short) => {
        // Get the stored toggle state from localStorage
        let isEnabled = localStorage.getItem('youtubeClearerEnabled') === 'true';

        // Create a toggle button for enabling/disabling the script
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

        // Add click listener to toggle the script on/off
        toggleButton.addEventListener("click", function() {
            isEnabled = !isEnabled; // Toggle the state
            localStorage.setItem('youtubeClearerEnabled', isEnabled); // Save the state to localStorage
            toggleButton.textContent = isEnabled ? "Disable Youtube Clearer" : "Enable Youtube Clearer"; // Update the button text
            if (isEnabled) {
                main(short); // Re-run the main function if enabled
            }
        });

        // Observe changes in the DOM
        const observer = new MutationObserver(() => {
            if (isEnabled) {
                main(short);
            }
        });

        // Start observing the body for added nodes (new content)
        observer.observe(document.body, { childList: true, subtree: true });

        // Execute the script only if the toggle is enabled
        if (isEnabled) {
            main(short);
        }
    };

    // Main function that removes elements based on the toggle state
    function main(short) {
        const delelements = [
            document.querySelector(".YtShortsSuggestedActionViewModelStaticHost"), // Search suggestion text
            document.getElementsByTagName("yt-avatar-shape")[0], // YouTuber avatar
            document.getElementsByClassName("yt-core-attributed-string YtReelMultiFormatLinkViewModelTitle yt-core-attributed-string--white-space-pre-wrap")[0], // Short's video
            document.getElementsByTagName("desktop-shorts-volume-controls")[0], // Mute button
            document.getElementById("fullscreen-button-shape"), // Fullscreen button
            document.getElementById("play-pause-button-shape") // Pause button
        ];


        // Loop over each element and remove or modify
        delelements.forEach((element, i) => {
            if (element) {
                if (i === 0 || i === 1 || i === 3 || i === 4 || i === 5) {
                    element.remove(); // Remove the element if it exists
                } else {
                    element.textContent = "Video";
                }
            }
        });
    }


    // Start by waiting for the shorts container to be available
    waitForShortsContainer();

})();
