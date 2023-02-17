import React from 'react';
import { Navigate } from 'react-router-dom';

import { session } from '../helpers/app';

const PublicRoute = ({ component: RouteComponent, redirectPath = "/dashboard" }) => {
    console.log(session)
    if (!session) return <RouteComponent />
    else return <Navigate to={redirectPath} replace={true} />
}

export default PublicRoute;