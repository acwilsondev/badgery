import { render, screen } from '@testing-library/react';
import { meta, default as Index } from '~/routes/_index';

describe('Index Route', () => {
  describe('meta', () => {
    it('should return correct metadata', () => {
      const result = meta();
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ title: 'New Remix App' });
      expect(result[1]).toEqual({ 
        name: 'description', 
        content: 'Welcome to Remix!' 
      });
    });
  });

  describe('Index component', () => {
    beforeEach(() => {
      render(<Index />);
    });

    it('should render welcome heading', () => {
      expect(screen.getByRole('heading', { 
        name: /welcome to remix/i 
      })).toBeInTheDocument();
    });

    it('should render both light and dark mode logos', () => {
      const lightLogo = screen.getByTestId('logo-light');
      expect(lightLogo).toHaveClass('block', 'dark:hidden');
      expect(lightLogo).toHaveAttribute('src', '/logo-light.png');

      const darkLogo = screen.getByTestId('logo-dark');
      expect(darkLogo).toHaveClass('hidden', 'dark:block');
      expect(darkLogo).toHaveAttribute('src', '/logo-dark.png');
    });

    it('should render navigation with external links', () => {
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(4);

      // Check each link has correct attributes
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noreferrer');
      });
    });

    it('should render all resource links with correct URLs', () => {
      const expectedLinks = [
        'https://remix.run/start/quickstart',
        'https://remix.run/start/tutorial',
        'https://remix.run/docs',
        'https://rmx.as/discord'
      ];

      const links = screen.getAllByRole('link');
      const hrefs = links.map(link => link.getAttribute('href'));
      expect(hrefs).toEqual(expectedLinks);
    });

    it('should render SVG icons for each link', () => {
      const svgs = document.querySelectorAll('svg');
      expect(svgs).toHaveLength(4);
      
      svgs.forEach(svg => {
        expect(svg).toHaveClass(
          'stroke-gray-600',
          'group-hover:stroke-current',
          'dark:stroke-gray-300'
        );
      });
    });
  });
});

