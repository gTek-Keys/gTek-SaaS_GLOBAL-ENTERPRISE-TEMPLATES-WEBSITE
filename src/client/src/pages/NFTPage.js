import React from 'react';
import styled from 'styled-components';
import { Coins, Palette, Music, Gamepad2 } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.section`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ServiceCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const ServiceIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  color: white;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const NFTPage = () => {
  const services = [
    {
      icon: Palette,
      title: 'NFT Collection Generation',
      description: 'Create complete NFT collections with metadata, rarity systems, and marketplace integration.'
    },
    {
      icon: Coins,
      title: 'Liquidity Pool Architecture',
      description: 'Design and deploy liquidity pools for DeFi protocols with optimal tokenomics.'
    },
    {
      icon: Music,
      title: 'Music & Media NFTs',
      description: 'Specialized tools for creating music, video, and multimedia NFT collections.'
    },
    {
      icon: Gamepad2,
      title: 'Gaming NFTs',
      description: 'Generate gaming assets, characters, and utility NFTs for blockchain games.'
    }
  ];

  return (
    <Container>
      <Header>
        <Title>NFT Minting & Liquidity Pools</Title>
        <Subtitle>
          Complete solutions for NFT creation, minting, and DeFi liquidity pool architectures
        </Subtitle>
      </Header>

      <ServiceGrid>
        {services.map((service, index) => (
          <ServiceCard key={index}>
            <ServiceIcon>
              <service.icon size={24} />
            </ServiceIcon>
            <ServiceTitle>{service.title}</ServiceTitle>
            <ServiceDescription>{service.description}</ServiceDescription>
          </ServiceCard>
        ))}
      </ServiceGrid>
    </Container>
  );
};

export default NFTPage;