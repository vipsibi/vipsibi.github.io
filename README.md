# Sibirajs - Portfolio Website

A modern, animated, and colorful portfolio website showcasing the skills and projects of Sibirajs, a web developer and data analytics enthusiast.

## 🌟 Features

### Design & Animations
- **Vibrant Color Scheme**: Eye-catching gradients and modern color palette
- **Smooth Animations**: Fade-in, slide-in effects throughout the site
- **Interactive Elements**: Hover effects, ripple animations, and transitions
- **Typing Effect**: Animated hero section with dynamic text
- **Particle Background**: Floating particles for visual appeal
- **Scroll Animations**: Elements animate as you scroll through the page
- **Theme Toggle**: Switch between light and dark modes
- **Loading Screen**: Elegant loading animation on page load

### Sections
1. **Hero Section**
   - Animated introduction with name display
   - Dynamic typing effect showing multiple roles
   - Call-to-action buttons with hover effects
   - Gradient background with particle effects
   - Scroll indicator

2. **About Section**
   - Personal introduction and education details
   - VMKVEC Salem, Third Year IT student
   - Animated statistics counters (Years Learning, Projects, Technologies)
   - Profile placeholder with creative styling
   - Education and location information

3. **Skills Section**
   - **Web Development Skills**: HTML5, CSS3, JavaScript, React, Node.js, Git
   - **Data Analytics Skills**: Python, SQL, Data Visualization, ML Basics, Excel, Pandas
   - Animated progress bars showing proficiency levels
   - Colorful skill cards with icons and hover effects
   - Organized by category

4. **Projects Section**
   - 4 featured projects with descriptions
   - Project cards with gradient placeholders
   - Hover overlays revealing project links
   - Technology tags for each project
   - Links to live demos and GitHub repositories

5. **Contact Section**
   - Contact form with validation (name, email, subject, message)
   - Email validation and required field checks
   - Social media links (GitHub, LinkedIn, Twitter, Instagram)
   - Contact information display
   - Success/error message feedback

### Technical Features
- **Pure HTML, CSS, and JavaScript**: No frameworks required
- **Fully Responsive**: Works on mobile, tablet, and desktop
- **Modern CSS**: CSS Grid, Flexbox, CSS Variables
- **Smooth Scrolling**: Between sections and navigation
- **Animated Navbar**: Changes appearance on scroll
- **Scroll-to-Top Button**: Appears after scrolling down
- **Form Validation**: Client-side validation for contact form
- **Performance Optimized**: Debounced scroll events, Intersection Observer API
- **Cross-browser Compatible**: Works on all modern browsers
- **Accessible**: Semantic HTML and ARIA labels where needed

## 🎨 Color Palette

The website uses a vibrant, modern color scheme:
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Secondary**: Pink gradient (#f093fb to #f5576c)
- **Accent**: Cyan gradient (#4facfe to #00f2fe)
- **Success**: Green gradient (#43e97b to #38f9d7)

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/vipsibi/vipsibi.github.io.git
   cd vipsibi.github.io
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     ```

3. **Visit the site**
   - Local: `http://localhost:8000`
   - Live: [sibirajs.me](https://sibirajs.me) or [vipsibi.github.io](https://vipsibi.github.io)

## 📁 File Structure

```
vipsibi.github.io/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Interactive functionality
├── README.md           # Documentation
└── CNAME               # Custom domain configuration
```

## 🛠️ Customization

### Update Personal Information
1. **Name & Title**: Edit the hero section in `index.html`
2. **About Content**: Modify the about section text
3. **Skills**: Add or remove skills in the skills section
4. **Projects**: Replace placeholder projects with your own
5. **Contact Info**: Update email and social media links

### Modify Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    /* Add your custom colors */
}
```

### Change Typing Text
Update the `typingTexts` array in `script.js`:
```javascript
const typingTexts = [
    'Web Developer',
    'Data Analytics Enthusiast',
    // Add your roles
];
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

## ⚡ Performance

- Optimized animations with CSS transforms
- Debounced scroll events
- Intersection Observer for lazy loading
- Minimal external dependencies (only Font Awesome for icons)

## 📝 License

This project is open source and available for personal and educational use.

## 👤 About Sibirajs

Sibirajs is a passionate web developer and data analytics enthusiast currently pursuing Third Year IT at VMKVEC Salem. With expertise in both web technologies and data science, Sibirajs creates beautiful, functional web applications and extracts meaningful insights from data.

## 🤝 Contributing

Feel free to fork this repository and customize it for your own portfolio!

## 📧 Contact

- **Email**: sibirajs@example.com
- **Location**: Salem, Tamil Nadu, India
- **Institution**: VMKVEC Salem

---

Made with ❤️ and 💻 by Sibirajs