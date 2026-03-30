import React, { useState, useMemo } from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle, Download, Eye, MoreVertical, Plus, ShieldCheck, Zap, Activity, ChevronRight, FileCheck, Package, Search, Filter, ArrowUpDown, Trash2, X, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface BidDocument {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  lastModified: string;
  progress: number;
  type: string;
  size: string;
  category: '商务' | '技术' | '资质' | '附件';
}

const MOCK_DOCUMENTS: BidDocument[] = [
  {
    id: '1',
    name: '第一部分：商务标',
    status: 'completed',
    lastModified: '2026-03-29 14:20',
    progress: 100,
    type: '商务部分',
    size: '2.4 MB',
    category: '商务'
  },
  {
    id: '2',
    name: '第二部分：技术标',
    status: 'in-progress',
    lastModified: '2026-03-30 09:15',
    progress: 75,
    type: '技术部分',
    size: '12.8 MB',
    category: '技术'
  },
  {
    id: '3',
    name: '第三部分：资信证明',
    status: 'completed',
    lastModified: '2026-03-28 16:45',
    progress: 100,
    type: '资质部分',
    size: '5.1 MB',
    category: '资质'
  },
  {
    id: '4',
    name: '附件：施工组织设计图纸',
    status: 'pending',
    lastModified: '-',
    progress: 0,
    type: '附件部分',
    size: '0 KB',
    category: '附件'
  },
];

interface BidPackageProps {
  onNext: (view: string) => void;
}

