import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, Building2, MapPin, Calendar, FileText, ExternalLink, ChevronRight, Download, ArrowUpRight, Activity, Database, X, Loader2, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useFirebase, OperationType, handleFirestoreError } from './FirebaseProvider';

const PerformanceRow = ({ title, agency, amount, date, location, type }: any) => (
  <tr className="border-b border-slate-100 hover:bg-slate-900 hover:text-white transition-all group cursor-pointer">
    <td className="px-6 py-5">
      <div className="font-bold text-sm leading-tight mb-1">{title}</div>
      <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100">
        <span className="flex items-center gap-1"><Building2 size={10} />{agency}</span>
        <span className="flex items-center gap-1"><MapPin size={10} />{location}</span>
      </div>
    </td>
    <td className="px-6 py-5">
      <span className="px-2 py-0.5 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-widest group-hover:border-white/20">
        {type}
      </span>
    </td>
    <td className="px-6 py-5">
      <div className="text-sm font-mono font-bold text-emerald-600 group-hover:text-emerald-400">{amount}</div>
    </td>
    <td className="px-6 py-5">
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 flex items-center gap-2">
        <Calendar size={12} />
        {date}
      </div>
    </td>
    <td className="px-6 py-5 text-right">
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-white/10 transition-colors"><FileText size={16} /></button>
        <button className="p-2 hover:bg-white/10 transition-colors"><Download size={16} /></button>
        <button className="p-2 hover:bg-white/10 transition-colors"><ArrowUpRight size={16} /></button>
      </div>
    </td>
  </tr>
);

export const PerformanceLibrary = () => {
  const { user, isAdmin } = useFirebase();
  const [performances, setPerformances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('全部业绩');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPerf, setNewPerf] = useState({ 
    title: '', 
    agency: '', 
    amount: '', 
    date: '', 
    location: '', 
    type: '智慧城市' 
  });

  useEffect(() => {
    if (!user) return;

    const path = 'performances';
    const q = isAdmin 
      ? query(collection(db, path), orderBy('createdAt', 'desc'))
      : query(collection(db, path), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPerformances(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `你是一个专业的市场分析师。请分析以下企业的历史业绩数据，总结企业的核心竞争优势，并识别出企业在哪些领域、地区或金额区间具有最强的投标竞争力。
      业绩数据: ${JSON.stringify(performances)}
      
      请按以下格式回答：
      1. 核心优势领域：总结企业最擅长的行业领域。
      2. 区域覆盖分析：分析企业的业务地域分布特点。
      3. 投标策略建议：建议企业在未来的投标中应重点关注哪类项目以获得更高胜算。
      
      回答要专业、简洁，使用中文。`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setSummary(response.text || "分析失败。");
    } catch (error) {
      console.error("AI Summary Error:", error);
      setSummary("AI 分析引擎暂时不可用。");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAdd = async () => {
    if (!user || !newPerf.title) return;
    setIsAdding(true);
    const path = 'performances';
    try {
      await addDoc(collection(db, path), {
        ...newPerf,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setShowAddModal(false);
      setNewPerf({ 
        title: '', 
        agency: '', 
        amount: '', 
        date: '', 
        location: '', 
        type: '智慧城市' 
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const filteredPerformances = useMemo(() => {
    return performances.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.agency.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === '全部业绩' || p.type === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [performances, searchTerm, activeTab]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Database size={12} className="text-blue-500" />
            业绩档案库 / 历史数据
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">历史业绩库</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">管理企业已完成的工程项目业绩，支持按金额、地区、行业多维检索</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="px-6 py-2.5 bg-white border border-slate-900 text-slate-900 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 active:scale-95 shadow-xl"
          >
            {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {isSummarizing ? '正在生成总结...' : 'AI 业绩画像'}
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目档案..." 
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
            录入新业绩
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">录入历史业绩</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">项目名称</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  value={newPerf.title}
                  onChange={(e) => setNewPerf({...newPerf, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">建设单位</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  value={newPerf.agency}
                  onChange={(e) => setNewPerf({...newPerf, agency: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">合同金额</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    placeholder="例如：1,000 万元"
                    value={newPerf.amount}
                    onChange={(e) => setNewPerf({...newPerf, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">竣工日期</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newPerf.date}
                    onChange={(e) => setNewPerf({...newPerf, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">项目地点</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newPerf.location}
                    onChange={(e) => setNewPerf({...newPerf, location: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">项目类别</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none"
                    value={newPerf.type}
                    onChange={(e) => setNewPerf({...newPerf, type: e.target.value})}
                  >
                    <option>智慧城市</option>
                    <option>系统集成</option>
                    <option>运维服务</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              onClick={handleAdd}
              disabled={isAdding || !newPerf.title}
              className="w-full py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {isAdding ? '正在录入...' : '确认录入'}
            </button>
          </div>
        </div>
      )}

      {summary && (
        <div className="bg-blue-50 border border-blue-100 p-8 space-y-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => setSummary(null)}
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <Activity size={16} />
            </div>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest">AI 业绩竞争力画像</h3>
          </div>
          <div className="text-sm text-blue-800 leading-relaxed font-serif italic whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">总合同额</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">
            ¥{(performances.reduce((acc, p) => {
              const amount = parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 0;
              return acc + amount;
            }, 0) / 100).toFixed(1)}B
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 uppercase">
            <ArrowUpRight size={12} />
            同比增长 12.5%
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">已完成项目</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">{performances.length}</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
            覆盖 {new Set(performances.map(p => p.location)).size} 个地区
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">市场渗透率</div>
            <div className="text-lg font-bold tracking-tight">优势领域：智慧城市集成</div>
          </div>
          <Activity size={100} className="text-blue-500/20 absolute -right-4 -bottom-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-8">
            {['全部业绩', '智慧城市', '系统集成', '运维服务'].map((tab, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-mono font-bold uppercase tracking-widest transition-colors relative pb-1 ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">
            <Filter size={14} />
            高级筛选
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-slate-400" size={40} />
            <p className="text-sm font-mono text-slate-400 uppercase tracking-widest">正在加载业绩档案...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">项目名称 / 建设单位</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">类别</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">合同金额</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">竣工日期</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPerformances.length > 0 ? (
                filteredPerformances.map((p, i) => (
                  <PerformanceRow 
                    key={i}
                    title={p.title} 
                    agency={p.agency} 
                    amount={p.amount} 
                    date={p.date} 
                    location={p.location}
                    type={p.type}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center space-y-4">
                    <div className="text-slate-300 flex justify-center">
                      <Search size={48} strokeWidth={1} />
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">未找到匹配的业绩</div>
                    <button 
                      onClick={() => { setSearchTerm(''); setActiveTab('全部业绩'); }}
                      className="text-[10px] font-mono font-bold text-blue-600 uppercase hover:underline"
                    >
                      清除所有过滤条件
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="px-6 py-6 border-t border-slate-200 bg-slate-50/30 flex justify-between items-center">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            显示 {filteredPerformances.length} 条记录，共 {performances.length} 条记录
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-300 uppercase cursor-not-allowed">上一页</button>
            <button className="px-3 py-1 bg-slate-900 border border-slate-900 text-[10px] font-mono font-bold text-white uppercase">01</button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase">02</button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase">03</button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};
