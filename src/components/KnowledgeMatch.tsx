import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, AlertTriangle, CheckCircle2, Info, Activity, Target, Zap, ArrowUpRight, Search, Filter, Loader2, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface KnowledgeMatchProps {
  onBack: () => void;
  onNext: (view: string) => void;
}

export const KnowledgeMatch = ({ onBack, onNext }: KnowledgeMatchProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<string | null>(null);

  const handleGapAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const matchData = [
        { cat: '企业资质', req: '电子与智能化工程专业承包一级', status: '命中' },
        { cat: '企业资质', req: '信息系统建设和服务能力等级CS4', status: '命中' },
        { cat: '人员证书', req: '高级信息系统项目管理师 (3名)', status: '部分满足' },
        { cat: '人员证书', req: '注册电气工程师 (1名)', status: '命中' },
        { cat: '类似业绩', req: '近三年4000万以上智慧城市项目', status: '命中' },
        { cat: '财务能力', req: '项目所在地纳税信用A级', status: '命中' },
        { cat: '设备要求', req: '具备专用检测设备 (5套)', status: '可调配' },
      ];

      const prompt = `你是一个专业的投标专家。请分析以下投标项目的资质人员匹配情况，并提供具体的改进建议和风险规避策略。
      匹配数据: ${JSON.stringify(matchData)}
      
      请按以下格式回答：
      1. 核心缺口分析：指出最关键的缺失项。
      2. 风险规避建议：如何通过联合体、分包或人员调配来降低风险。
      3. 加分项建议：如何利用现有优势（如 A 级纳税、多项类似业绩）在技术标中获得更高分数。
      
      回答要专业、简洁，使用中文。`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setGapAnalysis(response.text || "分析失败。");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      setGapAnalysis("AI 分析引擎暂时不可用，请稍后重试。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
      <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">
        <button onClick={() => onNext('list')} className="hover:text-slate-900 transition-colors">项目列表</button>
        <ChevronRight size={12} />
        <button onClick={onBack} className="hover:text-slate-900 transition-colors">AI 评审结果</button>
        <ChevronRight size={12} />
        <span className="text-slate-900">企业知识匹配详情</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Target size={12} className="text-blue-500" />
            AI 知识匹配引擎 / 深度扫描
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">资质与人员匹配矩阵</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">基于企业知识库，自动对比招标文件要求与公司现有资源</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleGapAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-white border border-slate-900 text-slate-900 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 active:scale-95 shadow-xl"
          >
            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {isAnalyzing ? '正在深度分析...' : 'AI 缺口分析'}
          </button>
        </div>
      </div>

      {gapAnalysis && (
        <div className="bg-blue-50 border border-blue-100 p-8 space-y-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => setGapAnalysis(null)}
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <Zap size={16} />
            </div>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest">AI 专家改进建议</h3>
          </div>
          <div className="text-sm text-blue-800 leading-relaxed font-serif italic prose prose-blue max-w-none">
            <ReactMarkdown>{gapAnalysis}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">匹配得分</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">92/100</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 uppercase">
            <ArrowUpRight size={12} />
            高匹配度
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">关键缺口</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">01</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-amber-600 uppercase">
            建议内部调配
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">合规性预警</div>
            <div className="text-lg font-bold tracking-tight">发现 2 处潜在技术偏离风险</div>
          </div>
          <Activity size={100} className="text-amber-500/20 absolute -right-4 -bottom-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[120px_1.5fr_100px_1fr] gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-200">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">类别</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">招标要求</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">匹配状态</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">匹配详情 / 证据支撑</div>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { cat: '企业资质', req: '电子与智能化工程专业承包一级', status: '命中', detail: '证书编号：D244012345，有效期至2026年', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { cat: '企业资质', req: '信息系统建设和服务能力等级CS4', status: '命中', detail: '证书编号：CS4-2022-001，已通过年审', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { cat: '人员证书', req: '高级信息系统项目管理师 (3名)', status: '部分满足', detail: '目前在册：张三、李四。缺口：1名。建议从华东分公司调配。', color: 'bg-amber-50 text-amber-700 border-amber-100' },
            { cat: '人员证书', req: '注册电气工程师 (1名)', status: '命中', detail: '匹配人员：王五，证书状态：有效', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { cat: '类似业绩', req: '近三年4000万以上智慧城市项目', status: '命中', detail: '命中3项：XX市智慧交通(4.5k万)、YY区数字政府(5.2k万)、ZZ市大脑(6.1k万)', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { cat: '财务能力', req: '项目所在地纳税信用A级', status: '命中', detail: '2021-2023连续三年A级，税务局官方证明已获取', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { cat: '设备要求', req: '具备专用检测设备 (5套)', status: '可调配', detail: '自有3套，可通过租赁协议补充2套。', color: 'bg-blue-50 text-blue-700 border-blue-100' },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-[120px_1.5fr_100px_1fr] gap-4 px-8 py-6 hover:bg-slate-50 transition-all group">
              <div className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">{item.cat}</div>
              <div className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{item.req}</div>
              <div className="flex items-center">
                <span className={`px-2 py-0.5 text-[9px] font-mono font-bold border uppercase tracking-widest ${item.color}`}>
                  {item.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 italic font-serif leading-relaxed">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          onClick={onBack}
          className="px-8 py-3 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
        >
          返回评审报告
        </button>
        <button 
          onClick={() => onNext('draft')}
          className="px-10 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-2 active:scale-95"
        >
          确认匹配并开始起草
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
