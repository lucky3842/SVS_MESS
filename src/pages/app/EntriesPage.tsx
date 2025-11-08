import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyEntry } from '@/lib/types';

const mockEntries: DailyEntry[] = [
  { id: '1', date: new Date(2025, 4, 20), morningCount: 52, nightCount: 48, attendance: 100, items: [{id: 'r1', name: 'Rice', quantity: '10kg'}, {id: 'd1', name: 'Dal', quantity: '5kg'}] },
  { id: '2', date: new Date(2025, 4, 19), morningCount: 55, nightCount: 50, attendance: 105, items: [{id: 'r2', name: 'Rice', quantity: '12kg'}] },
  { id: '3', date: new Date(2025, 4, 18), morningCount: 48, nightCount: 45, attendance: 93, items: [] },
];

export default function EntriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Entries</CardTitle>
        <CardDescription>A log of all past daily records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Morning</th>
                <th scope="col" className="px-6 py-3">Night</th>
                <th scope="col" className="px-6 py-3">Attendance</th>
                <th scope="col" className="px-6 py-3">Items Used</th>
              </tr>
            </thead>
            <tbody>
              {mockEntries.map((entry) => (
                <tr key={entry.id} className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {entry.date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </th>
                  <td className="px-6 py-4">{entry.morningCount}</td>
                  <td className="px-6 py-4">{entry.nightCount}</td>
                  <td className="px-6 py-4">{entry.attendance}</td>
                  <td className="px-6 py-4">
                    {entry.items.length > 0 ? entry.items.map(it => `${it.name} (${it.quantity})`).join(', ') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
