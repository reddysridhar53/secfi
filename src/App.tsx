import { ErrorBoundary, Header, PageLayout } from '@components';
import { CssBaseline } from '@medly-components/core';
import Routes from '@routes';
import { defaultTheme } from '@theme';
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import datasourceApiManager from 'services/datasources/datasource-api';
import { ThemeProvider } from 'styled-components';
import './app.scss';

const App: React.FC = () => {
    useEffect(() => {
       datasourceApiManager.init();
    }, [])
    
    return (
    <ThemeProvider theme={defaultTheme}>
        <>
            <CssBaseline />
            <Router>
                <ErrorBoundary>
                    <PageLayout>
                        <Header />
                        <Routes />
                    </PageLayout>
                </ErrorBoundary>
            </Router>
        </>
    </ThemeProvider>);
};

export default App;
