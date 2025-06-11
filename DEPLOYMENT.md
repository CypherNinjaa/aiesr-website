# AIESR Website - Deployment Guide

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Repository Settings**:

   - Go to your GitHub repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Required Files** (Already Created):

   - `.nojekyll` - Disables Jekyll processing
   - `.github/workflows/deploy.yml` - GitHub Actions workflow
   - `next.config.ts` - Configured for static export

3. **Automatic Deployment**:
   - Push your code to the main/master branch
   - GitHub Actions will automatically build and deploy your site
   - Your site will be available at: `https://[username].github.io/[repository-name]`

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start
```

### Build Configuration

The project is configured with:

- **Static Export**: `output: 'export'` in `next.config.ts`
- **Trailing Slash**: For GitHub Pages compatibility
- **Unoptimized Images**: Required for static hosting

### Troubleshooting

If you encounter the Jekyll build error:

1. Ensure `.nojekyll` file exists in the root
2. Check that GitHub Pages source is set to "GitHub Actions"
3. Verify the workflow file is in `.github/workflows/`
4. Make sure `next.config.ts` has the correct export configuration

### Project Structure

```
aiesr-website/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── .nojekyll                     # Disable Jekyll
├── next.config.ts               # Next.js configuration
├── src/                         # Source code
│   ├── app/                     # Next.js app directory
│   ├── components/              # React components
│   ├── data/                    # JSON data files
│   └── types/                   # TypeScript types
└── public/                      # Static assets
```

## Features

- ✅ Modern Next.js 15 with TypeScript
- ✅ Literary-themed design with burgundy/gold color scheme
- ✅ Responsive design for all devices
- ✅ Smooth animations with Framer Motion
- ✅ Clean, lint-free code
- ✅ GitHub Pages deployment ready
- ✅ SEO optimized
