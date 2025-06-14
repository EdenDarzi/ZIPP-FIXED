import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted/50 border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} SwiftServe. All rights reserved.</p>
        <p className="mt-1">Crafted with care for your convenience.</p>
      </div>
    </footer>
  );
};

export default Footer;
