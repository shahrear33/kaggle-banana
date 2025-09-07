// PDF Font loader for jsPDF
// This module helps load custom fonts into jsPDF documents

/**
 * Adds custom fonts to a jsPDF document instance
 * @param {Object} doc - jsPDF document instance
 */
export const addFont = (doc) => {
  try {
    // You can add custom font loading logic here
    // For now, we'll use the default fonts in jsPDF
    
    // Example of how to add a custom font if you have the font files:
    // doc.addFont('path/to/font.ttf', 'Poppins', 'normal');
    // doc.addFont('path/to/font-bold.ttf', 'Poppins', 'bold');
    
    console.log('Font loading complete');
    return true;
  } catch (error) {
    console.error('Error loading fonts:', error);
    return false;
  }
};
