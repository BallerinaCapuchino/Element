import React, { useEffect, useState } from 'react';
import { mockApi } from '../utils/api';
import { VisitorLog } from '../types';
import { useNavigate } from 'react-router-dom';
import { Globe, Clock, ArrowLeft } from 'lucide-react';

const SecretAdmin = () => {
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisitors = async () => {
        const data = await mockApi.getRecentVisitors();
        setVisitors(data);
    };
    fetchVisitors();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
        <header className="flex justify-between items-center mb-8 border-b border-green-900 pb-4">
            <h1 className="text-xl tracking-widest uppercase">Network Monitor</h1>
            <button onClick={() => navigate('/')} className="hover:text-white"><ArrowLeft /></button>
        </header>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead>
                    <tr className="text-green-800 uppercase border-b border-green-900">
                        <th className="py-2">Timestamp</th>
                        <th className="py-2">IP Address</th>
                        <th className="py-2">User Agent</th>
                    </tr>
                </thead>
                <tbody>
                    {visitors.map(v => (
                        <tr key={v.id} className="border-b border-green-900/30 hover:bg-green-900/10">
                            <td className="py-2 pr-4 text-green-700 whitespace-nowrap">
                                {new Date(v.timestamp).toLocaleString()}
                            </td>
                            <td className="py-2 pr-4 text-white font-bold">
                                {v.ip}
                            </td>
                            <td className="py-2 opacity-70 truncate max-w-xs">
                                {v.userAgent}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {visitors.length === 0 && (
            <div className="text-center mt-12 opacity-50">No activity logs found</div>
        )}
    </div>
  );
};

export default SecretAdmin;
