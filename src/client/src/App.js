import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';
import IDEPage from './pages/IDEPage';
import CompliancePage from './pages/CompliancePage';
import SmartContractsPage from './pages/SmartContractsPage';
import NFTPage from './pages/NFTPage';
import BoilerplatesPage from './pages/BoilerplatesPage';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed navbar */
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/ide" element={<IDEPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/smart-contracts" element={<SmartContractsPage />} />
            <Route path="/nft" element={<NFTPage />} />
            <Route path="/boilerplates" element={<BoilerplatesPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App;