import React from 'react';
import styled from 'styled-components';
import { Database, Code, Shield, Zap } from 'lucide-react';

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

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const FeatureIcon = styled.div`
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

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const SmartContractsPage = () => {
  const features = [
    {
      icon: Code,
      title: 'Smart Contract Generation',
      description: 'Generate secure, optimized smart contracts for any blockchain platform with built-in best practices.'
    },
    {
      icon: Database,
      title: 'Whitepaper Creation',
      description: 'Comprehensive whitepaper generation with technical specifications, tokenomics, and roadmaps.'
    },
    {
      icon: Shield,
      title: 'Security Auditing',
      description: 'Automated security analysis and vulnerability detection for smart contract code.'
    },
    {
      icon: Zap,
      title: 'Gas Optimization',
      description: 'Advanced gas optimization techniques to minimize transaction costs and improve efficiency.'
    }
  ];

  return (
    <Container>
      <Header>
        <Title>Smart Contracts & Whitepapers</Title>
        <Subtitle>
          Generate, audit, and deploy smart contracts with comprehensive documentation
        </Subtitle>
      </Header>

      <FeatureGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>
              <feature.icon size={24} />
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Container>
  );
};

export default SmartContractsPage;