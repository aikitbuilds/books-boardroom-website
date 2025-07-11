# Books & Boardroom Images

## Required Images

To complete the website setup, please upload the following images to this directory:

### 1. Cyndi Dinh Professional Photo
- **Filename:** `cyndi-dinh-professional.jpg`
- **Recommended size:** 320x320px (square)
- **Format:** JPG or PNG
- **Description:** Professional headshot of Cyndi Dinh for the About section

### 2. Testimonial Photos (Optional)
- **Mike Nguyen (SmartView Solutions):** `smartview-solutions.jpg` (64x64px)
- **Other testimonials:** `testimonial-2.jpg`, `testimonial-3.jpg` (64x64px each)

### 3. Blog Post Images (Future)
- `blog-llc-scorp.jpg` - For LLC vs S-Corp article
- `blog-cash-flow.jpg` - For cash flow article  
- `blog-mistakes.jpg` - For bookkeeping mistakes article

## Upload Instructions

1. Place all images in this `/public/images/` directory
2. Use the exact filenames listed above
3. Recommended formats: JPG (preferred) or PNG
4. Optimize images for web (compress to reduce file size)

## Image Requirements

- **Professional photos:** High quality, well-lit, professional appearance
- **Square format** for profile photos (1:1 aspect ratio)
- **Web-optimized:** Compressed but still high quality
- **Appropriate size:** Don't exceed 1MB per image

## Fallback Images

The website includes fallback images from Unsplash that will display if the actual images are not found. Once you upload the real images with the correct filenames, they will automatically replace the fallbacks.

---

After uploading images, run:
```bash
npm run build
firebase deploy --only hosting
```

This will update the live website with the new images. 