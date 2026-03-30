import React from 'react';
import { ArrowLeft, FileText, Download, ExternalLink, Clock, Building2, MapPin, ShieldCheck, Zap, Info, ChevronRight, FileCode, ArrowUpRight, Activity } from 'lucide-react';
import { Project, ProjectStatus } from '../types';

const Badge = ({ status }: { status: ProjectStatus }) => {
  const styles: Record<ProjectStatus, string> = {
    '待评审': 'bg-blue-50 text-blue-700 border-blue-200',
    '评审中': 'bg-amber-50 text-amber-700 border-amber-200',
    '已评审': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    '标书编写中': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    '已完成': 'bg-slate-100 text-slate-700 border-slate-300',
    '已放弃': 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold border uppercase tracking-widest transition-colors ${styles[status]}`}>
      {status}
    </span>
  );
};

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNext: (view: string) => void;
}

export const ProjectDetail = ({ project, onBack, onNext }: ProjectDetailProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 font-sans">
      <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">
        <button onClick={onBack} className="hover:text-slate-900 transition-colors flex items-center gap-2">
          <ArrowLeft size={12} />
          返回列表
        </button>
        <ChevronRight size={12} />
        <span className="text-slate-900">项目详情</span>
      </div>

      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge status={project.status} />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">
                项目编号: {project.id.slice(0, 12)}
              </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[0.88] max-w-5xl">
            {project.title}
          </h1>
        </div>

        <div className="grid grid-cols-4 gap-12 border-y border-slate-200 py-12">
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">预算金额 (CNY)</div>
            <div className="text-3xl font-bold text-slate-900 font-mono tracking-tighter">{project.budget}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">截止日期 (UTC+8)</div>
            <div className="text-3xl font-bold text-slate-900 font-mono tracking-tighter">{project.deadline}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">招标单位</div>
            <div className="text-sm font-bold text-slate-900 leading-tight uppercase tracking-tight">{project.agency}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">项目地点</div>
            <div className="text-sm font-bold text-slate-900 leading-tight uppercase tracking-tight">{project.location}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-16">
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                <Info size={14} className="text-blue-500" />
                公告正文内容
              </h3>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">数据来源：中国政府采购网</div>
            </div>
            <div className="bg-slate-50 p-12 border border-slate-100 text-slate-700 leading-relaxed text-sm space-y-6 font-serif italic">
              <div className="space-y-2">
                <p className="font-bold text-slate-900 not-italic font-sans text-[10px] uppercase tracking-[0.2em]">一、项目基本情况</p>
                <div className="grid grid-cols-2 gap-4 not-italic font-sans text-xs">
                  <p><span className="text-slate-400 font-mono uppercase tracking-widest mr-2">项目编号:</span> SZ-2024-001</p>
                  <p><span className="text-slate-400 font-mono uppercase tracking-widest mr-2">招标方式:</span> 公开招标</p>
                  <p><span className="text-slate-400 font-mono uppercase tracking-widest mr-2">预算金额:</span> {project.budget}</p>
                  <p><span className="text-slate-400 font-mono uppercase tracking-widest mr-2">最高限价:</span> {project.budget}</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed">采购需求：本项目主要内容包括智慧城市基础设施的建设、安装、调试及后续运维服务。具体要求详见招标文件。</p>
              <p>合同履行期限：自合同签订之日起180个日历天内完成建设。</p>
              <p>本项目（是/否）接受联合体投标：否</p>
              <div className="space-y-2 pt-6">
                <p className="font-bold text-slate-900 not-italic font-sans text-[10px] uppercase tracking-[0.2em]">二、申请人的资格要求</p>
                <div className="space-y-2 not-italic font-sans text-xs leading-relaxed">
                  <p>1. 满足《中华人民共和国政府采购法》第二十二条规定；</p>
                  <p>2. 落实政府采购政策需满足的资格要求：无；</p>
                  <p>3. 本项目的特定资格要求：具备电子与智能化工程专业承包一级资质...</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                <FileText size={14} className="text-slate-400" />
                附件清单
              </h3>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">总大小：49.5 MB</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: '招标文件.pdf', size: '2.4 MB', type: 'pdf' },
                { name: '工程量清单.xlsx', size: '856 KB', type: 'xls' },
                { name: '技术规范书.docx', size: '1.2 MB', type: 'doc' },
                { name: '设计图纸.zip', size: '45.0 MB', type: 'other' },
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-200 hover:border-slate-900 transition-all group relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                      <FileCode size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">{file.name}</div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">{file.size}</div>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-slate-900 transition-colors relative z-10">
                    <Download size={18} />
                  </button>
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                    <FileCode size={60} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4">
          <div className="bg-slate-900 p-10 text-white space-y-10 sticky top-24 overflow-hidden shadow-2xl">
            <div className="space-y-4 relative z-10">
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em]">AI 智能分析引擎</div>
              <h4 className="text-2xl font-bold tracking-tight leading-tight">准备好进行可行性评审了吗？</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
                我们的 AI 将结合企业知识库对公告及附件进行深度解析，为您提供投标可行性评分。
              </p>
            </div>
            
            <div className="space-y-4 relative z-10">
              <button 
                onClick={() => onNext('review')}
                className="w-full py-5 bg-white text-slate-900 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95"
              >
                <Zap size={14} />
                开始 AI 智能评审
              </button>
              <button 
                onClick={() => onNext('source')}
                className="w-full py-5 border border-slate-700 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ExternalLink size={14} />
                追溯原始数据源
              </button>
            </div>

            <div className="pt-8 border-t border-slate-800 relative z-10">
              <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em]">
                <ShieldCheck size={14} />
                数据完整性已核验
              </div>
            </div>

            <Activity size={150} className="text-blue-500/10 absolute -right-8 -bottom-8" />
          </div>
        </div>
      </div>
    </div>
  );
};
