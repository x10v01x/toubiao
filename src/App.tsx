/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Download, Zap, ShieldCheck, CheckCircle2, ArrowRight, Printer, LogIn, Loader2 } from 'lucide-react';
import { Project } from './types';

// Import components
import { Layout } from './components/Layout';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { ReviewResult } from './components/ReviewResult';
import { KnowledgeMatch } from './components/KnowledgeMatch';
import { BidDraft } from './components/BidDraft';
import { SourceLink } from './components/SourceLink';
import { Dashboard } from './components/Dashboard';
import { QualificationLibrary } from './components/QualificationLibrary';
import { PerformanceLibrary } from './components/PerformanceLibrary';
import { PersonnelLibrary } from './components/PersonnelLibrary';
import { BidPackage } from './components/BidPackage';
import { AIAssistant } from './components/AIAssistant';
import { KnowledgeBase } from './components/KnowledgeBase';
import { StandardsLibrary } from './components/StandardsLibrary';
import { BidAnalysis } from './components/BidAnalysis';
import { FirebaseProvider, useFirebase, ErrorBoundary } from './components/FirebaseProvider';

function AppContent() {
  const { user, loading, login } = useFirebase();
  const [currentView, setCurrentView] = useState('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-6">
        <Loader2 size={40} className="text-slate-900 animate-spin" />
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">系统初始化中 / INITIALIZING...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md w-full bg-white border border-slate-200 p-12 shadow-2xl space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">身份验证 / AUTHENTICATION</div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">AI 智能投标管理系统</h1>
            <p className="text-sm text-slate-500 italic font-serif leading-relaxed">
              欢迎使用下一代投标效能引擎。请登录以访问您的项目、资质库及 AI 辅助功能。
            </p>
          </div>
          
          <button 
            onClick={login}
            className="w-full py-4 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl group-hover:translate-y-[-2px]"
          >
            <LogIn size={18} />
            使用 Google 账号登录
          </button>
          
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" />
              企业级安全保障
            </div>
            <div>v4.0.2-STABLE</div>
          </div>
        </div>
      </div>
    );
  }

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'list': 
        return <ProjectList onSelect={handleProjectSelect} />;
      
      case 'detail': 
        return selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            onBack={() => setCurrentView('list')} 
            onNext={setCurrentView} 
          />
        );
      
      case 'review': 
        return selectedProject && (
          <ReviewResult 
            project={selectedProject} 
            onBack={() => setCurrentView('detail')} 
            onNext={setCurrentView} 
          />
        );
      
      case 'match': 
        return (
          <KnowledgeMatch 
            onBack={() => setCurrentView('review')} 
            onNext={setCurrentView} 
          />
        );
      
      case 'draft': 
        return <BidDraft onNext={setCurrentView} />;
      
      case 'package':
        return <BidPackage onNext={setCurrentView} />;
      
      case 'analysis':
        return <BidAnalysis onNext={setCurrentView} />;
      
      case 'source': 
        return <SourceLink onBack={() => setCurrentView('detail')} />;
      
      case 'dashboard':
        return <Dashboard />;
      
      case 'qualifications':
        return <QualificationLibrary />;
      
      case 'performance':
        return <PerformanceLibrary />;
      
      case 'personnel':
        return <PersonnelLibrary />;
      
      case 'knowledge':
        return <KnowledgeBase onViewChange={setCurrentView} />;
      
      case 'standards':
        return <StandardsLibrary />;
      
      case 'final': 
        return (
          <div className="max-w-4xl mx-auto py-20 px-8">
            <div className="flex flex-col items-center text-center space-y-12">
              <div className="relative">
                <div className="w-32 h-32 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                  <Check size={64} className="text-emerald-500" strokeWidth={1.5} />
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -right-2 -bottom-2 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                >
                  <Zap size={20} />
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">生成任务已完成 / 100%</div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">标书终稿已就绪</h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto font-serif italic">
                  所有章节已根据 AI 批注和您的反馈完成深度优化。文档结构完整，排版已初步完成，可直接导出。
                </p>
              </div>

              <div className="grid grid-cols-3 gap-12 w-full py-12 border-y border-slate-100">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-slate-900 tracking-tighter">128</div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">总页数</div>
                </div>
                <div className="space-y-1 border-x border-slate-100 px-12">
                  <div className="text-3xl font-bold text-slate-900 tracking-tighter">12,450</div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">总字数</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-slate-900 tracking-tighter">100%</div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">合规性检查</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                <div className="flex-1 flex flex-col gap-2">
                  <button className="w-full px-8 py-4 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                    <Download size={18} />
                    导出 Word 终稿
                  </button>
                  <button className="w-full px-8 py-2 bg-white border border-slate-200 text-slate-500 text-[9px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Download size={14} />
                    导出 Markdown 源码
                  </button>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <button className="w-full px-8 py-4 bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                    <ShieldCheck size={18} />
                    发起电子签章
                  </button>
                  <button 
                    onClick={() => setCurrentView('list')} 
                    className="w-full px-8 py-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
                  >
                    返回项目列表
                  </button>
                </div>
              </div>

              <div className="pt-8 flex items-center gap-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                文档已通过 AES-256 加密存储
              </div>
            </div>
          </div>
        );
      
      default: 
        return <ProjectList onSelect={handleProjectSelect} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
      <AIAssistant selectedProject={selectedProject} currentView={currentView} />
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
