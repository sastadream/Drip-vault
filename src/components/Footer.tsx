import React from 'react';

export function Footer() {
  return (
    <footer className="py-8 mt-auto bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Made with ❤️ by{' '}
            <a
              href="https://github.com/sastadream"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              sastadream
            </a>{' '}
            (Samir Desai)
          </p>
        </div>
      </div>
    </footer>
  );
}
