import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X, Code, Database, Shield, FileText, Coins, Package } from 'lucide-react';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  padding: 1rem 2rem;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/templates', label: 'Templates', icon: FileText },
    { path: '/ide', label: 'Quadrinary IDE', icon: Code },
    { path: '/compliance', label: 'Compliance', icon: Shield },
    { path: '/smart-contracts', label: 'Smart Contracts', icon: Database },
    { path: '/nft', label: 'NFT & Liquidity', icon: Coins },
    { path: '/boilerplates', label: 'Boilerplates', icon: Package },
  ];

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">
          gTek SaaS
        </Logo>
        
        <NavLinks isOpen={isOpen}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={() => setIsOpen(false)}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </NavLinks>

        <MenuButton onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuButton>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;