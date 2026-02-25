/**
 * Utility function for smooth scrolling to sections
 * @param sectionId - ID of the section to scroll to
 * @param callback - Optional callback to run after scrolling
 */
export const scrollToSection = (sectionId: string, callback?: () => void) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    callback?.();
  }
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
