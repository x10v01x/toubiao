import React from 'react';
import { Search, Filter, Plus, FileCode, Download, ExternalLink, Calendar, CheckCircle2, AlertCircle, MoreVertical, ShieldCheck, Activity, ArrowUpRight } from 'lucide-react';

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

export const QualificationLibrary = () => {
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
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索资质库..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all w-64"
            />
          </div>
          <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
            <Plus size={14} />
            新增资质
          </button>
        </div>
      </div>

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
              className={`pb-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all relative ${i === 0 ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
              {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          <QualificationCard 
            title="电子与智能化工程专业承包一级" 
            code="D2440123456789" 
            expiry="2026-12-31" 
            status="有效" 
            type="行业资质"
          />
          <QualificationCard 
            title="建筑机电安装工程专业承包一级" 
            code="D2440987654321" 
            expiry="2025-06-15" 
            status="有效" 
            type="行业资质"
          />
          <QualificationCard 
            title="信息系统建设和服务能力等级CS4" 
            code="CS4-2022-001" 
            expiry="2024-05-20" 
            status="即将过期" 
            type="体系认证"
          />
          <QualificationCard 
            title="ISO9001 质量管理体系认证" 
            code="ISO-9001-2023" 
            expiry="2027-01-10" 
            status="有效" 
            type="体系认证"
          />
          <QualificationCard 
            title="高新技术企业证书" 
            code="GR202344001234" 
            expiry="2026-11-05" 
            status="有效" 
            type="荣誉证书"
          />
          <QualificationCard 
            title="广东省守合同重信用企业" 
            code="SH-2023-GD-001" 
            expiry="2024-12-31" 
            status="有效" 
            type="荣誉证书"
          />
        </div>
      </div>
    </div>
  );
};
