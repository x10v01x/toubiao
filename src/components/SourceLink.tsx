import React, { useState } from 'react';
import { Search, ExternalLink, Download, ChevronRight, ShieldCheck, Loader2, RotateCcw } from 'lucide-react';

interface SourceLinkProps {
  onBack: () => void;
}

export const SourceLink = ({ onBack }: SourceLinkProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerified, setLastVerified] = useState('2024-03-25 09:15:02');

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLastVerified(new Date().toLocaleString());
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">
          <button onClick={onBack} className="hover:text-slate-900 transition-colors flex items-center gap-2">
            <RotateCcw size={12} />
            返回项目详情
          </button>
          <ChevronRight size={12} />
          <span className="text-slate-900">数据来源链路追踪</span>
        </div>
        <button 
          onClick={handleVerify}
          disabled={isVerifying}
          className={`px-6 py-2 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 active:scale-95 ${isVerifying ? 'opacity-50' : 'hover:bg-slate-800'}`}
        >
          {isVerifying ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
          {isVerifying ? '正在重新验证...' : '重新验证数据源'}
        </button>
      </div>
      
      <div className="bg-white p-12 border border-slate-200 shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck size={300} />
        </div>
        
        <div className="flex justify-between items-center mb-16 relative z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">数据采集证据链</h2>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Data Provenance Chain</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              数据已验证
            </span>
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              最后验证: {lastVerified}
            </div>
          </div>
        </div>
        
        <div className="relative space-y-16 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-slate-100 relative z-10">
          <div className="relative pl-16 group/item">
            <div className="absolute left-0 top-1 w-9 h-9 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-200 group-hover/item:bg-slate-900 group-hover/item:text-white transition-all duration-500">
              <Search size={16} />
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">步骤 1: 发现公告</div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">中国政府采购网 (ccgp.gov.cn)</div>
            <div className="text-xs text-slate-500 mt-2 italic font-serif">抓取时间: {lastVerified}</div>
            <div className="mt-4 p-4 bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-mono leading-relaxed break-all">
              GET https://www.ccgp.gov.cn/search/cr/20240325/t20240325_21789.htm
            </div>
          </div>
          
          <div className="relative pl-16 group/item">
            <div className="absolute left-0 top-1 w-9 h-9 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-200 group-hover/item:bg-slate-900 group-hover/item:text-white transition-all duration-500">
              <ExternalLink size={16} />
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">步骤 2: 自动跳转</div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">检测到跳转至：广东省公共资源交易平台</div>
            <div className="text-xs text-slate-500 mt-2 italic font-serif">URL: https://gdgpo.czt.gd.gov.cn/notice/view...</div>
            <div className="mt-4 p-4 bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-mono leading-relaxed break-all">
              跳转 302 -&gt; https://gdgpo.czt.gd.gov.cn/notice/view/123456
            </div>
          </div>
          
          <div className="relative pl-16 group/item">
            <div className="absolute left-0 top-1 w-9 h-9 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-200 group-hover/item:bg-slate-900 group-hover/item:text-white transition-all duration-500">
              <Download size={16} />
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">步骤 3: 附件回源</div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">成功获取 4 个原始附件，已完成 OCR 文本提取</div>
            <div className="text-xs text-slate-500 mt-2 italic font-serif">存储状态: 已加密存储于企业私有云 (AES-256)</div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 border border-slate-100 bg-slate-50/50 text-[10px] text-slate-500 flex items-center gap-3 font-mono">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                招标文件.pdf (MD5: a1b2c3d4...)
              </div>
              <div className="p-3 border border-slate-100 bg-slate-50/50 text-[10px] text-slate-500 flex items-center gap-3 font-mono">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                工程量清单.xlsx (MD5: e5f6g7h8...)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
