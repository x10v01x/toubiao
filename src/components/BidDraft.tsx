import React, { useState } from 'react';
import { ChevronRight, FileCode, Download, ExternalLink, AlertCircle, Check, Save, RotateCcw, Zap, FileText, Layout, MessageSquare, Settings, Activity, Search, Share2, Printer, MoreVertical, X, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface BidDraftProps {
  onNext: (view: string) => void;
}

const CHAPTERS = [
  { id: '1', title: '第一章 投标函及声明', status: 'complete', content: '此处为投标函及声明的详细内容。包含投标函、法定代表人授权委托书、投标保证金缴纳证明等。' },
  { id: '2', title: '第二章 法定代表人身份证明', status: 'complete', content: '此处为法定代表人身份证明文件。包含营业执照副本、法定代表人身份证复印件等。' },
  { id: '3', title: '第三章 商务部分', status: 'complete', content: '此处为商务标部分。包含投标报价表、工程量清单、商务偏离表等核心商务数据。' },
  { id: '4', title: '第四章 技术部分', status: 'active', content: '', subChapters: [
    { id: '4.1', title: '4.1 项目背景与理解', status: 'active-sub', content: '随着城市化进程的加速，XX 市作为区域核心增长极，面临着日益增长的基础设施管理压力。本项目旨在通过引入先进的物联网、大数据及人工智能技术，构建一套覆盖全市的智慧城市基础设施监控与管理体系。' },
    { id: '4.2', title: '4.2 总体设计方案', status: 'pending', content: '本方案采用分层架构设计，包括感知层、网络层、平台层和应用层。感知层负责数据采集，网络层负责传输，平台层负责处理，应用层负责业务展示。' },
    { id: '4.3', title: '4.3 施工组织设计', status: 'pending', content: '施工组织设计包括施工进度计划、人员配备、设备进场计划、安全文明施工措施等。' },
    { id: '4.4', title: '4.4 质量保证措施', status: 'pending', content: '质量保证措施包括质量管理体系、质量控制点、质量验收标准及售后服务承诺。' }
  ]},
  { id: '5', title: '第五章 服务部分', status: 'pending', content: '此处为服务部分。包含售后服务方案、技术培训计划、应急响应机制等。' },
  { id: '6', title: '第六章 附件', status: 'pending', content: '此处为附件部分。包含相关资质复印件、业绩证明材料、其他补充说明文件等。' }
];

export const BidDraft = ({ onNext }: BidDraftProps) => {
  const [activeChapterId, setActiveChapterId] = useState('4.1');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});

  const activeChapter = CHAPTERS.flatMap(c => c.subChapters ? [c, ...c.subChapters] : [c]).find(c => c.id === activeChapterId);

  const handleGenerate = async () => {
    if (!activeChapter) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `你是一位资深的投标书编写专家。请为招标项目“XX市智慧城市基础设施监控管理系统”编写标书中的“${activeChapter.title}”章节。
        要求：
        1. 语言专业、严谨。
        2. 结合智慧城市、物联网、大数据等前沿技术。
        3. 篇幅适中，约300-500字。
        4. 使用 Markdown 格式。
        5. 仅返回章节正文内容。`,
      });

      const text = response.text;
      if (text) {
        setGeneratedContent(prev => ({
          ...prev,
          [activeChapterId]: text
        }));
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("AI 生成失败，请稍后重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentContent = generatedContent[activeChapterId] || activeChapter?.content;

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 border border-slate-200 bg-white shadow-2xl overflow-hidden font-sans">
      {/* Left Rail: Navigation */}
      <div className="w-20 bg-slate-900 flex flex-col items-center py-8 gap-8 shrink-0">
        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 active:scale-95 transition-transform cursor-pointer">
          <Zap size={24} />
        </div>
        <div className="flex flex-col gap-6 mt-4">
          {[Layout, FileText, MessageSquare, Settings].map((Icon, i) => (
            <button key={i} className={`p-4 rounded-xl transition-all hover:bg-slate-800 group relative ${i === 1 ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon size={22} />
              {i === 1 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500 rounded-l-full" />}
            </button>
          ))}
        </div>
        <div className="mt-auto pb-8">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
            JD
          </div>
        </div>
      </div>

      {/* Sidebar: Chapter Navigation */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-200 space-y-1">
          <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">文档结构</h3>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">标书章节导航</h2>
        </div>
        <div className="p-4 border-b border-slate-200 bg-white/50">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索章节..." 
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {CHAPTERS.map((chapter) => (
            <React.Fragment key={chapter.id}>
              <button 
                onClick={() => !chapter.subChapters && setActiveChapterId(chapter.id)}
                className={`w-full text-left px-4 py-3 text-xs font-bold transition-all flex items-center justify-between group rounded-lg
                  ${activeChapterId === chapter.id ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' : 
                    chapter.status === 'active' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <span className="truncate tracking-tight">{chapter.title}</span>
                {chapter.status === 'complete' && <Check size={14} className="text-emerald-500 shrink-0" />}
                {chapter.status === 'active' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
              </button>
              {chapter.subChapters && chapter.subChapters.map(sub => (
                <button 
                  key={sub.id}
                  onClick={() => setActiveChapterId(sub.id)}
                  className={`w-full text-left px-8 py-2.5 text-xs font-bold transition-all flex items-center justify-between group rounded-lg
                    ${activeChapterId === sub.id ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <span className="truncate tracking-tight">{sub.title}</span>
                  {sub.status === 'active-sub' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-slate-100/30 relative">
        {/* Editor Toolbar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">
              <Activity size={14} className="text-emerald-500" />
              AI 编写引擎 / v1.0.4
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-sm font-bold text-slate-900 tracking-tight">{activeChapter?.title}</div>
          </div>
          <div className="flex items-center gap-1">
            {[Save, Download, Share2, Printer, MoreVertical].map((Icon, i) => (
              <button key={i} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-lg">
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-16 scrollbar-hide">
          <div className="max-w-[850px] mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-200 p-20 min-h-[1100px] relative group">
            {/* AI Annotation Overlay */}
            {activeChapterId === '4.1' && (
              <div className="absolute -right-72 top-48 w-64 space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-8 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-amber-50 border border-amber-200 p-6 shadow-2xl rounded-xl border-l-4 border-l-amber-500 relative">
                  <div className="absolute -left-2 top-6 w-4 h-4 bg-amber-50 border-l border-t border-amber-200 rotate-[-45deg]" />
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-600 uppercase mb-3 tracking-widest">
                    <AlertCircle size={14} />
                    AI 智能建议
                  </div>
                  <p className="text-xs text-amber-900 font-bold leading-relaxed">
                    建议在此处引用 2023 年 XX 市智慧城市白皮书中的核心数据，以增强技术方案的说服力。
                  </p>
                  <button className="mt-4 text-[10px] font-mono font-bold text-amber-700 hover:text-amber-900 uppercase tracking-widest flex items-center gap-1 group/btn">
                    应用参考资料
                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-16 font-serif text-slate-900">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tighter text-slate-900">
                  {activeChapterId.startsWith('4') ? '第四章 技术部分' : activeChapter?.title.split(' ')[0]}
                </h2>
                <div className="h-1.5 w-16 bg-slate-900 mx-auto" />
              </div>

              <div className="space-y-10">
                <h3 className="text-2xl font-bold border-b-2 border-slate-900 pb-4 tracking-tight">{activeChapter?.title}</h3>
                
                <div className="space-y-8 leading-relaxed text-[16px] text-slate-800">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                      <Loader2 size={48} className="text-emerald-500 animate-spin" />
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">AI 正在深度创作中...</div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">
                      {currentContent || '内容生成中...'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="h-20 bg-white border-t border-slate-200 px-10 flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">自动保存中</span>
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">
              字数: {activeChapterId === '4.1' ? '1,240' : '450'} / 页数: {activeChapterId === '4.1' ? '12' : '2'}
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`px-8 py-3 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-600 transition-all flex items-center gap-2 active:scale-95 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:border-slate-900 hover:text-slate-900'}`}
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
              {generatedContent[activeChapterId] ? '重新生成' : 'AI 智能编写'}
            </button>
            <button 
              onClick={() => onNext('package')}
              className="px-10 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-2 active:scale-95"
            >
              完成初稿
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
