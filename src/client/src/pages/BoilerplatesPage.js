import React from 'react';
import styled from 'styled-components';
import { Truck, TrendingUp, Cpu } from 'lucide-react';

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

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const CategoryCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CategoryIcon = styled.div`
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

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
`;

const CategoryDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;

  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #4ade80;
    font-weight: bold;
  }
`;

const BoilerplatesPage = () => {
  const categories = [
    {
      icon: TrendingUp,
      title: 'FinTech Solutions',
      description: 'Complete financial technology platforms with payment processing, trading systems, and compliance frameworks.',
      features: [
        'Payment Gateway Integration',
        'Trading Platform Architecture',
        'KYC/AML Compliance',
        'Cryptocurrency Wallets',
        'Banking APIs'
      ]
    },
    {
      icon: Truck,
      title: 'Logistics & Supply Chain',
      description: 'End-to-end supply chain management systems with real-time tracking and inventory optimization.',
      features: [
        'Warehouse Management',
        'Fleet Tracking Systems',
        'Inventory Optimization',
        'Shipping Integration',
        'Cold Chain Monitoring'
      ]
    },
    {
      icon: Cpu,
      title: 'Research & Development',
      description: 'Advanced R&D platforms for laboratory management, experiment tracking, and scientific collaboration.',
      features: [
        'Lab Management Systems',
        'Experiment Tracking',
        'Data Analysis Pipelines',
        'Collaboration Tools',
        'IP Management'
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <Title>Full-Stack Boilerplates</Title>
        <Subtitle>
          Production-ready boilerplates for FinTech, logistics, and R&D with modern tech stacks
        </Subtitle>
      </Header>

      <CategoryGrid>
        {categories.map((category, index) => (
          <CategoryCard key={index}>
            <CategoryIcon>
              <category.icon size={24} />
            </CategoryIcon>
            <CategoryTitle>{category.title}</CategoryTitle>
            <CategoryDescription>{category.description}</CategoryDescription>
            <FeatureList>
              {category.features.map((feature, featureIndex) => (
                <FeatureItem key={featureIndex}>{feature}</FeatureItem>
              ))}
            </FeatureList>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </Container>
  );
};

export default BoilerplatesPage;