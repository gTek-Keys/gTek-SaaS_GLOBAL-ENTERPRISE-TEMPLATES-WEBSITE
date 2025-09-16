import React from 'react';
import styled from 'styled-components';
import { Shield, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

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

const ComplianceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ComplianceCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.status === 'compliant' ? '#4ade80' : props.status === 'warning' ? '#fbbf24' : '#f87171'};
  font-weight: 500;
`;

const CompliancePage = () => {
  const frameworks = [
    {
      name: 'GDPR',
      description: 'General Data Protection Regulation compliance framework for EU data protection.',
      status: 'compliant'
    },
    {
      name: 'SOX',
      description: 'Sarbanes-Oxley Act compliance for financial reporting and corporate governance.',
      status: 'warning'
    },
    {
      name: 'HIPAA',
      description: 'Health Insurance Portability and Accountability Act for healthcare data protection.',
      status: 'compliant'
    },
    {
      name: 'ISO 27001',
      description: 'Information Security Management System standard for data security.',
      status: 'compliant'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Compliance Framework</Title>
        <Subtitle>
          Comprehensive compliance monitoring and management for enterprise standards
        </Subtitle>
      </Header>

      <ComplianceGrid>
        {frameworks.map((framework, index) => (
          <ComplianceCard key={index}>
            <CardIcon>
              <Shield size={20} />
            </CardIcon>
            <CardTitle>{framework.name}</CardTitle>
            <CardDescription>{framework.description}</CardDescription>
            <StatusIndicator status={framework.status}>
              {getStatusIcon(framework.status)}
              {framework.status === 'compliant' ? 'Compliant' : 'Needs Attention'}
            </StatusIndicator>
          </ComplianceCard>
        ))}
      </ComplianceGrid>
    </Container>
  );
};

export default CompliancePage;