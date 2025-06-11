# AIESR Website - Amity Institute of English Studies and Research

A modern, responsive website built for the Amity Institute of English Studies and Research (AIESR) using Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### Design & User Experience

- **Literary-Themed Design**: Elegant design inspired by literature with burgundy, gold, and cream color palette
- **Responsive Layout**: Mobile-first design that works perfectly on all devices
- **Smooth Animations**: GSAP and Framer Motion powered animations throughout the site
- **Typewriter Effects**: Dynamic text animations in the hero section
- **Interactive Elements**: Hover effects, floating elements, and engaging transitions

### Homepage Sections

1. **Hero Section**: Dynamic typewriter text with floating literary elements
2. **Why Choose AIESR**: Key value propositions with animated cards
3. **Academic Programs**: Comprehensive program showcase with detailed information
4. **Distinguished Faculty**: Faculty profiles with specializations and achievements
5. **Student Testimonials**: Carousel of success stories from alumni
6. **Contact Section**: Interactive contact form with multiple contact options

### Technical Features

- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Framer Motion**: Advanced animations and transitions
- **Component Architecture**: Reusable UI components
- **SEO Optimized**: Meta tags, semantic HTML, and accessibility compliance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aiesr-website
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── sections/          # Page sections
│       ├── HeroSection.tsx
│       ├── WhyChooseSection.tsx
│       ├── ProgramsSection.tsx
│       ├── FacultySection.tsx
│       ├── TestimonialsSection.tsx
│       └── ContactSection.tsx
├── data/                  # Static data
│   ├── programs.json
│   ├── faculty.json
│   └── testimonials.json
├── lib/
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript interfaces
```

## 🎨 Design System

### Colors

- **Primary Burgundy**: #8B0000 (Headers, primary text)
- **Gold**: #B8860B (Accents, highlights)
- **Cream**: #F5F5DC (Background)
- **Charcoal**: #36454F (Secondary text)

### Typography

- **Headers**: Playfair Display (serif)
- **Body Text**: Open Sans (sans-serif)
- **Script**: Dancing Script (for quotes)

## 📱 Responsive Breakpoints

- **Mobile**: 640px and below
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px and above
- **Large Desktop**: 1280px and above

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 Pages Implemented

### Homepage (/)

Complete homepage with all sections including hero, programs, faculty, testimonials, and contact form.

### About Page (/about)

Comprehensive about page with history, mission, vision, and values.

### Planned Pages

- Academic Programs (/programs)
- Faculty Directory (/faculty)
- Admissions (/admissions)
- Research (/research)
- Student Life (/student-life)
- Contact (/contact)

## 🎯 Performance Features

- **Image Optimization**: Next.js Image component for optimized loading
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components load as needed
- **SEO Optimization**: Meta tags and structured data

## 🌐 SEO & Accessibility

- Semantic HTML structure
- Alt text for images
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Meta tags for social sharing

## 📊 Student Attraction Features

1. **Compelling Hero Section**: Multiple rotating headlines with strong value propositions
2. **Social Proof**: Student testimonials and success stories
3. **Clear Program Information**: Detailed program cards with highlights and career prospects
4. **Faculty Credibility**: Distinguished faculty profiles with achievements
5. **Contact Options**: Multiple ways to get in touch
6. **Visual Appeal**: Literary-themed design that appeals to target audience

## 🚀 Deployment

This project is ready for deployment on:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom server**

For Vercel deployment:

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

## 🔮 Future Enhancements

- Content Management System integration
- Student portal
- Online application system
- Event management
- Blog/News section
- Alumni network platform
- Virtual campus tour
- Live chat integration

## 📞 Support

For questions about this codebase or deployment, please contact the development team.

---

**Built with ❤️ for AIESR - Where Words Come Alive**
