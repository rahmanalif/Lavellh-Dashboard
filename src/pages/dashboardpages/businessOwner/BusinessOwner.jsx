
import BizOwnerList from '@/components/dashboardcomponents/BizOwnerList';
import BusinessOverview from '@/components/dashboardcomponents/BusinessOverview';
import React from 'react';

const BusinessOwner = () => {
    return (
        <div>
           <BusinessOverview /> 
           <BizOwnerList />
        </div>
    );
}

export default BusinessOwner;
