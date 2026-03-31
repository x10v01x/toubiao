import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, FileCode, Download, ExternalLink, Calendar, CheckCircle2, AlertCircle, MoreVertical, ShieldCheck, Activity, ArrowUpRight, X, Loader2, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

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

const MOCK_QUALIFICATIONS = [
  { title: "电子与智能化工程专业承包一级", code: "D2440123456789", expiry: "2026-12-31", status: "有效", type: "行业资质" },
  { title: "建筑机电安装工程专业承包一级", code: "D2440987654321", expiry: "2025-06-15", status: "有效", type: "行业资质" },
  { title: "信息系统建设和服务能力等级CS4", code: "CS4-2022-001", expiry: "2024-05-20", status: "即将过期", type: "体系认证" },
  { title: "ISO9001 质量管理体系认证", code: "ISO-9001-2023", expiry: "2027-01-10", status: "有效", type: "体系认证" },
  { title: "高新技术企业证书", code: "GR202344001234", expiry: "2026-11-05", status: "有效", type: "荣誉证书" },
  { title: "广东省守合同重信用企业", code: "SH-2023-GD-001", expiry: "2024-12-31", status: "有效", type: "荣誉证书" },
];

export const QualificationLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('全部资质');
  const [isChecking, setIsChecking] = useState(false);
  const [complianceReport, setComplianceReport] = useState<string | null>(null);

  const handleComplianceCheck = async () => {
    setIsChecking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `你是一个专业的企业合规专家。请分析以下企业资质数据，识别即将过期的风险，并提供续期建议和合规性改进方案。
      资质数据: ${JSON.stringify(MOCK_QUALIFICATIONS)}
      
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

  const filteredQualifications = useMemo(() => {
    return MOCK_QUALIFICATIONS.filter(q => {
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
  }, [searchTerm, activeTab]);

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
          <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
            <Plus size={14} />
            新增资质
          </button>
        </div>
      </div>

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
            <div className="text-2xl font-bold text-slate-900 font-mono tracking-tighter">24</div>
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">有效条目</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex items-center gap-4 group hover:border-rose-500 transition-colors">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tracking-tighter">02</div>
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">即将过期</div>
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">合规状态</div>
            <div className="text-lg font-bold tracking-tight">系统完整性: 100%</div>
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
      </div>
    </div>
  );
};
