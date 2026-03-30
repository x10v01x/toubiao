import React from 'react';
import { LayoutGrid, ClipboardCheck, FileText, Users, FileSearch, Bell, User, Menu, Award, Database } from 'lucide-react';

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
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
              <User size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">投标部 - 张经理</div>
              <div className="text-[10px] text-slate-400 truncate">joseluckeyhkd@gmail.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 lg:hidden">
              <Menu size={20} />
            </button>
            <div className="h-4 w-px bg-slate-200 hidden lg:block"></div>
            <div className="text-sm text-slate-500 hidden lg:block">
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
