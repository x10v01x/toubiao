import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, AlertCircle, CheckCircle2, FileText, Activity, ChevronRight, ArrowRight, Download, Share2, Printer, MoreVertical, Search, Filter, ArrowUpDown, Loader2, X } from 'lucide-react';
import { motion } from 'motion/react';

interface BidAnalysisProps {
  onNext: (view: string) => void;
}

export const BidAnalysis = ({ onNext }: BidAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleApplyOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationApplied(true);
    }, 2000);
  };

  const analysisSteps = [
    { label: '文档完整性校验', status: progress > 20 ? 'pass' : 'pending' },
    { label: '商务条款合规性扫描', status: progress > 45 ? 'pass' : 'pending' },
    { label: '技术方案一致性分析', status: progress > 70 ? 'pass' : 'pending' },
    { label: 'AI 风险评估与预警', status: progress > 90 ? 'pass' : 'pending' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 font-sans">
      {optimizationApplied && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-4 border border-emerald-500/50 shadow-2xl flex items-center gap-4 animate-in slide-in-from-top duration-300">
          <Zap size={20} className="text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest">AI 优化方案已成功应用至标书终稿</span>
          <button onClick={() => setOptimizationApplied(false)} className="ml-4 hover:text-emerald-400 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={12} className="text-blue-500" />
            AI 深度分析引擎 / 活跃
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">标书终审与分析</h1>
          <p className="text-sm text-slate-500 italic font-serif">在生成最终投标文件前，进行全方位的合规性与质量深度扫描</p>
        </div>
        {!isAnalyzing && (
          <button 
            onClick={() => onNext('final')}
            className="px-10 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-2 active:scale-95"
          >
            确认并生成终稿
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {isAnalyzing ? (
        <div className="bg-white border border-slate-200 p-20 flex flex-col items-center justify-center space-y-12 shadow-sm">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-slate-100 rounded-full" />
            <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * progress) / 100}
                className="text-slate-900 transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold font-mono text-slate-900">{progress}%</span>
            </div>
          </div>
          
          <div className="space-y-6 w-full max-w-sm">
            {analysisSteps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'pass' ? 'bg-emerald-500' : 'bg-slate-200 animate-pulse'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step.status === 'pass' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {step.status === 'pass' && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-slate-400 italic font-serif">AI 正在深度解析 12 份投标相关文件，请稍候...</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8 space-y-10">
            <section className="bg-white border border-slate-200 p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em]">核心合规性报告</h3>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Compliance Report</p>
                </div>
                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-100">
                  评分: 98/100
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-6 p-6 bg-slate-50 border border-slate-100 group hover:border-slate-900 transition-colors">
                  <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-emerald-500 shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">资质符合性检查</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      经 AI 扫描，本项目要求的“电子与智能化工程专业承包一级”资质已在附件中提供且在有效期内。
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 p-6 bg-slate-50 border border-slate-100 group hover:border-slate-900 transition-colors">
                  <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-amber-500 shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">商务条款预警</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      招标文件第 12.4 条关于“违约金上限”的描述与我司通用合同模板存在 5% 的偏离，建议在偏离表中明确说明。
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 p-6 bg-slate-50 border border-slate-100 group hover:border-slate-900 transition-colors">
                  <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-blue-500 shrink-0">
                    <Zap size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">技术方案一致性</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      技术标中的“设备清单”与商务标中的“报价清单”数量完全一致，无逻辑性错误。
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 p-12 text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Zap size={16} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">AI 优化建议</span>
                </div>
                <h3 className="text-3xl font-bold tracking-tight max-w-md">通过 AI 提升 15% 的中标概率</h3>
                <p className="text-slate-400 text-sm leading-relaxed italic font-serif max-w-lg">
                  "基于对竞争对手历史投标数据的分析，我们建议在‘售后服务’章节中额外强调我司在 XX 市的本地化服务团队及 2 小时应急响应承诺。"
                </p>
                <button 
                  onClick={handleApplyOptimization}
                  disabled={isOptimizing || optimizationApplied}
                  className={`px-8 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-2 ${optimizationApplied ? 'bg-emerald-500 text-white cursor-default' : 'bg-white text-slate-900 hover:bg-slate-100'}`}
                >
                  {isOptimizing ? <Loader2 size={14} className="animate-spin" /> : optimizationApplied ? <CheckCircle2 size={14} /> : null}
                  {isOptimizing ? '正在应用优化...' : optimizationApplied ? '优化已应用' : '应用优化方案'}
                </button>
              </div>
              <Activity size={200} className="absolute -right-10 -bottom-10 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all duration-700" />
            </section>
          </div>

          <div className="col-span-4 space-y-10">
            <div className="bg-white border border-slate-200 p-10 space-y-8 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em]">风险矩阵</h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Risk Matrix</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: '法律风险', level: '低', color: 'bg-emerald-500' },
                  { label: '财务风险', level: '低', color: 'bg-emerald-500' },
                  { label: '技术风险', level: '中', color: 'bg-amber-500' },
                  { label: '履约风险', level: '低', color: 'bg-emerald-500' },
                ].map((risk, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-500">{risk.label}</span>
                      <span className={risk.level === '中' ? 'text-amber-500' : 'text-emerald-500'}>{risk.level}风险</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100">
                      <div className={`h-full ${risk.color} ${risk.level === '中' ? 'w-1/2' : 'w-1/4'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-10 space-y-8 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em]">关键时间节点</h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Timeline</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { date: '03-30 18:00', label: '完成标书封标' },
                  { date: '03-31 09:30', label: '递交投标文件' },
                  { date: '03-31 10:00', label: '开标仪式' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter w-20 shrink-0">{item.date}</div>
                    <div className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
