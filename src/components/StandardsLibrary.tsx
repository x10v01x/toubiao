import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, Book, Download, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Activity, ArrowUpRight, FileText, Bookmark, X, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useFirebase, OperationType, handleFirestoreError } from './FirebaseProvider';

const StandardCard = ({ title, code, category, date, status }: any) => (
  <div className="bg-white border border-slate-200 p-6 flex flex-col hover:border-slate-900 hover:shadow-2xl transition-all group relative overflow-hidden shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
        <Book size={24} />
      </div>
      <div className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border ${
        status === '现行' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
      }`}>
        {status}
      </div>
    </div>
    
    <div className="flex-1 space-y-2">
      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">{category}</div>
      <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{title}</h3>
      <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{code}</div>
    </div>
    
    <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
        <Calendar size={12} />
        发布日期: {date}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"><Download size={14} /></button>
        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"><Bookmark size={14} /></button>
      </div>
    </div>
    
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
      <Book size={80} />
    </div>
  </div>
);

export const StandardsLibrary = () => {
  const { user, isAdmin } = useFirebase();
  const [standards, setStandards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('全部标准');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newStandard, setNewStandard] = useState({ 
    title: '', 
    code: '', 
    category: '国家标准', 
    date: '', 
    status: '现行' 
  });

  useEffect(() => {
    if (!user) return;

    const path = 'standards';
    const q = isAdmin 
      ? query(collection(db, path), orderBy('createdAt', 'desc'))
      : query(collection(db, path), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStandards(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleAdd = async () => {
    if (!user || !newStandard.title) return;
    setIsAdding(true);
    const path = 'standards';
    try {
      await addDoc(collection(db, path), {
        ...newStandard,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setShowAddModal(false);
      setNewStandard({ 
        title: '', 
        code: '', 
        category: '国家标准', 
        date: '', 
        status: '现行' 
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const filteredStandards = useMemo(() => {
    return standards.filter(s => {
      const matchesSearch = 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === '全部标准' || s.category === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [standards, searchTerm, activeTab]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-purple-500" />
            行业标准库 / 实时更新
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">标准规范库</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">集成国家、行业及地方建筑工程施工规范与技术标准</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索标准编号或名称..." 
              className="pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2"
          >
            <Plus size={14} />
            上传新标准
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">上传标准规范</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">标准名称</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  value={newStandard.title}
                  onChange={(e) => setNewStandard({...newStandard, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">标准编号</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  placeholder="例如：GB 50314-2015"
                  value={newStandard.code}
                  onChange={(e) => setNewStandard({...newStandard, code: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">发布日期</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newStandard.date}
                    onChange={(e) => setNewStandard({...newStandard, date: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">标准状态</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none"
                    value={newStandard.status}
                    onChange={(e) => setNewStandard({...newStandard, status: e.target.value})}
                  >
                    <option>现行</option>
                    <option>废止</option>
                    <option>待发布</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">标准类别</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none"
                  value={newStandard.category}
                  onChange={(e) => setNewStandard({...newStandard, category: e.target.value})}
                >
                  <option>国家标准</option>
                  <option>行业标准</option>
                  <option>地方标准</option>
                  <option>企业标准</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleAdd}
              disabled={isAdding || !newStandard.title}
              className="w-full py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {isAdding ? '正在上传...' : '确认上传'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors shadow-sm">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">收录标准</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">{standards.length}</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 uppercase">
            <Activity size={12} />
            本月新增 {standards.filter(s => {
              const d = new Date(s.createdAt?.seconds * 1000);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length} 项
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors shadow-sm">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">强制性条文</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">2,450</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
            已建立 AI 索引
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative shadow-xl">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">智能合规引擎</div>
            <div className="text-lg font-bold tracking-tight">自动扫描标书技术偏离度</div>
          </div>
          <Activity size={100} className="text-purple-500/20 absolute -right-4 -bottom-4" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-8 border-b border-slate-200">
          {['全部标准', '国家标准', '行业标准', '地方标准', '企业标准'].map((tab, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-slate-400" size={40} />
            <p className="text-sm font-mono text-slate-400 uppercase tracking-widest">正在同步标准库...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {filteredStandards.length > 0 ? (
              filteredStandards.map((s, i) => (
                <StandardCard 
                  key={i}
                  title={s.title} 
                  code={s.code} 
                  category={s.category} 
                  date={s.date} 
                  status={s.status} 
                />
              ))
            ) : (
              <div className="col-span-3 py-32 text-center space-y-4 bg-slate-50/50 border border-dashed border-slate-200">
                <div className="text-slate-200 flex justify-center">
                  <Book size={64} strokeWidth={1} />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">未找到匹配的标准规范</div>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveTab('全部标准'); }}
                  className="text-[10px] font-mono font-bold text-blue-600 uppercase hover:underline"
                >
                  重置搜索
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
