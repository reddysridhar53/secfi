import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

const Home = lazy(() => import(/* webpackChunkName: "Home" */ /* webpackPrefetch: true */ '@pages/Home'));
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ /* webpackPrefetch: true */ '@pages/NotFound'));

export const Routes: React.FC = () => (
    <Suspense fallback={<span>Loading ...</span>}>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="**" component={NotFound} />
        </Switch>
    </Suspense>
);
