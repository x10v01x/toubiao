/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Download, Zap, ShieldCheck, CheckCircle2, ArrowRight, Printer } from 'lucide-react';
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

export default function App() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
                <button className="flex-1 px-8 py-4 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                  <Download size={18} />
                  导出 Word 终稿
                </button>
                <button 
                  onClick={() => setCurrentView('list')} 
                  className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
                >
                  返回项目列表
                </button>
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
