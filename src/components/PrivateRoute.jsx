import React from 'react';
import { Navigate } from 'react-router-dom';

import { session } from '../helpers/app';

const PrivateRoute = ({ component: RouteComponent, redirectPath = "/" }) => {
    if (session) return <RouteComponent />
    else return <Navigate to={redirectPath} replace={true} />
}

export default PrivateRoute;