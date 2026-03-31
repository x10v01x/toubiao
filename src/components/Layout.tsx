import React, { useState } from 'react';
import { LayoutGrid, ClipboardCheck, FileText, Users, FileSearch, Bell, User, Menu, Award, Database, Search, X, ChevronRight, LogOut } from 'lucide-react';
import { useFirebase } from './FirebaseProvider';

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${active ? 'bg-slate-100 text-slate-900 font-medium border-r-2 border-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Layout = ({ children, currentView, onViewChange }: LayoutProps) => {
  const { user, logout } = useFirebase();
  const getNodeName = () => {
    switch (currentView) {
      case 'dashboard': return '系统概览';
      case 'list': return '项目筛选';
      case 'detail': return '详情审阅';
      case 'review': return '立项评审';
      case 'match': return '知识匹配';
      case 'draft': return '标书编写';
      case 'final': return '终稿确认';
      case 'source': return '来源追踪';
      case 'qualifications': return '企业资质库';
      case 'performance': return '历史业绩库';
      case 'personnel': return '人员人才库';
      case 'knowledge': return '企业知识库';
      default: return '系统概览';
    }
  };

  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
              <LayoutGrid size={20} />
            </div>
            <span className="font-bold tracking-tight">投标辅助平台</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">概览</div>
          <SidebarItem 
            icon={LayoutGrid} 
            label="系统仪表盘" 
            active={currentView === 'dashboard'} 
            onClick={() => onViewChange('dashboard')} 
          />

          <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">核心工作</div>
          <SidebarItem 
            icon={FileSearch} 
            label="项目工作台" 
            active={currentView === 'list' || currentView === 'detail' || currentView === 'source'} 
            onClick={() => onViewChange('list')} 
          />
          <SidebarItem 
            icon={ClipboardCheck} 
            label="立项评审" 
            active={currentView === 'review' || currentView === 'match'} 
            onClick={() => onViewChange('review')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="标书编写" 
            active={currentView === 'draft' || currentView === 'final' || currentView === 'package'} 
            onClick={() => onViewChange('draft')} 
          />
          
          <div className="px-4 mt-8 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">资源库</div>
          <SidebarItem 
            icon={Database} 
            label="企业知识库" 
            active={currentView === 'knowledge' || currentView === 'qualifications' || currentView === 'personnel' || currentView === 'performance'} 
            onClick={() => onViewChange('knowledge')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group relative">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">{user?.displayName || '用户'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
              title="退出登录"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button className="p-2 text-slate-400 hover:text-slate-900 lg:hidden">
              <Menu size={20} />
            </button>
            <div className="h-4 w-px bg-slate-200 hidden lg:block"></div>
            <div className="relative flex-1 hidden lg:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="全局搜索项目、资质、人员或标准..." 
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900 transition-colors"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
              {globalSearch && (
                <>
                  <button 
                    onClick={() => setGlobalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={12} />
                  </button>
                  {/* Search Results Dropdown */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">搜索结果</div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {[
                        { type: '项目', title: '智慧城市二期建设项目', id: 'PRJ-2024-001' },
                        { type: '资质', title: '电子与智能化工程专业承包一级', id: 'QUAL-001' },
                        { type: '人员', title: '张三 - 高级工程师', id: 'PER-001' },
                        { type: '标准', title: 'GB/T 19001-2016 质量管理体系', id: 'STD-001' },
                      ].filter(item => item.title.includes(globalSearch) || item.id.includes(globalSearch)).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer group transition-colors border border-transparent hover:border-slate-200">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                              <FileText size={14} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{item.title}</div>
                              <div className="text-[10px] font-mono text-slate-400 uppercase">{item.type} · {item.id}</div>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                      ))}
                      {globalSearch.length > 0 && [
                        { type: '项目', title: '智慧城市二期建设项目', id: 'PRJ-2024-001' },
                        { type: '资质', title: '电子与智能化工程专业承包一级', id: 'QUAL-001' },
                        { type: '人员', title: '张三 - 高级工程师', id: 'PER-001' },
                        { type: '标准', title: 'GB/T 19001-2016 质量管理体系', id: 'STD-001' },
                      ].filter(item => item.title.includes(globalSearch) || item.id.includes(globalSearch)).length === 0 && (
                        <div className="py-8 text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                          未找到匹配结果
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-slate-500 hidden lg:block whitespace-nowrap">
              当前节点：<span className="text-slate-900 font-medium">{getNodeName()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900">投标辅助系统 v2.4</div>
                <div className="text-[10px] text-emerald-600 font-medium">系统运行正常</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
