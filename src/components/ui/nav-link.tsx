import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}

/**
 * Custom NavLink component that automatically applies active/inactive styling
 * based on the current route.
 */
const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = 'text-vintage-forest-green',
  inactiveClassName = 'text-vintage-forest-green/70',
  exact = true,
  onClick,
}) => {
  const location = useLocation();
  
  // Determine if the link is active
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  // Combine classes
  const linkClassName = `
    text-lg font-medium transition-colors hover:text-vintage-forest-green
    ${isActive ? activeClassName : inactiveClassName}
    ${className}
  `.trim();

  return (
    <Link to={to} className={linkClassName} onClick={onClick}>
      {children}
    </Link>
  );
};

export default NavLink;