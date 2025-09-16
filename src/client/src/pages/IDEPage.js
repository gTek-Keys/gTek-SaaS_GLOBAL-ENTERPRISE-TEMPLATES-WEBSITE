import React, { useState } from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';
import { Play, Save, Settings, Folder, Bug } from 'lucide-react';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
`;

const Header = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const IDEContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: 60px 1fr 200px;
  gap: 1rem;
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
`;

const Toolbar = styled.div`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const Sidebar = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarTitle = styled.h3`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FileItem = styled.div`
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
  }
`;

const EditorContainer = styled.div`
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RightPanel = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
`;

const PanelSection = styled.div`
  margin-bottom: 2rem;
`;

const PanelTitle = styled.h4`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CollaboratorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
`;

const CollaboratorInfo = styled.div`
  flex: 1;
`;

const CollaboratorName = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CollaboratorStatus = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const TerminalContainer = styled.div`
  grid-column: 1 / -1;
  background: #1e1e1e;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 0.9rem;
  overflow-y: auto;
`;

const TerminalLine = styled.div`
  margin-bottom: 0.5rem;
  
  &.input {
    color: white;
    
    &:before {
      content: '$ ';
      color: #00ff00;
    }
  }
`;

const IDEPage = () => {
  const [activeFile, setActiveFile] = useState('app.js');
  const [code, setCode] = useState(`// Welcome to gTek Quadrinary IDE
import React from 'react';
import { motion } from 'framer-motion';

const App = () => {
  const handleClick = () => {
    console.log('Hello from gTek SaaS!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>gTek SaaS Platform</h1>
      <button onClick={handleClick}>
        Click me!
      </button>
    </motion.div>
  );
};

export default App;`);

  const files = [
    { name: 'app.js', type: 'javascript' },
    { name: 'components/', type: 'folder' },
    { name: 'services/', type: 'folder' },
    { name: 'utils/', type: 'folder' },
    { name: 'package.json', type: 'json' },
    { name: 'README.md', type: 'markdown' }
  ];

  const collaborators = [
    { name: 'Alice Johnson', status: 'Online', initials: 'AJ' },
    { name: 'Bob Smith', status: 'Editing main.js', initials: 'BS' },
    { name: 'Carol Davis', status: 'Away', initials: 'CD' }
  ];

  const terminalOutput = [
    { type: 'input', text: 'npm start' },
    { type: 'output', text: 'Starting development server...' },
    { type: 'output', text: 'Compiled successfully!' },
    { type: 'output', text: 'Local: http://localhost:3000' },
    { type: 'output', text: 'Network: http://192.168.1.100:3000' },
    { type: 'input', text: 'npm test' },
    { type: 'output', text: 'Test Suites: 1 passed, 1 total' },
    { type: 'output', text: 'Tests: 5 passed, 5 total' }
  ];

  const handleRunCode = () => {
    console.log('Running code...');
  };

  const handleSaveFile = () => {
    console.log('Saving file...');
  };

  return (
    <Container>
      <Header>
        <Title>Quadrinary IDE</Title>
        <Subtitle>
          Advanced integrated development environment with real-time collaboration
        </Subtitle>
      </Header>

      <IDEContainer>
        <Toolbar>
          <ToolbarButton onClick={handleRunCode}>
            <Play size={16} />
            Run
          </ToolbarButton>
          <ToolbarButton onClick={handleSaveFile}>
            <Save size={16} />
            Save
          </ToolbarButton>
          <ToolbarButton>
            <Settings size={16} />
            Settings
          </ToolbarButton>
          <ToolbarButton>
            <Bug size={16} />
            Debug
          </ToolbarButton>
        </Toolbar>

        <Sidebar>
          <SidebarTitle>Explorer</SidebarTitle>
          {files.map((file, index) => (
            <FileItem
              key={index}
              className={activeFile === file.name ? 'active' : ''}
              onClick={() => setActiveFile(file.name)}
            >
              <Folder size={16} />
              {file.name}
            </FileItem>
          ))}
        </Sidebar>

        <EditorContainer>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </EditorContainer>

        <RightPanel>
          <PanelSection>
            <PanelTitle>Collaborators</PanelTitle>
            {collaborators.map((collaborator, index) => (
              <CollaboratorItem key={index}>
                <Avatar>{collaborator.initials}</Avatar>
                <CollaboratorInfo>
                  <CollaboratorName>{collaborator.name}</CollaboratorName>
                  <CollaboratorStatus>{collaborator.status}</CollaboratorStatus>
                </CollaboratorInfo>
              </CollaboratorItem>
            ))}
          </PanelSection>

          <PanelSection>
            <PanelTitle>Problems</PanelTitle>
            <FileItem>
              <span style={{ color: '#ffa500' }}>⚠️</span>
              Unused variable 'result' (line 15)
            </FileItem>
            <FileItem>
              <span style={{ color: '#00ff00' }}>✓</span>
              No syntax errors detected
            </FileItem>
          </PanelSection>
        </RightPanel>

        <TerminalContainer>
          {terminalOutput.map((line, index) => (
            <TerminalLine key={index} className={line.type}>
              {line.text}
            </TerminalLine>
          ))}
          <TerminalLine className="input">_</TerminalLine>
        </TerminalContainer>
      </IDEContainer>
    </Container>
  );
};

export default IDEPage;