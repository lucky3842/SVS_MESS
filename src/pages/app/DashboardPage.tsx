import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TodayEntry {
  morning_count: number;
  night_count: number;
  total_attendance: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [morningCount, setMorningCount] = useState('');
  const [nightCount, setNightCount] = useState('');
  const [attendance, setAttendance] = useState('');
  const [todayData, setTodayData] = useState<TodayEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  const fetchTodayEntry = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_entries')
      .select('morning_count, night_count, total_attendance')
      .eq('entry_date', today)
      .maybeSingle();

    if (data) {
      setTodayData(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !user) {
      setError('Please select a date and ensure you are logged in.');
      return;
    }

    setError('');
    setLoading(true);

    const { error: submitError } = await supabase
      .from('daily_entries')
      .upsert({
        entry_date: selectedDate,
        morning_count: parseInt(morningCount),
        night_count: parseInt(nightCount),
        total_attendance: parseInt(attendance),
        user_id: user.id,
      }, {
        onConflict: 'entry_date'
      });

    setLoading(false);

    if (submitError) {
      setError(submitError.message);
    } else {
      setMorningCount('');
      setNightCount('');
      setAttendance('');
      fetchTodayEntry();
      alert('Entry submitted successfully!');
    }
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
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
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
              <Input
                id="morningCount"
                type="number"
                placeholder="e.g., 50"
                value={morningCount}
                onChange={(e) => setMorningCount(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="nightCount">Night Count</Label>
              <Input
                id="nightCount"
                type="number"
                placeholder="e.g., 45"
                value={nightCount}
                onChange={(e) => setNightCount(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="attendance">Total Attendance</Label>
              <Input
                id="attendance"
                type="number"
                placeholder="e.g., 95"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full !mt-6" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Entry'}
            </Button>
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
                <span className="font-bold text-lg text-primary">
                  {todayData?.morning_count ?? '-'}
                </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="font-medium text-secondary-foreground">Night Count</span>
                <span className="font-bold text-lg text-primary">
                  {todayData?.night_count ?? '-'}
                </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="font-medium text-secondary-foreground">Total Attendance</span>
                <span className="font-bold text-lg text-primary">
                  {todayData?.total_attendance ?? '-'}
                </span>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
