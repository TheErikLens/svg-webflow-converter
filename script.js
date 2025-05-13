document.addEventListener('DOMContentLoaded', () => {
    const svgFileInput = document.getElementById('svgFile');
    const svgTextInput = document.getElementById('svgInput');
    const convertButton = document.getElementById('convertButton');
    const svgOutputTextarea = document.getElementById('svgOutput');
    const copyButton = document.getElementById('copyButton');
    const downloadLink = document.getElementById('downloadLink');

    let originalFileName = 'converted.svg';

    svgFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            originalFileName = file.name.replace(/\.svg$/i, '') + '_webflow.svg'; // for download
            const reader = new FileReader();
            reader.onload = (e) => {
                svgTextInput.value = e.target.result; // Populate textarea for visibility/editing
            };
            reader.readAsText(file);
        }
    });

    convertButton.addEventListener('click', () => {
        let svgString = svgTextInput.value.trim();
        if (!svgString) {
            alert('Please upload an SVG file or paste SVG code.');
            return;
        }

        try {
            // 1. Parse the SVG string into a DOM object
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
            const svgElement = svgDoc.documentElement;

            // Check if parsing failed (documentElement might be a parseerror element)
            if (svgElement.nodeName === 'parsererror' || !svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
                alert('Invalid SVG code. Please check your input.');
                svgOutputTextarea.value = "Error: Could not parse SVG.";
                return;
            }

            // 2. Make it responsive: Remove width and height, ensure viewBox
            svgElement.removeAttribute('width');
            svgElement.removeAttribute('height');
            if (!svgElement.getAttribute('viewBox')) {
                // Attempt to infer viewBox if width and height were present
                const originalWidth = svgString.match(/width="([^"]+)"/);
                const originalHeight = svgString.match(/height="([^"]+)"/);
                if (originalWidth && originalHeight) {
                    svgElement.setAttribute('viewBox', `0 0 ${parseFloat(originalWidth[1])} ${parseFloat(originalHeight[1])}`);
                } else {
                    // If no viewBox and no width/height to infer from, it might not scale predictably.
                    // For now, we'll proceed, but a warning could be added.
                    console.warn("SVG has no viewBox and no width/height attributes to infer one. Responsiveness might be affected.");
                }
            }
            // Ensure it scales to fill container by default, Webflow specific if needed
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet'); // Optional, but good default

            // 3. Change colors to "currentColor"
            // Select all elements within the SVG that might have fill or stroke
            const elementsToColor = svgElement.querySelectorAll('*');
            elementsToColor.forEach(el => {
                // Change fill
                if (el.hasAttribute('fill') && el.getAttribute('fill') !== 'none') {
                    el.setAttribute('fill', 'currentColor');
                }
                // Change stroke
                if (el.hasAttribute('stroke') && el.getAttribute('stroke') !== 'none') {
                    el.setAttribute('stroke', 'currentColor');
                }
                // Handle inline styles (more complex, but good to have)
                if (el.hasAttribute('style')) {
                    let style = el.getAttribute('style');
                    style = style.replace(/fill:\s*[^;!\s]+(!important)?/g, 'fill:currentColor$1');
                    style = style.replace(/stroke:\s*[^;!\s]+(!important)?/g, 'stroke:currentColor$1');
                    el.setAttribute('style', style);
                }
            });

            // 4. Serialize the modified SVG back to a string
            const serializer = new XMLSerializer();
            const modifiedSvgString = serializer.serializeToString(svgElement);

            svgOutputTextarea.value = modifiedSvgString;
            copyButton.style.display = 'inline-block';
            downloadLink.style.display = 'inline-block';
            downloadLink.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(modifiedSvgString);
            downloadLink.download = originalFileName;

        } catch (error) {
            console.error("Error during SVG conversion:", error);
            svgOutputTextarea.value = `Error: ${error.message}`;
            alert(`An error occurred: ${error.message}`);
            copyButton.style.display = 'none';
            downloadLink.style.display = 'none';
        }
    });

    copyButton.addEventListener('click', () => {
        svgOutputTextarea.select();
        svgOutputTextarea.setSelectionRange(0, 99999); // For mobile devices
        try {
            document.execCommand('copy');
            alert('Copied to clipboard!');
        } catch (err) {
            alert('Failed to copy. Please copy manually.');
        }
        window.getSelection().removeAllRanges(); // Deselect
    });
});
