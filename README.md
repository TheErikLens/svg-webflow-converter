# SVG to Webflow-Friendly Converter

A simple yet powerful web utility designed to convert your SVG (Scalable Vector Graphics) files into a format that's optimized for seamless integration and styling within **Webflow**. This tool automates the process of making your SVGs responsive and color-adaptable using `currentColor`.

**Try it out: [Link to your deployed utility site HERE]**

## Why This Tool?

Embedding SVGs directly into Webflow is a great way to ensure crisp visuals at any size. However, to make them truly flexible with Webflow's design system, especially for:

1.  **Dynamic Coloring:** You often want your icons or graphics to inherit colors from their parent elements (e.g., matching text color, changing on hover states defined in Webflow).
2.  **True Responsiveness:** You want SVGs to scale fluidly within Webflow's responsive containers without being constrained by fixed dimensions.

This converter addresses these needs by:

*   Modifying SVG elements to use `currentColor` for fills and strokes.
*   Removing fixed `width` and `height` attributes and ensuring a `viewBox` is present for responsive scaling.

## Features

*   **`currentColor` Conversion:** Automatically changes all `fill` and `stroke` color attributes (excluding `none`) to `currentColor`. This allows the SVG to inherit its color from the CSS `color` property of its parent element in Webflow.
*   **Responsive Sizing:**
    *   Removes explicit `width` and `height` attributes from the root `<svg>` tag.
    *   Ensures a `viewBox` attribute is present, which is crucial for the SVG to scale correctly.
    *   Sets `preserveAspectRatio="xMidYMid meet"` (a common default) for uniform scaling.
*   **Handles Inline Styles:** Attempts to convert `fill` and `stroke` properties within inline `style` attributes as well.
*   **Easy Input:**
    *   Upload an `.svg` file directly.
    *   Paste raw SVG code into a textarea.
*   **Convenient Output:**
    *   Displays the converted SVG code.
    *   "Copy to Clipboard" button for quick grabbing.
    *   "Download Converted SVG" link to save the modified file.
*   **Client-Side Processing:** All conversions happen directly in your browser. No files are uploaded to a server.

## How to Use the Deployed Utility

1.  **Visit the live site:** [Link to your deployed utility site HERE]
2.  **Provide your SVG:**
    *   Click "Choose File" to upload your `.svg` file.
    *   OR, paste your existing SVG code directly into the "Or paste SVG code here:" textarea.
3.  **Convert:** Click the "Convert SVG" button.
4.  **Get the Result:**
    *   The converted SVG code will appear in the "Converted SVG:" textarea.
    *   Click "Copy to Clipboard" to copy the code.
    *   Click "Download Converted SVG" to save the new `.svg` file.
5.  **Use in Webflow:**
    *   Paste the copied code into an "Embed" element in your Webflow project.
    *   Alternatively, upload the downloaded `.svg` file to your Webflow assets.
    *   Now, the SVG's color can be controlled by setting the "Font Color" on its parent element (or the Embed element itself) in Webflow. Its size will respond to the dimensions of its container.

## Technologies Used

*   HTML5
*   CSS3
*   Vanilla JavaScript (ES6+)
    *   DOMParser API for parsing SVG strings.
    *   XMLSerializer API for serializing SVG DOM back to string.
*   Hosted on [GitHub Pages / Netlify / Vercel - *Specify your chosen hosting provider here*]

## For Local Development / Viewing the Code

If you'd like to run this locally or inspect the code:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[YourGitHubUsername]/[YourRepositoryName].git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd [YourRepositoryName]
    ```
3.  **Open `index.html` in your web browser.**

No build process is required for this simple client-side application.

## About This Project

This tool was created as a practical utility to help Webflow users and to demonstrate fundamental web development techniques. As a digital consultant, I believe in providing actionable solutions and sharing knowledge.

If you find this tool useful, have suggestions, or are interested in discussing digital strategy and development, feel free to connect!

*   **My Portfolio/Website:** [Link to your personal/consultancy website - OPTIONAL]
*   **LinkedIn:** [https://www.linkedin.com/in/erickvallart/]
*   **GitHub:** [Link to your GitHub profile: e.g., https://github.com/[YourGitHubUsername]]

## Contributing

Suggestions, bug reports, and contributions are welcome! Please feel free to open an issue or submit a pull request if you have ideas for improvements.

## License

This project is licensed under the **MIT License**.
