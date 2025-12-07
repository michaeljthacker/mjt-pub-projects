# Screenshots Directory

This directory contains project screenshot images used in the projects gallery.

## File Naming Convention

Screenshots must follow kebab-case naming matching the project `id` field:
- Project ID: `a-thousand-questions` → Screenshot: `a-thousand-questions.png`
- Project ID: `soccer-positioning` → Screenshot: `soccer-positioning.png`

## Default Placeholder

`default-project.png` - A branded placeholder image used when a project-specific screenshot is missing.

### Creating the Default Placeholder

1. Open `placeholder-generator.html` in a browser
2. Take a screenshot of the rendered page (1600x900px recommended)
3. Save as `default-project.png`

Or use any image editing tool to create a simple branded placeholder with:
- Dimensions: Minimum 800px width (1600x900 recommended for Retina displays)
- Content: "mjt.pub" branding or generic project visual
- Format: PNG, JPEG, or WebP
- Size: <200KB (optimized)

## Screenshot Requirements

- **Format:** PNG, JPEG, or WebP (prefer WebP for performance)
- **Dimensions:** Minimum 800px width (1600x900 recommended for Retina)
- **Content:** Show actual product interface or representative visual
- **Optimization:** Compress to <200KB per image
- **Aspect Ratio:** Will display as 16:9 in cards (cropped with object-fit: cover)

## Tools for Optimization

- [ImageOptim](https://imageoptim.com/) (Mac)
- [Squoosh](https://squoosh.app/) (Web-based)
- [TinyPNG](https://tinypng.com/) (Web-based)

## Adding New Project Screenshots

1. Create/obtain screenshot image
2. Optimize to <200KB
3. Name using project's `id` field (kebab-case)
4. Save to this directory
5. Update `projects.json` with `"screenshot": "filename.png"` (optional - will auto-detect based on ID)