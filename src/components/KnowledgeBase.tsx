import React, { useState } from 'react';
import { Award, Users, FileSearch, BookOpen, ChevronRight, ShieldCheck, Database, History, Search, ArrowUpRight, Activity, Zap, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface KnowledgeBaseProps {
  onViewChange: (view: string) => void;
}

export const KnowledgeBase = ({ onViewChange }: KnowledgeBaseProps) => {
  const [showQA, setShowQA] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const stats = [
    { label: '企业资质', count: 24, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', view: 'qualifications', trend: '+2' },
    { label: '人员人才', count: 156, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', view: 'personnel', trend: '+12' },
    { label: '历史业绩', count: 42, icon: FileSearch, color: 'text-amber-600', bg: 'bg-amber-50', view: 'performance', trend: '+5' },
    { label: '标准规范', count: 89, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', view: 'standards', trend: '+1' },
  ];

  const handleAsk = async () => {
    if (!question.trim() || isAsking) return;
    setIsAsking(true);
    setAnswer(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `你是一个专业的企业知识库助手。用户正在询问关于公司资产（资质、人员、业绩、标准）的问题。
        公司概况：
        - 资质：24项（包括电子与智能化一级等）
        - 人员：156名专业人员
        - 业绩：42项大型项目案例
        - 标准：89项行业规范
        
        用户问题：${question}
        
        请根据以上信息提供专业、准确的回答。如果信息不足，请委婉说明并建议联系相关部门。
        使用中文回答，保持简洁专业。`,
      });

      setAnswer(response.text || "未能生成回答。");
    } catch (error) {
      console.error("QA Error:", error);
      setAnswer("AI 响应失败，请重试。");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* AI QA Modal */}
      {showQA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#151619] w-full max-w-2xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <div className="flex items-center gap-3">
                <Zap className="text-emerald-500" size={20} />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-[0.3em]">智能知识库助手</h3>
              </div>
              <button onClick={() => { setShowQA(false); setAnswer(null); setQuestion(''); }} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[#0a0b0d]">
              {!answer && !isAsking && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <Database size={48} className="text-slate-700" />
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">请输入您想了解的企业资产问题</p>
                </div>
              )}
              
              {isAsking && (
                <div className="flex items-center gap-3 text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  <Loader2 size={14} className="animate-spin" />
                  正在检索企业资产库...
                </div>
              )}
              
              {answer && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-emerald-500/30"></div>
                    <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">AI 响应</span>
                  </div>
                  <div className="p-6 bg-slate-900/50 border-l-2 border-emerald-500 text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-wrap">
                    {answer}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="询问关于资质、人员或业绩的问题..." 
                  className="w-full bg-[#0a0b0d] border border-slate-800 text-white font-mono text-xs px-6 py-4 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  disabled={isAsking}
                />
                <button 
                  onClick={handleAsk}
                  disabled={isAsking || !question.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors disabled:opacity-30"
                >
                  {isAsking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Database size={12} className="text-blue-500" />
            企业资产库 / v2.4
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">企业知识库</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">集中管理投标所需的所有核心资产与合规数据</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="搜索资产..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => onViewChange(stat.view)}
            className="bg-white border border-slate-200 p-8 flex flex-col items-start hover:border-slate-900 hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={24} />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-slate-900 tracking-tighter font-mono">{stat.count}</div>
              <div className="text-[10px] font-bold text-emerald-600 font-mono">{stat.trend}</div>
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{stat.label}</div>
            <div className="mt-8 flex items-center text-[10px] font-bold text-slate-900 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
              管理资产 <ArrowUpRight size={12} className="ml-1" />
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white border border-slate-200 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">合规性监控</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">实时监控中</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest">
                <span className="text-slate-500">资质证书有效率</span>
                <span className="text-emerald-600">100% 有效</span>
              </div>
              <div className="h-1 w-full bg-slate-100">
                <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest">
                <span className="text-slate-500">人员证件合规率</span>
                <span className="text-amber-600">85% 合规</span>
              </div>
              <div className="h-1 w-full bg-slate-100">
                <div className="h-full bg-amber-500 w-[85%] shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
              </div>
              <p className="text-[10px] text-slate-400 italic">3 项证书即将于 30 天内过期，请及时更新。</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="text-slate-400" size={20} />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">操作日志</h3>
            </div>
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">查看全部</button>
          </div>
          <div className="space-y-6">
            {[
              { title: '更新了“一级建造师”证书扫描件', time: '2小时前', user: '张经理' },
              { title: '新增了“某市智慧城市”业绩合同', time: '昨天', user: '李助理' },
              { title: '同步了最新的“建筑工程施工规范”', time: '3天前', user: '系统' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 group cursor-default">
                <div className="w-1 h-1 bg-slate-200 rounded-full mt-2 group-hover:bg-slate-900 transition-colors"></div>
                <div>
                  <div className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-1">
                    {item.time} · {item.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-12 text-white relative overflow-hidden group">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap size={16} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">AI 知识引擎</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">智能知识库助手</h3>
            <p className="text-slate-400 text-sm leading-relaxed italic font-serif">
              "系统已自动解析并索引了 250+ 份历史标书与合同。您可以直接通过 AI 助手询问任何关于公司过往业绩或资质的问题。"
            </p>
            <button 
              onClick={() => setShowQA(true)}
              className="mt-4 px-8 py-3 bg-white text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95"
            >
              开始 AI 问答
            </button>
          </div>
          <div className="hidden lg:block opacity-20 group-hover:opacity-40 transition-opacity duration-700">
            <Activity size={200} className="text-emerald-500" />
          </div>
        </div>
        <Database className="absolute -right-20 -bottom-20 text-white/5" size={400} />
      </div>
    </div>
  );
};
