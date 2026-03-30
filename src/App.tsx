/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Download } from 'lucide-react';
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
      
      case 'final': 
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
              <Check size={40} strokeWidth={3} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">接近终稿版本已生成</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                所有章节已根据 AI 批注和您的反馈完成深度优化。文档结构完整，排版已初步完成，可直接导出。
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <button className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                <Download size={20} />
                导出 Word 终稿
              </button>
              <button 
                onClick={() => setCurrentView('list')} 
                className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-all"
              >
                返回项目列表
              </button>
            </div>
            <div className="pt-12 grid grid-cols-3 gap-8 w-full max-w-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">128</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">总页数</div>
              </div>
              <div className="text-center border-x border-slate-100">
                <div className="text-2xl font-bold text-slate-900">12,450</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">总字数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">合规性检查</div>
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
      <AIAssistant selectedProject={selectedProject} />
    </Layout>
  );
}
