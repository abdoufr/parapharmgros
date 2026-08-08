/**
 * Image Upload Helper
 * Converts any image selected from phone/computer into a high-quality Data URL (Base64)
 * with client-side canvas optimization so there is NO file size limit or upload server errors!
 */

export const processImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Aucun fichier sélectionné.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier image.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format d\'image non valide.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate responsive dimensions while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG/PNG Base64 string
        const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
};
