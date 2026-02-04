import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../utils/api';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    const fetchOrders = async () => {
      const data = await mockApi.getUserOrders(user.id);
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
      logout();
      navigate('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-stone-800 pb-6">
          <div>
             <h1 className="font-serif text-4xl text-amber-500 mb-2">Личный кабинет</h1>
             <p className="text-stone-500 font-light flex items-center gap-2">
                <UserIcon size={16} /> {user.name} <span className="text-stone-700">|</span> {user.email}
             </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 border border-stone-800 hover:border-red-900/50 hover:text-red-500 transition-colors text-xs uppercase tracking-widest"
          >
            <LogOut size={14} /> Выйти
          </button>
        </div>

        <div className="grid gap-8">
            <h2 className="text-2xl font-serif text-stone-300 mb-4">История заказов</h2>
            
            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-amber-600" /></div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-800 rounded">
                    <Package className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                    <p className="text-stone-500">У вас пока нет активных заказов</p>
                    <button onClick={() => navigate('/')} className="mt-4 text-amber-600 hover:text-amber-500 text-sm">Перейти к заказу</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, idx) => (
                        <motion.div 
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-stone-900 border border-stone-800 p-6 hover:border-amber-900/30 transition-colors group"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-mono text-amber-600 text-sm">#{order.id}</span>
                                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border rounded ${
                                            order.status === 'completed' ? 'border-green-900 text-green-500' :
                                            order.status === 'pending' ? 'border-yellow-900/50 text-yellow-500' :
                                            'border-stone-700 text-stone-500'
                                        }`}>
                                            {order.status === 'pending' ? 'Обработка' : order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 flex items-center gap-2">
                                        <Clock size={12} /> {new Date(order.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-serif text-lg text-stone-200">{order.items}</p>
                                </div>
                            </div>
                            
                            {(order.details.comment || order.details.wood) && (
                                <div className="mt-4 pt-4 border-t border-stone-800/50 text-sm text-stone-400 font-light grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {order.details.comment && <p><span className="text-stone-600">Комментарий:</span> {order.details.comment}</p>}
                                   <div className="flex gap-4">
                                      {order.details.wood && <p><span className="text-stone-600">Дерево:</span> {order.details.wood}</p>}
                                      {order.details.varnish && <p><span className="text-stone-600">Лак:</span> Да</p>}
                                   </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;