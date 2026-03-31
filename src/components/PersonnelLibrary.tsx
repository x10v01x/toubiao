import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, UserPlus, Mail, Phone, Award, FileCheck, ChevronRight, ArrowUpRight, Activity, ShieldCheck, Users, X, Loader2, Zap, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useFirebase, OperationType, handleFirestoreError } from './FirebaseProvider';

export const PersonnelLibrary = () => {
  const { user, isAdmin } = useFirebase();
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('全部人员');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPerson, setNewPerson] = useState({ 
    name: '', 
    role: '', 
    department: '工程部', 
    experience: '', 
    email: '', 
    phone: '',
    certificates: '' 
  });

  useEffect(() => {
    if (!user) return;

    const path = 'personnel';
    const q = isAdmin 
      ? query(collection(db, path), orderBy('createdAt', 'desc'))
      : query(collection(db, path), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPersonnel(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleAIMatch = async () => {
    setIsMatching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `你是一个资深的人力资源专家和项目总监。请分析以下公司的人才库数据，并根据当前常见的“智慧城市”和“系统集成”类大型投标项目，推荐最合适的项目团队组合。
      人才数据: ${JSON.stringify(personnel)}
      
      请按以下格式回答：
      1. 推荐团队：列出推荐的人员姓名及其在项目中的职责。
      2. 推荐理由：简述为什么这组人员是最佳拍档。
      3. 团队优势：总结该团队在投标中的核心竞争力（如证书、经验等）。
      
      回答要专业、简洁，使用中文。`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setMatchResult(response.text || "匹配失败。");
    } catch (error) {
      console.error("AI Match Error:", error);
      setMatchResult("AI 匹配引擎暂时不可用。");
    } finally {
      setIsMatching(false);
    }
  };

  const handleAdd = async () => {
    if (!user || !newPerson.name) return;
    setIsAdding(true);
    const path = 'personnel';
    try {
      await addDoc(collection(db, path), {
        ...newPerson,
        certificates: newPerson.certificates.split(',').map(s => s.trim()).filter(s => s),
        status: '在岗',
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setShowAddModal(false);
      setNewPerson({ 
        name: '', 
        role: '', 
        department: '工程部', 
        experience: '', 
        email: '', 
        phone: '',
        certificates: '' 
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const filteredPersonnel = useMemo(() => {
    return personnel.filter(person => {
      const matchesSearch = 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.certificates && person.certificates.some((cert: string) => cert.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesTab = activeTab === '全部人员' || person.department === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [personnel, searchTerm, activeTab]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Users size={12} className="text-blue-500" />
            人力资本 / 工程专家库
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">人员人才库</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">管理公司核心技术人员、建造师及专家资源</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAIMatch}
            disabled={isMatching}
            className="px-6 py-2.5 bg-white border border-slate-900 text-slate-900 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 active:scale-95 shadow-xl"
          >
            {isMatching ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isMatching ? '正在智能匹配...' : 'AI 团队组建'}
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input
              type="text"
              placeholder="搜索人才库..."
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
            <UserPlus size={14} />
            专家入库
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">专家入库登记</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">姓名</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">职位</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newPerson.role}
                    onChange={(e) => setNewPerson({...newPerson, role: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">所属部门</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none"
                    value={newPerson.department}
                    onChange={(e) => setNewPerson({...newPerson, department: e.target.value})}
                  >
                    <option>工程部</option>
                    <option>商务部</option>
                    <option>技术部</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">从业经验</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    placeholder="例如：10年"
                    value={newPerson.experience}
                    onChange={(e) => setNewPerson({...newPerson, experience: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">持有证书 (逗号分隔)</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  placeholder="例如：一级建造师, 高级工程师"
                  value={newPerson.certificates}
                  onChange={(e) => setNewPerson({...newPerson, certificates: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">邮箱</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newPerson.email}
                    onChange={(e) => setNewPerson({...newPerson, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">电话</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    value={newPerson.phone}
                    onChange={(e) => setNewPerson({...newPerson, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={handleAdd}
              disabled={isAdding || !newPerson.name}
              className="w-full py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {isAdding ? '正在入库...' : '确认入库'}
            </button>
          </div>
        </div>
      )}

      {matchResult && (
        <div className="bg-indigo-50 border border-indigo-100 p-8 space-y-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => setMatchResult(null)}
            className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">AI 智能团队推荐</h3>
          </div>
          <div className="text-sm text-indigo-800 leading-relaxed font-serif italic whitespace-pre-wrap">
            {matchResult}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors shadow-sm">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">活跃专家</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">{personnel.length}</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 uppercase">
            <ShieldCheck size={12} />
            全员持证
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors shadow-sm">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">证书总数</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">
            {personnel.reduce((acc, p) => acc + (p.certificates?.length || 0), 0)}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
            人均 {(personnel.reduce((acc, p) => acc + (p.certificates?.length || 0), 0) / (personnel.length || 1)).toFixed(1)} 项证书
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative shadow-xl">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">资源分配</div>
            <div className="text-lg font-bold tracking-tight">项目部署率: 84%</div>
          </div>
          <Activity size={100} className="text-blue-500/20 absolute -right-4 -bottom-4" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-8 border-b border-slate-200 pb-4">
          {['全部人员', '工程部', '商务部', '技术部'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-mono font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-slate-900"></div>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-slate-400" size={40} />
            <p className="text-sm font-mono text-slate-400 uppercase tracking-widest">正在加载人才库...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((person) => (
                <div key={person.id} className="bg-white border border-slate-200 p-6 flex flex-col hover:border-slate-900 hover:shadow-2xl transition-all group relative overflow-hidden shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                        <FileCheck size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{person.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{person.role}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{person.department}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border ${
                      person.status === '在岗' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {person.status}
                    </span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {person.certificates && person.certificates.map((cert: string, idx: number) => (
                        <span key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-tighter">
                          <Award size={10} className="text-slate-400" />
                          {cert}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
                        <Mail size={12} className="text-slate-300" />
                        {person.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
                        <Phone size={12} className="text-slate-300" />
                        {person.phone}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      从业经验: <span className="text-slate-900">{person.experience}</span>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                  
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                    <Users size={80} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-32 text-center space-y-4 bg-slate-50/50 border border-dashed border-slate-200">
                <div className="text-slate-200 flex justify-center">
                  <Users size={64} strokeWidth={1} />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">未找到匹配的人员</div>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveTab('全部人员'); }}
                  className="text-[10px] font-mono font-bold text-blue-600 uppercase hover:underline"
                >
                  重置所有搜索条件
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
