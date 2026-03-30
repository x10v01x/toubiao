import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, Zap, Target, ShieldAlert, Info, Activity, ChevronRight, RotateCcw, XCircle, History, Check, AlertCircle, BarChart3, ShieldCheck } from 'lucide-react';
import { Project } from '../types';

interface ReviewResultProps {
  project: Project;
  onBack: () => void;
  onNext: (view: string) => void;
}

export const ReviewResult = ({ project, onBack, onNext }: ReviewResultProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 font-sans pb-20">
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
          >
            <RotateCcw size={18} />
          </button>
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity size={12} className="text-emerald-500" />
              AI 智能评审引擎 / 活跃
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">项目评审报告</h1>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">置信度评分</div>
            <div className="text-3xl font-bold text-slate-900 font-mono tracking-tighter">94.2%</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-500 flex items-center justify-center shadow-xl">
            <span className="text-xl font-bold text-slate-900 font-mono">A+</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-10">
          <section className="bg-slate-900 p-12 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={200} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-emerald-500"></div>
                <h3 className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.4em]">执行摘要 / Executive Summary</h3>
              </div>
              <p className="text-2xl font-medium leading-relaxed tracking-tight italic font-serif text-slate-100">
                "当前项目整体具备投标基础。我司核心资质完全覆盖招标要求，且在同类智慧城市项目中具备显著的业绩优势。虽然在部分特定人员证书上存在缺口，但可通过内部调配或临时聘用解决。"
              </p>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Target size={14} className="text-emerald-500" />
                  核心优势 / Core Advantages
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5">MATCHED</span>
              </div>
              <div className="space-y-4">
                {[
                  '具备“电子与智能化工程专业承包一级”资质，完全符合准入门槛。',
                  '近三年内有3个同等规模（4000万以上）的智慧城市成功案例。',
                  '项目所在地设有分公司，具备本地化服务能力评分优势。'
                ].map((strength, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white border border-slate-100 group hover:border-emerald-500 transition-all shadow-sm hover:shadow-md">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-bold text-slate-700 leading-snug">{strength}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                  <ShieldAlert size={14} className="text-rose-500" />
                  风险预警 / Risk Assessment
                </h3>
                <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5">CRITICAL</span>
              </div>
              <div className="space-y-4">
                {[
                  '招标文件对“高级信息系统项目管理师”证书要求为3名，我司目前仅2名在册。',
                  '工期要求紧凑（180天），需协调供应链确保设备按时到场。',
                  '付款比例中，质保金比例略高于行业平均水平（5%）。'
                ].map((risk, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white border border-slate-100 group hover:border-rose-500 transition-all shadow-sm hover:shadow-md">
                    <AlertTriangle size={18} className="text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-bold text-slate-700 leading-snug">{risk}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="col-span-4 space-y-8">
          <section className="bg-white border border-slate-200 p-10 space-y-8 shadow-xl sticky top-8">
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em]">决策建议 / Decision Matrix</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-widest">推荐动作: 继续推进 / PROCEED</p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => onNext('draft')}
                className="w-full py-5 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
              >
                <Zap size={14} />
                开始编写标书
              </button>
              <button 
                className="w-full py-5 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Info size={14} />
                请求更多信息
              </button>
              <button 
                onClick={onBack}
                className="w-full py-5 text-rose-600 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-rose-50 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <XCircle size={14} />
                放弃该项目
              </button>
            </div>

            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">后续建议步骤 / Next Steps</div>
              <ul className="space-y-4">
                {[
                  '立即从华东分公司调配1名高级项目经理。',
                  '重点梳理近三年智慧城市相关业绩证明。',
                  '针对付款比例，在澄清阶段尝试进行沟通。'
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-700 leading-snug">
                    <ChevronRight size={14} className="text-slate-300 shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100">
                <ShieldCheck size={16} className="text-slate-400" />
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-tight">
                  本报告由 AI 自动生成，仅供内部决策参考。
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
