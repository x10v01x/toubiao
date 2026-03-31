import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Book, Download, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Activity, ArrowUpRight, FileText, Bookmark, X } from 'lucide-react';

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

const MOCK_STANDARDS = [
  { title: "智能建筑设计标准", code: "GB 50314-2015", category: "国家标准", date: "2015-11-01", status: "现行" },
  { title: "综合布线系统工程设计规范", code: "GB 50311-2016", category: "国家标准", date: "2016-08-26", status: "现行" },
  { title: "安全防范工程技术标准", code: "GB 50348-2018", category: "国家标准", date: "2018-05-14", status: "现行" },
  { title: "智慧城市 建筑及居住区第1部分", code: "GB/T 35117.1-2017", category: "国家标准", date: "2017-12-29", status: "现行" },
  { title: "建筑机电工程抗震设计规范", code: "GB 50981-2014", category: "国家标准", date: "2014-10-09", status: "现行" },
  { title: "数据中心设计规范", code: "GB 50174-2017", category: "国家标准", date: "2017-05-04", status: "现行" },
];

export const StandardsLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('全部标准');

  const filteredStandards = useMemo(() => {
    return MOCK_STANDARDS.filter(s => {
      const matchesSearch = 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === '全部标准' || s.category === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

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
          <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
            <Plus size={14} />
            上传新标准
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors shadow-sm">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">收录标准</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">856</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 uppercase">
            <Activity size={12} />
            本月新增 12 项
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
      </div>
    </div>
  );
};
