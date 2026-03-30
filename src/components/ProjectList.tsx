import React from 'react';
import { Search, Filter, MapPin, Clock, ChevronRight, Globe, Tag, ShieldCheck, Building2, ArrowUpRight, Activity, Database } from 'lucide-react';
import { Project, MOCK_PROJECTS, ProjectStatus } from '../types';

const Badge = ({ status }: { status: ProjectStatus }) => {
  const styles: Record<ProjectStatus, string> = {
    '待评审': 'bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-900 group-hover:text-blue-100 group-hover:border-blue-800',
    '评审中': 'bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-amber-900 group-hover:text-amber-100 group-hover:border-amber-800',
    '已评审': 'bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:bg-emerald-900 group-hover:text-emerald-100 group-hover:border-emerald-800',
    '标书编写中': 'bg-indigo-50 text-indigo-700 border-indigo-100 group-hover:bg-indigo-900 group-hover:text-indigo-100 group-hover:border-indigo-800',
    '已完成': 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-800 group-hover:text-slate-200 group-hover:border-slate-700',
    '已放弃': 'bg-rose-50 text-rose-700 border-rose-100 group-hover:bg-rose-900 group-hover:text-rose-100 group-hover:border-rose-800',
  };
  return (
    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold border uppercase tracking-widest transition-colors ${styles[status]}`}>
      {status}
    </span>
  );
};

interface ProjectListProps {
  onSelect: (p: Project) => void;
}

export const ProjectList = ({ onSelect }: ProjectListProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            全球采购数据流 / 实时
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">招标公告库</h1>
          <p className="text-sm text-slate-500 mt-1 italic font-serif">实时抓取全国政府采购网、公共资源交易中心等权威渠道公告</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目编号、关键词或招标单位..." 
              className="w-full md:w-80 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Filter size={14} />
            筛选条件
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">今日新增</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">124</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 uppercase">
            <ArrowUpRight size={12} />
            较昨日 +12%
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between group hover:border-slate-900 transition-colors">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">高匹配度</div>
          <div className="text-3xl font-bold tracking-tighter text-slate-900">12</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-blue-600 uppercase">
            AI 智能推荐
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">系统状态</div>
            <div className="text-lg font-bold tracking-tight">爬虫运行中：248 个数据源</div>
          </div>
          <Activity size={100} className="text-emerald-500/20 absolute -right-4 -bottom-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-[80px_1.5fr_1fr_120px_120px_100px] gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-200">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">项目编号</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">项目名称</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">招标单位</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">预算 (CNY)</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">截止日期</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] text-right">状态</div>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_PROJECTS.map((project) => (
            <div 
              key={project.id} 
              className="grid grid-cols-[80px_1.5fr_1fr_120px_120px_100px] gap-4 px-6 py-6 hover:bg-slate-900 hover:text-white transition-all cursor-pointer group"
              onClick={() => onSelect(project)}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-500">#{project.id.slice(0, 6)}</div>
              <div className="space-y-2">
                <div className="text-sm font-bold tracking-tight leading-tight">{project.title}</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-slate-400 group-hover:text-slate-500">
                    <MapPin size={10} />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-slate-400 group-hover:text-slate-500">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    已核验
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-800 group-hover:border-slate-700 transition-colors">
                  <Building2 size={14} className="text-slate-400 group-hover:text-slate-500" />
                </div>
                <div className="text-xs font-bold truncate">{project.agency}</div>
              </div>
              <div className="flex items-center font-mono text-xs font-bold tracking-tighter text-emerald-600 group-hover:text-emerald-400">
                {project.budget}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-300 group-hover:text-slate-600" />
                <div className="text-[10px] font-mono font-bold">{project.deadline}</div>
              </div>
              <div className="flex items-center justify-end">
                <Badge status={project.status} />
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-6 border-t border-slate-200 bg-slate-50/30 flex justify-between items-center">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">显示 1-{MOCK_PROJECTS.length} 条，共 1,240 条记录</div>
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
