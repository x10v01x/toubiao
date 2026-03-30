import React from 'react';
import { Search, Filter, Plus, Building2, MapPin, Calendar, FileText, ExternalLink, ChevronRight, Download, ArrowUpRight, Activity, Database } from 'lucide-react';

const PerformanceRow = ({ title, agency, amount, date, location, type }: any) => (
  <tr className="border-b border-slate-100 hover:bg-slate-900 hover:text-white transition-all group cursor-pointer">
    <td className="px-6 py-5">
      <div className="font-bold text-sm leading-tight mb-1">{title}</div>
      <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100">
        <span className="flex items-center gap-1"><Building2 size={10} />{agency}</span>
        <span className="flex items-center gap-1"><MapPin size={10} />{location}</span>
      </div>
    </td>
    <td className="px-6 py-5">
      <span className="px-2 py-0.5 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-widest group-hover:border-white/20">
        {type}
      </span>
    </td>
    <td className="px-6 py-5">
      <div className="text-sm font-mono font-bold text-emerald-600 group-hover:text-emerald-400">{amount}</div>
    </td>
    <td className="px-6 py-5">
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 flex items-center gap-2">
        <Calendar size={12} />
        {date}
      </div>
    </td>
    <td className="px-6 py-5 text-right">
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-white/10 transition-colors"><FileText size={16} /></button>
        <button className="p-2 hover:bg-white/10 transition-colors"><Download size={16} /></button>
        <button className="p-2 hover:bg-white/10 transition-colors"><ArrowUpRight size={16} /></button>
      </div>
    </td>
  </tr>
);

export const PerformanceLibrary = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Database size={12} className="text-blue-500" />
            业绩档案库 / 历史数据
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">历史业绩库</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">管理企业已完成的工程项目业绩，支持按金额、地区、行业多维检索</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目档案..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all w-64"
            />
          </div>
          <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
            <Plus size={14} />
            录入新业绩
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">总合同额</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">¥12.4B</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 uppercase">
            <ArrowUpRight size={12} />
            同比增长 12.5%
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">已完成项目</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">128</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
            覆盖 12 个地区
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">市场渗透率</div>
            <div className="text-lg font-bold tracking-tight">优势领域：智慧城市集成</div>
          </div>
          <Activity size={100} className="text-blue-500/20 absolute -right-4 -bottom-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-8">
            {['全部业绩 (128)', '智慧城市 (45)', '系统集成 (62)', '运维服务 (21)'].map((tab, i) => (
              <button 
                key={i} 
                className={`text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${i === 0 ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">
            <Filter size={14} />
            高级筛选
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">项目名称 / 建设单位</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">类别</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">合同金额</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">竣工日期</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <PerformanceRow 
              title="XX市智慧交通管理系统(一期)建设项目" 
              agency="XX市公安局交通警察支队" 
              amount="4,560.00 万元" 
              date="2023-11-15" 
              location="广东省XX市"
              type="智慧城市"
            />
            <PerformanceRow 
              title="YY区数字政府政务服务平台升级工程" 
              agency="YY区政务服务中心" 
              amount="5,230.00 万元" 
              date="2023-08-20" 
              location="江苏省YY区"
              type="系统集成"
            />
            <PerformanceRow 
              title="ZZ市城市大脑运行指挥中心建设" 
              agency="ZZ市大数据管理局" 
              amount="6,120.00 万元" 
              date="2022-12-10" 
              location="浙江省ZZ市"
              type="智慧城市"
            />
            <PerformanceRow 
              title="某大型医院智能化弱电系统集成项目" 
              agency="某市第一人民医院" 
              amount="2,850.00 万元" 
              date="2023-05-05" 
              location="四川省某市"
              type="系统集成"
            />
            <PerformanceRow 
              title="2023年度全省教育网骨干链路运维服务" 
              agency="省教育厅信息中心" 
              amount="1,200.00 万元" 
              date="2023-12-31" 
              location="全省范围"
              type="运维服务"
            />
          </tbody>
        </table>
        <div className="px-6 py-6 border-t border-slate-200 bg-slate-50/30 flex justify-between items-center">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">显示第 1-5 条，共 128 条记录</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-300 uppercase cursor-not-allowed">上一页</button>
            <button className="px-3 py-1 bg-slate-900 border border-slate-900 text-[10px] font-mono font-bold text-white uppercase">01</button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase">02</button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase">03</button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};
