import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Entry {
  id: string;
  entry_date: string;
  morning_count: number;
  night_count: number;
  total_attendance: number;
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('daily_entries')
      .select('id, entry_date, morning_count, night_count, total_attendance')
      .order('entry_date', { ascending: false });

    if (data) {
      setEntries(data);
    }
    setLoading(false);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Entries</CardTitle>
        <CardDescription>A log of all past daily records.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading entries...</div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No entries found. Create one from the Dashboard.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Morning</th>
                  <th scope="col" className="px-6 py-3">Night</th>
                  <th scope="col" className="px-6 py-3">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="bg-white border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {new Date(entry.entry_date + 'T00:00:00').toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </th>
                    <td className="px-6 py-4">{entry.morning_count}</td>
                    <td className="px-6 py-4">{entry.night_count}</td>
                    <td className="px-6 py-4">{entry.total_attendance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
