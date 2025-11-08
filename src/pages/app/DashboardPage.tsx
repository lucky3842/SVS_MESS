import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    // To avoid timezone issues, treat the date string as UTC
    const date = new Date(selectedDate + 'T00:00:00');
    alert('Entry submitted for ' + date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Daily Entry</CardTitle>
          <CardDescription>Select a date and fill in the details for the mess.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="entryDate">Date</Label>
              <Input
                id="entryDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="morningCount">Morning Count</Label>
              <Input id="morningCount" type="number" placeholder="e.g., 50" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="nightCount">Night Count</Label>
              <Input id="nightCount" type="number" placeholder="e.g., 45" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="attendance">Total Attendance</Label>
              <Input id="attendance" type="number" placeholder="e.g., 95" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full !mt-6">Submit Entry</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>A quick look at today's numbers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="font-medium text-secondary-foreground">Morning Count</span>
                <span className="font-bold text-lg text-primary">50</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="font-medium text-secondary-foreground">Night Count</span>
                <span className="font-bold text-lg text-primary">45</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="font-medium text-secondary-foreground">Total Attendance</span>
                <span className="font-bold text-lg text-primary">95</span>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
