import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Clock, ChevronRight, Globe, Tag, ShieldCheck, Building2, ArrowUpRight, Activity, Database, RefreshCw, X, Plus } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | '全部'>('全部');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectUrl, setNewProjectUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importMode, setImportMode] = useState<'ai' | 'manual'>('ai');
  const [manualProject, setManualProject] = useState({ title: '', agency: '', budget: '' });

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === '全部' || project.status === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleImport = () => {
    if (importMode === 'ai' && !newProjectUrl) return;
    if (importMode === 'manual' && !manualProject.title) return;
    
    setIsImporting(true);
    // Simulate AI extraction or manual save
    setTimeout(() => {
      setIsImporting(false);
      setShowNewProjectModal(false);
      setNewProjectUrl('');
      setManualProject({ title: '', agency: '', budget: '' });
      // In a real app, we would add the new project to the list
      alert(importMode === 'ai' ? '项目导入成功！AI 已自动提取招标公告关键信息。' : '项目手动创建成功！');
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans relative">
      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">
                  {importMode === 'ai' ? 'AI 智能导入' : '手动创建项目'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">新增招标项目</h3>
              </div>
              <button onClick={() => setShowNewProjectModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setImportMode('ai')}
                className={`flex-1 py-4 text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${importMode === 'ai' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
              >
                AI 智能解析
              </button>
              <button 
                onClick={() => setImportMode('manual')}
                className={`flex-1 py-4 text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${importMode === 'manual' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
              >
                手动录入
              </button>
            </div>

            <div className="p-8 space-y-8">
              {importMode === 'ai' ? (
                <div className="space-y-4">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">输入招标公告 URL 或 粘贴正文</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                    <textarea 
                      placeholder="https://www.ccgp.gov.cn/..." 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all min-h-[120px] resize-none"
                      value={newProjectUrl}
                      onChange={(e) => setNewProjectUrl(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic leading-relaxed">
                    * 支持中国政府采购网、各省市公共资源交易中心 URL。AI 将自动解析项目名称、预算、截止日期及资格要求。
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">项目名称</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      value={manualProject.title}
                      onChange={(e) => setManualProject({...manualProject, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">招标单位</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                        value={manualProject.agency}
                        onChange={(e) => setManualProject({...manualProject, agency: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">预算金额</label>
                      <input 
                        type="text"
                        placeholder="例如: 4,500万"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                        value={manualProject.budget}
                        onChange={(e) => setManualProject({...manualProject, budget: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {importMode === 'ai' && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100">
                  <Activity size={16} className="text-blue-500" />
                  <div className="text-[10px] font-mono font-bold text-blue-600 uppercase leading-tight">
                    AI 引擎已就绪，预计解析时间: 3-5 秒
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 py-4 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleImport}
                  disabled={(importMode === 'ai' && !newProjectUrl) || (importMode === 'manual' && !manualProject.title) || isImporting}
                  className={`flex-1 py-4 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl ${((importMode === 'ai' && !newProjectUrl) || (importMode === 'manual' && !manualProject.title) || isImporting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 active:scale-95'}`}
                >
                  {isImporting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      {importMode === 'ai' ? '正在解析中...' : '正在保存...'}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={14} />
                      {importMode === 'ai' ? '立即导入项目' : '创建项目'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} />
            新增项目
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目编号、关键词或招标单位..." 
              className="w-full md:w-80 pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
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
          <div className="relative group">
            <select 
              className="appearance-none px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-[10px] font-mono font-bold uppercase tracking-widest pr-10 cursor-pointer focus:outline-none"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
            >
              <option value="全部">全部状态</option>
              <option value="待评审">待评审</option>
              <option value="评审中">评审中</option>
              <option value="已评审">已评审</option>
              <option value="标书编写中">标书编写中</option>
              <option value="已完成">已完成</option>
              <option value="已放弃">已放弃</option>
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
          </div>
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
        <div className="col-span-2 bg-slate-900 p-6 flex items-center justify-between text-white overflow-hidden relative group">
          <div className="relative z-10">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">系统状态</div>
            <div className="text-lg font-bold tracking-tight">爬虫运行中：248 个数据源</div>
            <button 
              onClick={handleRefresh}
              className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 uppercase hover:text-emerald-300 transition-colors active:scale-95"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? '正在同步数据...' : '立即刷新数据源'}
            </button>
          </div>
          <Activity size={100} className="text-emerald-500/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[80px_1.5fr_1fr_120px_120px_100px] gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-200">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">项目编号</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">项目名称</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">招标单位</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">预算 (CNY)</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">截止日期</div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] text-right">状态</div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
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
            ))
          ) : (
            <div className="px-6 py-20 text-center space-y-4">
              <div className="text-slate-300 flex justify-center">
                <Search size={48} strokeWidth={1} />
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">未找到匹配的项目</div>
              <button 
                onClick={() => { setSearchTerm(''); setActiveFilter('全部'); }}
                className="text-[10px] font-mono font-bold text-blue-600 uppercase hover:underline"
              >
                清除所有过滤条件
              </button>
            </div>
          )}
        </div>
        <div className="px-6 py-6 border-t border-slate-200 bg-slate-50/30 flex justify-between items-center">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            显示 {filteredProjects.length} 条记录，共 1,240 条记录
          </div>
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
