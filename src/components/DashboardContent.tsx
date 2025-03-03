'use client';

import React from 'react';

export default function DashboardContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dashboard content will go here */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Recent Activity</h2>
          <p>No recent activity to display.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Your Ideas</h2>
          <p>You haven't submitted any ideas yet.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Notifications</h2>
          <p>No new notifications.</p>
        </div>
      </div>
    </div>
  );
} 