import React, { useState, useEffect } from 'react';
import { Lock, Users, LayoutDashboard, LogOut, Package, CheckCircle, Clock } from 'lucide-react';
import { User, Order } from '../types';
import { mockApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAILS = ['admin@element.com']; // Замените на ваш email администратора

const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'users'>('dashboard');
  const [loadingData, setLoadingData] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Проверка прав доступа
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Если не авторизован, показываем заглушку или можно редиректить
        return; 
      }
      if (user.email && !ADMIN_EMAILS.includes(user.email)) {
        // Если авторизован, но не админ
        return;
      }
      // Если админ - грузим данные
      fetchData();
    }
  }, [user, isLoading]);

  const fetchData = async () => {
      setLoadingData(true);
      try {
          const [usersData, ordersData] = await Promise.all([
              mockApi.getAllUsers(),
              mockApi.getAllOrders()
          ]);
          setUsers(usersData);
          setOrders(ordersData);
      } catch (e) {
          console.error("Failed to fetch admin data", e);
      } finally {
          setLoadingData(false);
      }
  };

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
      await mockApi.updateOrderStatus(orderId, newStatus);
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Helper to get user name by ID
  const getUserName = (userId: string) => {
      const u = users.find(u => u.id === userId);
      return u ? u.name : 'Неизвестный';
  };

  const getUserEmail = (userId: string) => {
    const u = users.find(u => u.id === userId);
    return u ? u.email : '—';
  };

  // --- ACCESS CONTROL RENDER ---

  if (isLoading) {
    return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-500">Загрузка...</div>;
  }

  if (!user || (user.email && !ADMIN_EMAILS.includes(user.email))) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-10 bg-stone-900 border border-stone-800 shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-900/30">
                <Lock className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-serif text-stone-200 mb-2">Доступ запрещен</h1>
            <p className="text-stone-500 text-sm mb-6">У вас нет прав администратора.</p>
            <button 
                onClick={() => navigate('/')}
                className="text-amber-600 hover:text-amber-500 uppercase text-xs tracking-widest border-b border-amber-600/30 pb-1"
            >
                Вернуться на сайт
            </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD COMPONENTS ---

  const StatCard = ({ title, value, sub, icon: Icon }: any) => (
      <div className="bg-stone-900 border border-stone-800 p-6 flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
              <span className="text-stone-500 text-xs uppercase tracking-widest">{title}</span>
              <Icon className="text-stone-700 w-5 h-5" />
          </div>
          <div className="z-10">
              <h3 className="text-3xl font-serif text-stone-200">{value}</h3>
              <p className="text-xs text-amber-600 mt-1">{sub}</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-stone-800 opacity-20">
              <Icon size={100} />
          </div>
      </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
      const styles = {
          pending: 'bg-yellow-900/20 text-yellow-600 border-yellow-900/30',
          processing: 'bg-blue-900/20 text-blue-500 border-blue-900/30',
          completed: 'bg-green-900/20 text-green-500 border-green-900/30',
          cancelled: 'bg-red-900/20 text-red-500 border-red-900/30'
      };
      const labels = {
          pending: 'Обработка',
          processing: 'В работе',
          completed: 'Готов',
          cancelled: 'Отменен'
      };
      
      const s = status as keyof typeof styles;
      return (
          <span className={`px-2 py-1 text-[10px] uppercase tracking-wider border rounded-sm ${styles[s] || styles.pending}`}>
              {labels[s] || status}
          </span>
      );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col fixed h-full z-20">
            <div className="p-8 border-b border-stone-800">
                <div className="font-logo text-2xl text-amber-600">ELEMENT</div>
                <div className="text-[10px] text-stone-600 uppercase tracking-[0.3em] mt-1">Admin Panel</div>
                <div className="text-[10px] text-stone-500 mt-2 truncate">{user.email}</div>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-stone-800 text-amber-500 border-l-2 border-amber-500' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}`}
                >
                    <LayoutDashboard size={18} /> Обзор
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'orders' ? 'bg-stone-800 text-amber-500 border-l-2 border-amber-500' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}`}
                >
                    <Package size={18} /> Заказы
                    {orders.filter(o => o.status === 'pending').length > 0 && (
                        <span className="ml-auto bg-amber-600 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {orders.filter(o => o.status === 'pending').length}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'users' ? 'bg-stone-800 text-amber-500 border-l-2 border-amber-500' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}`}
                >
                    <Users size={18} /> Клиенты
                </button>
            </nav>

            <div className="p-4 border-t border-stone-800">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-200 transition-colors px-4">
                    <LogOut size={16} /> На сайт
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 md:p-12">
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="mb-8">
                        <h2 className="text-3xl font-serif text-stone-100">Обзор</h2>
                        <p className="text-stone-500 text-sm mt-2">Сводка по продажам и активности</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard 
                            title="Всего заказов" 
                            value={orders.length} 
                            sub={`${orders.filter(o => o.status === 'completed').length} завершено`} 
                            icon={Package} 
                        />
                        <StatCard 
                            title="База клиентов" 
                            value={users.length} 
                            sub={`${users.length - orders.map(o => o.userId).filter((v, i, a) => a.indexOf(v) === i).length} без заказов`} 
                            icon={Users} 
                        />
                         <StatCard 
                            title="Конверсия" 
                            value={`${users.length > 0 ? Math.round((orders.map(o => o.userId).filter((v, i, a) => a.indexOf(v) === i).length / users.length) * 100) : 0}%`} 
                            sub="из регистрации в заказ" 
                            icon={CheckCircle} 
                        />
                    </div>

                    <div className="bg-stone-900 border border-stone-800 p-6">
                        <h3 className="text-lg font-serif text-stone-200 mb-6">Последние заявки</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-stone-400">
                                <thead className="text-xs uppercase text-stone-600 border-b border-stone-800">
                                    <tr>
                                        <th className="pb-3 pl-4">ID</th>
                                        <th className="pb-3">Клиент</th>
                                        <th className="pb-3">Статус</th>
                                        <th className="pb-3">Дата</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-800/50">
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order.id} className="hover:bg-stone-800/30">
                                            <td className="py-4 pl-4 font-mono text-amber-700">#{order.id.slice(-6)}</td>
                                            <td className="py-4 text-stone-300">{getUserName(order.userId)}</td>
                                            <td className="py-4"><StatusBadge status={order.status} /></td>
                                            <td className="py-4 text-xs opacity-60">{new Date(order.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setActiveTab('orders')} className="mt-4 text-xs text-amber-600 hover:text-amber-500 uppercase tracking-widest">Все заказы &rarr;</button>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="flex justify-between items-end">
                         <div>
                            <h2 className="text-3xl font-serif text-stone-100">Заказы</h2>
                            <p className="text-stone-500 text-sm mt-2">Управление заявками на производство</p>
                        </div>
                    </header>

                    <div className="bg-stone-900 border border-stone-800 overflow-hidden">
                        <table className="w-full text-left text-sm text-stone-400">
                            <thead className="bg-stone-950 text-xs uppercase text-stone-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Заказ</th>
                                    <th className="px-6 py-4">Клиент / Связь</th>
                                    <th className="px-6 py-4">Детали</th>
                                    <th className="px-6 py-4">Комментарий</th>
                                    <th className="px-6 py-4">Статус</th>
                                    <th className="px-6 py-4">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-amber-600 text-sm">#{order.id.slice(-6)}</div>
                                            <div className="text-xs text-stone-600 mt-1">{new Date(order.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-stone-200 font-medium">{getUserName(order.userId)}</div>
                                            <div className="text-xs text-stone-500 mt-1 flex flex-col gap-0.5">
                                                <span>Email: {getUserEmail(order.userId)}</span>
                                                <span className="text-amber-700">
                                                    Способ: {order.details.contactMethod} 
                                                    {order.details.contactEmail && ` (${order.details.contactEmail})`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-stone-300">{order.details.wood || '—'}</span>
                                                <span className="text-xs text-stone-500">{order.details.finish || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={order.details.comment}>
                                            {order.details.comment || <span className="text-stone-700 italic">Нет комментария</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group inline-block">
                                                <button className="text-xs uppercase tracking-wider text-stone-400 hover:text-stone-200 border border-stone-700 px-3 py-1 hover:bg-stone-800">
                                                    Изменить
                                                </button>
                                                <div className="absolute right-0 top-full mt-2 w-32 bg-stone-900 border border-stone-700 shadow-xl hidden group-hover:block z-50">
                                                    {['pending', 'processing', 'completed', 'cancelled'].map(status => (
                                                        <button 
                                                            key={status}
                                                            onClick={() => updateStatus(order.id, status as any)}
                                                            className="block w-full text-left px-4 py-2 text-xs text-stone-400 hover:text-amber-500 hover:bg-stone-800 uppercase"
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-stone-600">Нет активных заказов</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <header>
                        <h2 className="text-3xl font-serif text-stone-100">Клиенты</h2>
                        <p className="text-stone-500 text-sm mt-2">База зарегистрированных пользователей</p>
                    </header>

                    <div className="bg-stone-900 border border-stone-800 overflow-hidden">
                        <table className="w-full text-left text-sm text-stone-400">
                            <thead className="bg-stone-950 text-xs uppercase text-stone-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Имя</th>
                                    <th className="px-6 py-4">Email / ID</th>
                                    <th className="px-6 py-4">Заказов</th>
                                    <th className="px-6 py-4">Статус</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                {users.map(user => {
                                    const userOrders = orders.filter(o => o.userId === user.id);
                                    const hasOrders = userOrders.length > 0;
                                    
                                    return (
                                        <tr key={user.id} className="hover:bg-stone-800/30">
                                            <td className="px-6 py-4 text-stone-200 font-medium">{user.name}</td>
                                            <td className="px-6 py-4">
                                                <div>{user.email}</div>
                                                <div className="text-[10px] text-stone-600 font-mono mt-0.5">{user.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-mono ${hasOrders ? 'text-amber-600' : 'text-stone-600'}`}>
                                                    {userOrders.length}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {hasOrders ? (
                                                    <span className="flex items-center gap-2 text-xs text-green-500 uppercase tracking-widest">
                                                        <CheckCircle size={12} /> Клиент
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest opacity-50">
                                                        <Clock size={12} /> Лид
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    </div>
  );
};

export default Admin;
