
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted/50 border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} SwiftServe. כל הזכויות שמורות.</p>
        <p className="mt-1">נוצר באהבה לנוחיותך.</p>
      </div>
    </footer>
  );
};

export default Footer;
