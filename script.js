document.addEventListener('DOMContentLoaded', () => {
    // IO Elements
    const svgFileInput = document.getElementById('svgFile');
    const svgTextInput = document.getElementById('svgInput');
    const convertButton = document.getElementById('convertButton');
    const svgOutputTextarea = document.getElementById('svgOutput');
    const copyButton = document.getElementById('copyButton');
    const downloadLink = document.getElementById('downloadLink');

    // Preview Elements
    const svgPreviewBox = document.getElementById('svgPreviewBox');
    const previewWidthInput = document.getElementById('previewWidth');
    const previewHeightInput = document.getElementById('previewHeight');
    const previewBgColorInput = document.getElementById('previewBgColor');
    const previewSvgColorInput = document.getElementById('previewSvgColor'); // For parent color
    const previewPlaceholder = document.querySelector('.preview-placeholder');

    let originalFileName = 'converted.svg';
    let currentConvertedSvgString = ''; // Store the latest converted SVG

    // --- Event Listeners ---

    svgFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            originalFileName = file.name.replace(/\.svg$/i, '') + '_webflow.svg';
            const reader = new FileReader();
            reader.onload = (e) => {
                svgTextInput.value = e.target.result;
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
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
            const svgElement = svgDoc.documentElement;

            if (svgElement.nodeName === 'parsererror' || !svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
                alert('Invalid SVG code. Please check your input.');
                svgOutputTextarea.value = "Error: Could not parse SVG.";
                currentConvertedSvgString = '';
                updatePreview(); // Clear preview on error
                return;
            }

            svgElement.removeAttribute('width');
            svgElement.removeAttribute('height');
            if (!svgElement.getAttribute('viewBox')) {
                const originalWidthMatch = svgString.match(/width="([^"]+)"/);
                const originalHeightMatch = svgString.match(/height="([^"]+)"/);
                if (originalWidthMatch && originalHeightMatch) {
                    const w = parseFloat(originalWidthMatch[1]);
                    const h = parseFloat(originalHeightMatch[1]);
                    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                         svgElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
                    } else {
                        console.warn("Could not infer viewBox from invalid width/height attributes.");
                    }
                } else {
                    console.warn("SVG has no viewBox and no width/height attributes to infer one.");
                }
            }
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                        // First, handle the root SVG element itself for fill, stroke, and style
            if (svgElement.hasAttribute('fill') && svgElement.getAttribute('fill') !== 'none' && svgElement.getAttribute('fill') !== 'transparent') {
                svgElement.setAttribute('fill', 'currentColor');
            }
            if (svgElement.hasAttribute('stroke') && svgElement.getAttribute('stroke') !== 'none' && svgElement.getAttribute('stroke') !== 'transparent') {
                svgElement.setAttribute('stroke', 'currentColor');
            }
            // Also handle inline styles on the root element if they contain fill/stroke
            if (svgElement.hasAttribute('style')) {
                let style = svgElement.getAttribute('style');
                style = style.replace(/fill:\s*[^;!\s]+(\s*!important)?/g, 'fill:currentColor$1');
                style = style.replace(/stroke:\s*[^;!\s]+(\s*!important)?/g, 'stroke:currentColor$1');
                svgElement.setAttribute('style', style);
            }

            const elementsToColor = svgElement.querySelectorAll('*');
            elementsToColor.forEach(el => {
                if (el.hasAttribute('fill') && el.getAttribute('fill') !== 'none' && el.getAttribute('fill') !== 'transparent') {
                    el.setAttribute('fill', 'currentColor');
                }
                if (el.hasAttribute('stroke') && el.getAttribute('stroke') !== 'none' && el.getAttribute('stroke') !== 'transparent') {
                    el.setAttribute('stroke', 'currentColor');
                }
                if (el.hasAttribute('style')) {
                    let style = el.getAttribute('style');
                    style = style.replace(/fill:\s*[^;!\s]+(\s*!important)?/g, 'fill:currentColor$1');
                    style = style.replace(/stroke:\s*[^;!\s]+(\s*!important)?/g, 'stroke:currentColor$1');
                    el.setAttribute('style', style);
                }
            });

            const serializer = new XMLSerializer();
            currentConvertedSvgString = serializer.serializeToString(svgElement); // Store for preview

            svgOutputTextarea.value = currentConvertedSvgString;
            copyButton.style.display = 'inline-block';
            downloadLink.style.display = 'inline-block';
            downloadLink.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(currentConvertedSvgString);
            downloadLink.download = originalFileName;

            updatePreview(); // Update preview with the new SVG

        } catch (error) {
            console.error("Error during SVG conversion:", error);
            svgOutputTextarea.value = `Error: ${error.message}`;
            alert(`An error occurred: ${error.message}`);
            copyButton.style.display = 'none';
            downloadLink.style.display = 'none';
            currentConvertedSvgString = '';
            updatePreview(); // Clear preview on error
        }
    });

    copyButton.addEventListener('click', () => {
        if (!svgOutputTextarea.value) return;
        svgOutputTextarea.select();
        svgOutputTextarea.setSelectionRange(0, 99999);
        try {
            document.execCommand('copy');
            // Maybe a subtle visual feedback instead of alert
            copyButton.textContent = 'Copied!';
            setTimeout(() => { copyButton.textContent = 'Copy Code'; }, 1500);
        } catch (err) {
            alert('Failed to copy. Please copy manually.');
        }
        window.getSelection().removeAllRanges();
    });

    // --- Preview Logic ---
    function updatePreview() {
        if (currentConvertedSvgString) {
            svgPreviewBox.innerHTML = currentConvertedSvgString; // Inject the SVG string
            if (previewPlaceholder) previewPlaceholder.style.display = 'none';
        } else {
            svgPreviewBox.innerHTML = ''; // Clear previous SVG
            if (previewPlaceholder) {
                previewPlaceholder.textContent = 'Preview will appear here after conversion.';
                previewPlaceholder.style.display = 'block';
            }
        }
        // Apply current control values
        applyPreviewStyles();
    }

    function applyPreviewStyles() {
        const width = previewWidthInput.value;
        const height = previewHeightInput.value;
        const bgColor = previewBgColorInput.value;
        const svgColor = previewSvgColorInput.value; // This sets the 'color' property of the preview box

        svgPreviewBox.style.width = `${width}px`;
        svgPreviewBox.style.height = `${height}px`;
        svgPreviewBox.style.backgroundColor = bgColor;
        svgPreviewBox.style.color = svgColor; // This will be inherited by 'currentColor' in the SVG
    }

    // Event listeners for preview controls
    previewWidthInput.addEventListener('input', applyPreviewStyles);
    previewHeightInput.addEventListener('input', applyPreviewStyles);
    previewBgColorInput.addEventListener('input', applyPreviewStyles);
    previewSvgColorInput.addEventListener('input', applyPreviewStyles);

    // Initial setup for preview
    applyPreviewStyles(); // Apply default control values on load
    updatePreview(); // Ensure placeholder is shown initially

});
