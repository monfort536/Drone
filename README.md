# SkyVision - Premium Drone Services Template

## Overview
SkyVision is a premium, modern, visually impressive, fully responsive Drone Services HTML website template. It is designed for Drone Photography Companies, Aerial Videography Services, Land Surveying Companies, and Industrial Inspection Agencies.

## Features
- **100% Frontend HTML Template**
- 2 Unique Home Pages (General & Tech/Surveying)
- Dark / Light Mode Toggle
- RTL Support
- Premium UI/UX Design
- Vanilla JavaScript (No jQuery)
- Bootstrap 5 Grid & Utilities
- FormSubmit Contact Form Integration
- Demo Authentication System (LocalStorage)
- Admin Dashboard (Demo)

## Pages Included
- `index.html` (Home 1 - General)
- `home-2.html` (Home 2 - Tech)
- `about.html`
- `services.html`
- `service-details.html`
- `portfolio.html`
- `portfolio-details.html`
- `pricing.html`
- `blog.html`
- `blog-details.html`
- `contact.html`
- `login.html`
- `register.html`
- `profile.html`
- `dashboard.html` (Admin Only)
- `404.html`

## Technology Stack
- HTML5 & CSS3
- Vanilla JavaScript (ES6+)
- Bootstrap 5 (CSS only for grid & components)
- Bootstrap Icons

## Installation & Usage
1. Extract the folder `drone-services-template`.
2. Open `index.html` in your web browser.
3. No server required for basic viewing, but a local server (like Live Server in VSCode) is recommended.

## FormSubmit Setup
The contact form uses FormSubmit. 
To configure:
1. Open `contact.html`.
2. Find the form action: `<form action="https://formsubmit.co/YOUR_EMAIL_HERE" method="POST">`
3. Replace `YOUR_EMAIL_HERE` with your actual email address.

## Authentication Demo (Important Warning)
This template includes a demo authentication system using **LocalStorage**. 
**WARNING: Passwords stored in LocalStorage are NOT secure for production.** 
This is purely for demonstration purposes to show UI states for logged-in users and admins.

### Admin Credentials
An admin account is automatically created upon initialization:
- **Email:** admin@skyvision.com
- **Password:** Admin@123

Only this account can access `dashboard.html`.

## Customization
- **Colors & Fonts:** Edit `assets/css/style.css` `:root` variables.
- **Dark Mode:** Handled via `assets/css/dark-mode.css`.
- **RTL:** Handled via `assets/css/rtl.css`.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