export const BidPackage = ({ onNext }: BidPackageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'全部' | '商务' | '技术' | '资质' | '附件'>('全部');
  const [sortField, setSortField] = useState<'name' | 'size' | 'progress'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isChecking, setIsChecking] = useState(false);
  const [checkReport, setCheckReport] = useState<string | null>(null);

  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS
      .filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === '全部' || doc.category === activeCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'name') comparison = a.name.localeCompare(b.name);
        if (sortField === 'size') {
          const sizeA = parseFloat(a.size) || 0;
          const sizeB = parseFloat(b.size) || 0;
          comparison = sizeA - sizeB;
        }
        if (sortField === 'progress') comparison = a.progress - b.progress;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [searchTerm, activeCategory, sortField, sortOrder]);

  const toggleSort = (field: 'name' | 'size' | 'progress') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleIntegrityCheck = async () => {
    setIsChecking(true);
    setCheckReport(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `你是一个专业的标书合规性审查专家。请对当前的标书文件包进行“完整性与合规性”扫描。
        当前文件列表：
        ${MOCK_DOCUMENTS.map(d => `- ${d.name} (${d.status}, 进度: ${d.progress}%)`).join('\n')}
        
        请输出一份简短的审查报告，包含：
        1. 缺失项提醒（如果有）。
        2. 关键风险点（如进度滞后、文件缺失）。
        3. 改进建议。
        
        要求：语言专业、简洁，使用中文。`,
      });

      setCheckReport(response.text || "未能生成报告。");
    } catch (error) {
      console.error("Integrity Check Error:", error);
      setCheckReport("AI 校验失败，请检查网络连接。");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 font-sans">
      {/* Integrity Check Report Modal */}
      {checkReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-500" size={20} />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI 完整性校验报告</h3>
              </div>
              <button onClick={() => setCheckReport(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate prose-sm max-w-none whitespace-pre-wrap font-serif italic text-slate-700 leading-relaxed">
                {checkReport}
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setCheckReport(null)}
                className="px-8 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl"
              >
                确认并关闭
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Package size={12} className="text-blue-500" />
            文件组装引擎 / 活跃
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">标书文件包管理</h1>
          <p className="text-sm text-slate-500 italic font-serif">管理本项目所有投标组成文件，确保完整性、一致性与合规性</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleIntegrityCheck}
            disabled={isChecking}
            className={`px-6 py-3 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-600 transition-all flex items-center gap-2 active:scale-95 ${isChecking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:border-slate-900 hover:text-slate-900'}`}
          >
            {isChecking ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            {isChecking ? '正在校验中...' : '完整性校验'}
          </button>
          <button 
            onClick={() => onNext('final')}
            className="px-8 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-2 active:scale-95"
          >
            <Zap size={14} />
            生成最终投标文件
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-8">
          <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索文件..." 
                  className="pl-9 pr-8 py-2 bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900 transition-colors w-64"
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
              <div className="flex items-center gap-2">
                {['全部', '商务', '技术', '资质', '附件'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all rounded
                      ${activeCategory === cat ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleSort('name')}
                className={`flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${sortField === 'name' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
              >
                <ArrowUpDown size={14} />
                排序
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden group hover:border-slate-900 transition-colors">
            <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-200">
              <div className="col-span-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">文件名称</div>
              <div className="col-span-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">大小</div>
              <div className="col-span-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">编写进度</div>
              <div className="col-span-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] text-right">操作</div>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-slate-50/50 transition-all group/item">
                    <div className="col-span-6 flex items-center gap-5">
                      <div className={`w-12 h-12 flex items-center justify-center border transition-all group-hover/item:shadow-lg ${
                        doc.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                        doc.status === 'in-progress' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 tracking-tight group-hover/item:text-blue-600 transition-colors">{doc.name}</div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">{doc.type}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-xs font-mono font-bold text-slate-500">{doc.size}</div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${doc.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-900">{doc.progress}%</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end gap-1 opacity-0 group-hover/item:opacity-100 transition-all translate-x-2 group-hover/item:translate-x-0">
                      <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all shadow-sm"><Eye size={16} /></button>
                      <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all shadow-sm"><Download size={16} /></button>
                      <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Search size={32} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">未找到匹配的文件</p>
                      <p className="text-xs text-slate-400">请尝试调整搜索关键词或筛选条件</p>
                    </div>
                    <button 
                      onClick={() => { setSearchTerm(''); setActiveCategory('全部'); }}
                      className="mt-2 text-[10px] font-bold text-slate-900 uppercase tracking-widest underline underline-offset-4"
                    >
                      重置搜索
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button className="w-full py-10 border-2 border-dashed border-slate-200 text-slate-400 flex flex-col items-center justify-center gap-4 hover:border-slate-900 hover:text-slate-900 transition-all bg-slate-50/30 group active:scale-[0.99]">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-slate-900 transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">添加补充投标文件</span>
          </button>
        </div>

        <div className="col-span-4 space-y-10">
          <section className="bg-slate-900 p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Package size={160} />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em]">文件包状态</h3>
              <div className="text-3xl font-bold tracking-tighter leading-tight">准备生成最终稿</div>
            </div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">文件总数</span>
                <span className="text-sm font-mono font-bold">04</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">已完成</span>
                <span className="text-sm font-mono font-bold text-emerald-400">02</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">预计剩余时间</span>
                <span className="text-sm font-mono font-bold">2.5h</span>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle size={14} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">AI 智能预警</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic font-serif">
                技术标中“施工平面布置图”章节仍有 2 处 AI 标注需要人工确认，请在生成最终稿前完成核对。
              </p>
            </div>
          </section>

          <section className="bg-white border border-slate-200 p-10 space-y-8 shadow-sm group hover:border-slate-900 transition-colors">
            <div className="space-y-1">
              <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em]">合规性检查清单</h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Compliance Checklist</p>
            </div>
            <div className="space-y-5">
              {[
                { label: '公章/电子签章校验', status: 'pass' },
                { label: '投标有效期一致性', status: 'pass' },
                { label: '资质证书有效期', status: 'pass' },
                { label: '业绩证明文件完整性', status: 'warning' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group/item">
                  <span className="text-xs font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">{item.label}</span>
                  {item.status === 'pass' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-opacity">已通过</span>
                      <FileCheck size={18} className="text-emerald-500" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest">待处理</span>
                      <Activity size={18} className="text-amber-500 animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-100">
              <button className="w-full py-3 bg-slate-50 text-slate-600 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all active:scale-95">
                运行全量扫描
              </button>
            </div>
          </section>

          <section className="bg-slate-900 p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap size={16} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">准备就绪</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">生成投标文件</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-serif italic">
                所有文档已准备就绪，点击进入 AI 终审与分析阶段，确保万无一失。
              </p>
              <button 
                onClick={() => onNext('analysis')}
                className="w-full py-4 bg-white text-slate-900 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                进入终审分析
                <ArrowRight size={14} />
              </button>
            </div>
            <Activity size={150} className="absolute -right-10 -bottom-10 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all duration-700" />
          </section>
        </div>
      </div>
    </div>
  );
};
