import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
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
  href,
  children,
  className = '',
  activeClassName = 'text-vintage-deep-blue',
  inactiveClassName = 'text-vintage-deep-blue/70',
  exact = true,
  onClick,
}) => {
  const router = useRouter();
  
  // Determine if the link is active
  const isActive = exact 
    ? router.pathname === href 
    : router.pathname.startsWith(href);

  // Combine classes
  const linkClassName = cn(
    "text-lg font-medium transition-colors hover:text-vintage-deep-blue",
    isActive ? activeClassName : inactiveClassName,
    className
  );

  return (
    <Link href={href} className={linkClassName} onClick={onClick}>
      {children}
    </Link>
  );
};

export default NavLink;