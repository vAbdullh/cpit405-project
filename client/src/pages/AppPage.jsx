import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart3, Users, CreditCard, Activity } from 'lucide-react';

export default function AppPage() {
  const user = useSelector((state) => state.auth.user);

  const stats = [
    { name: 'Total Revenue', value: '$45,231.89', icon: CreditCard },
    { name: 'Subscriptions', value: '+2350', icon: Users },
    { name: 'Sales', value: '+12,234', icon: BarChart3 },
    { name: 'Active Now', value: '+573', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">App Dashboard</h2>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <p>Welcome back, <strong className="text-primary">{user?.name || 'User'}</strong>! You are viewing the protected application area.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{stat.name}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
