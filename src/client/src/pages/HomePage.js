import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Shield, Database, Coins, Package, FileText } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled(motion.section)`
  text-align: center;
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  margin-bottom: 4rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 10px 30px rgba(238, 90, 36, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(238, 90, 36, 0.4);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
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
  margin-bottom: 1rem;
  color: white;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FeatureLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #764ba2;
  }
`;

const StatsSection = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 4rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StatItem = styled.div`
  color: white;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
`;

const HomePage = () => {
  const features = [
    {
      icon: Code,
      title: 'Quadrinary IDE',
      description: 'Advanced integrated development environment with real-time collaboration, multi-language support, and intelligent code analysis.',
      link: '/ide'
    },
    {
      icon: FileText,
      title: 'Enterprise Templates',
      description: 'Generate business, technical, compliance, and cosmic templates for any enterprise scenario with AI-powered customization.',
      link: '/templates'
    },
    {
      icon: Shield,
      title: 'Compliance-First',
      description: 'Built-in compliance frameworks for GDPR, SOX, HIPAA, and more with automated monitoring and reporting.',
      link: '/compliance'
    },
    {
      icon: Database,
      title: 'Smart Contracts',
      description: 'Generate, audit, and deploy smart contracts with comprehensive whitepapers and security analysis.',
      link: '/smart-contracts'
    },
    {
      icon: Coins,
      title: 'NFT & DeFi',
      description: 'Complete NFT minting platforms and liquidity pool architectures for decentralized finance applications.',
      link: '/nft'
    },
    {
      icon: Package,
      title: 'Full-Stack Boilerplates',
      description: 'Production-ready boilerplates for FinTech, logistics, and R&D with modern tech stacks and best practices.',
      link: '/boilerplates'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Enterprise Templates' },
    { number: '50+', label: 'Compliance Frameworks' },
    { number: '100+', label: 'Smart Contract Types' },
    { number: '25+', label: 'Technology Stacks' }
  ];

  return (
    <Container>
      <Hero
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          SaaS Global Templates Services
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          A Quadrinary IDE and compliance-first SaaS that generates enterprise templates, 
          smart contract whitepapers, NFT minting architectures, and full-stack boilerplates 
          for FinTech, logistics, and R&D.
        </HeroSubtitle>
        <CTAButton
          to="/templates"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started <ArrowRight size={20} />
        </CTAButton>
      </Hero>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <FeatureIcon>
              <feature.icon size={24} />
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
            <FeatureLink to={feature.link}>
              Learn More <ArrowRight size={16} />
            </FeatureLink>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <StatsSection>
        <motion.h2
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '1rem' 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Powering Enterprise Innovation
        </motion.h2>
        <motion.p
          style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '1.1rem' 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Trusted by enterprise teams worldwide for their most critical projects
        </motion.p>
        <StatsGrid>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
            >
              <StatItem>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            </motion.div>
          ))}
        </StatsGrid>
      </StatsSection>
    </Container>
  );
};

export default HomePage;