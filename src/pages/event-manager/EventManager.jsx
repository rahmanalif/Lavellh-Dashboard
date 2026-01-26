import EventManagerSection from '@/components/dashboardcomponents/EventManagerSection';
import EventOverview from '@/components/dashboardcomponents/EventOverview';
import React from 'react';

const EventManager = () => {
    return (
        <div>
            <EventOverview />
            <EventManagerSection />
        </div>
    );
}

export default EventManager;
