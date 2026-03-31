import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, FileCode, Download, ExternalLink, Calendar, CheckCircle2, AlertCircle, MoreVertical, ShieldCheck, Activity, ArrowUpRight, X, Loader2, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useFirebase, OperationType, handleFirestoreError } from './FirebaseProvider';

const QualificationCard = ({ title, code, expiry, status, type }: any) => (
  <div className="bg-white border border-slate-200 p-6 flex flex-col hover:border-slate-900 hover:shadow-2xl transition-all group relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
        <FileCode size={24} />
      </div>
      <div className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border ${
        status === '有效' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
      }`}>
        {status}
      </div>
    </div>
    
    <div className="flex-1 space-y-2">
      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">{type}</div>
      <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{title}</h3>
      <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{code}</div>
    </div>
    
    <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
        <Calendar size={12} />
        EXP: {expiry}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"><Download size={14} /></button>
        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"><ExternalLink size={14} /></button>
      </div>
    </div>
    
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
      <FileCode size={80} />
    </div>
  </div>
);

// Removed MOCK_QUALIFICATIONS

export const QualificationLibrary = () => {
  const { user, isAdmin } = useFirebase();
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('全部资质');
  const [isChecking, setIsChecking] = useState(false);
  const [complianceReport, setComplianceReport] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newQual, setNewQual] = useState({ title: '', code: '', expiry: '', type: '行业资质' });

  useEffect(() => {
    if (!user) return;

    const path = 'qualifications';
    const q = isAdmin 
      ? query(collection(db, path), orderBy('createdAt', 'desc'))
      : query(collection(db, path), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQualifications(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleComplianceCheck = async () => {
    setIsChecking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `你是一个专业的企业合规专家。请分析以下企业资质数据，识别即将过期的风险，并提供续期建议和合规性改进方案。
      资质数据: ${JSON.stringify(qualifications)}
      
      请按以下格式回答：
      1. 紧急风险预警：列出 6 个月内过期的资质。
      2. 续期行动建议：针对即将过期的资质，说明续期流程或所需材料。
      3. 体系完善建议：建议企业还可以补充哪些行业主流资质（如 CMMI, ITSS 等）以提升竞争力。
      
      回答要专业、简洁，使用中文。`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setComplianceReport(response.text || "分析失败。");
    } catch (error) {
      console.error("AI Compliance Error:", error);
      setComplianceReport("AI 合规引擎暂时不可用。");
    } finally {
      setIsChecking(false);
    }
  };

  const handleAdd = async () => {
    if (!user || !newQual.title) return;
    setIsAdding(true);
    const path = 'qualifications';
    try {
      await addDoc(collection(db, path), {
        ...newQual,
        status: '有效',
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setShowAddModal(false);
      setNewQual({ title: '', code: '', expiry: '', type: '行业资质' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const filteredQualifications = useMemo(() => {
    return qualifications.filter(q => {
      const matchesSearch = 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const tabTypeMap: Record<string, string> = {
        '全部资质': '全部',
        '行业资质': '行业资质',
        '体系认证': '体系认证',
        '荣誉证书': '荣誉证书',
        '其他备案': '其他备案'
      };
      
      const finalMatchesTab = activeTab === '全部资质' || q.type === tabTypeMap[activeTab];

      return matchesSearch && finalMatchesTab;
    });
  }, [qualifications, searchTerm, activeTab]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            资质注册中心 / 运行中
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">企业资质库</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">集中管理企业各类营业执照、行业资质、体系认证与荣誉证书</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleComplianceCheck}
            disabled={isChecking}
            className="px-6 py-2.5 bg-white border border-slate-900 text-slate-900 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 active:scale-95 shadow-xl"
          >
            {isChecking ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {isChecking ? '正在合规检查...' : 'AI 合规体检'}
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索资质库..." 
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
            新增资质
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">新增企业资质</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">资质名称</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  placeholder="例如：电子与智能化工程专业承包一级"
                  value={newQual.title}
                  onChange={(e) => setNewQual({...newQual, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">证书编号</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  placeholder="例如：D2440123456789"
                  value={newQual.code}
                  onChange={(e) => setNewQual({...newQual, code: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">有效期至</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newQual.expiry}
                    onChange={(e) => setNewQual({...newQual, expiry: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">资质类型</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none"
                    value={newQual.type}
                    onChange={(e) => setNewQual({...newQual, type: e.target.value})}
                  >
                    <option>行业资质</option>
                    <option>体系认证</option>
                    <option>荣誉证书</option>
                    <option>其他备案</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              onClick={handleAdd}
              disabled={isAdding || !newQual.title}
              className="w-full py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {isAdding ? '正在保存...' : '确认添加'}
            </button>
          </div>
        </div>
      )}

      {complianceReport && (
        <div className="bg-emerald-50 border border-emerald-100 p-8 space-y-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => setComplianceReport(null)}
            className="absolute top-4 right-4 text-emerald-400 hover:text-emerald-600 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-widest">AI 合规诊断报告</h3>
          </div>
          <div className="text-sm text-emerald-800 leading-relaxed font-serif italic prose prose-emerald max-w-none">
            <ReactMarkdown>{complianceReport}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex items-center gap-4 group hover:border-emerald-500 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tracking-tighter">
              {qualifications.filter(q => q.status === '有效').length}
            </div>
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">有效条目</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex items-center gap-4 group hover:border-rose-500 transition-colors">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tracking-tighter">
              {qualifications.filter(q => q.status === '即将过期').length}
            </div>
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">即将过期</div>
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">合规状态</div>
            <div className="text-lg font-bold tracking-tight">系统完整性: {qualifications.length > 0 ? '100%' : '0%'}</div>
          </div>
          <Activity size={100} className="text-emerald-500/20 absolute -right-4 -bottom-4" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-8 border-b border-slate-200">
          {['全部资质', '行业资质', '体系认证', '荣誉证书', '其他备案'].map((tab, i) => (
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
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-slate-400" size={40} />
            <p className="text-sm font-mono text-slate-400 uppercase tracking-widest">正在加载资质库...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {filteredQualifications.length > 0 ? (
              filteredQualifications.map((q, i) => (
                <QualificationCard 
                  key={i}
                  title={q.title} 
                  code={q.code} 
                  expiry={q.expiry} 
                  status={q.status} 
                  type={q.type}
                />
              ))
            ) : (
              <div className="col-span-3 py-20 text-center space-y-4">
                <div className="text-slate-300 flex justify-center">
                  <Search size={48} strokeWidth={1} />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">未找到匹配的资质</div>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveTab('全部资质'); }}
                  className="text-[10px] font-mono font-bold text-blue-600 uppercase hover:underline"
                >
                  清除所有过滤条件
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
