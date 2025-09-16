import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { FileText, Download, Eye, Search } from 'lucide-react';
import axios from 'axios';

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

const FilterSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: translateY(-2px);
  }
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  color: white;
  font-size: 1rem;
  flex: 1;
  min-width: 300px;
  position: relative;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const TemplateCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const TemplateIcon = styled.div`
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

const TemplateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const TemplateCategory = styled.span`
  display: inline-block;
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const TemplateDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.primary ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const ErrorState = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin: 2rem 0;
`;

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    'templateCategories',
    () => axios.get('/api/templates/categories').then(res => res.data)
  );

  const categories = categoriesData?.data || {};
  const allCategories = ['all', ...Object.keys(categories)];

  // Mock template data for demonstration
  const mockTemplates = [
    {
      id: 1,
      title: 'Strategic Planning Template',
      category: 'business',
      description: 'Comprehensive strategic planning framework for enterprise-level decision making and goal setting.',
      features: ['SWOT Analysis', 'Goal Setting', 'KPI Tracking', 'Resource Planning']
    },
    {
      id: 2,
      title: 'API Documentation Template',
      category: 'technical',
      description: 'Professional API documentation template with examples, authentication, and best practices.',
      features: ['OpenAPI Spec', 'Code Examples', 'Authentication Guide', 'Error Handling']
    },
    {
      id: 3,
      title: 'GDPR Compliance Framework',
      category: 'compliance',
      description: 'Complete GDPR compliance framework with policies, procedures, and audit checklists.',
      features: ['Data Mapping', 'Privacy Policies', 'Consent Management', 'Breach Response']
    },
    {
      id: 4,
      title: 'Quantum Computing Research Protocol',
      category: 'cosmic',
      description: 'Advanced research protocol for quantum computing initiatives and cosmic-scale thinking.',
      features: ['Quantum Principles', 'Research Methodology', 'Collaboration Framework', 'Future Roadmap']
    }
  ];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGenerateTemplate = (templateId) => {
    console.log('Generating template:', templateId);
    // Implementation for template generation
  };

  const handlePreviewTemplate = (templateId) => {
    console.log('Previewing template:', templateId);
    // Implementation for template preview
  };

  if (categoriesLoading) {
    return (
      <Container>
        <LoadingState>Loading template categories...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Enterprise Templates</Title>
        <Subtitle>
          Generate professional templates for business, technical, compliance, and cosmic use cases
        </Subtitle>
      </Header>

      <FilterSection>
        {allCategories.map(category => (
          <FilterButton
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Templates' : category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
        
        <SearchWrapper>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </FilterSection>

      <TemplatesGrid>
        {filteredTemplates.map((template, index) => (
          <TemplateCard
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <TemplateIcon>
              <FileText size={20} />
            </TemplateIcon>
            <TemplateTitle>{template.title}</TemplateTitle>
            <TemplateCategory>{template.category}</TemplateCategory>
            <TemplateDescription>{template.description}</TemplateDescription>
            
            <ActionButtons>
              <ActionButton onClick={() => handlePreviewTemplate(template.id)}>
                <Eye size={16} />
                Preview
              </ActionButton>
              <ActionButton primary onClick={() => handleGenerateTemplate(template.id)}>
                <Download size={16} />
                Generate
              </ActionButton>
            </ActionButtons>
          </TemplateCard>
        ))}
      </TemplatesGrid>

      {filteredTemplates.length === 0 && (
        <ErrorState>
          <h3>No templates found</h3>
          <p>Try adjusting your search criteria or category filter.</p>
        </ErrorState>
      )}
    </Container>
  );
};

export default TemplatesPage;