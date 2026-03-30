import React from 'react';
import { Search, ExternalLink, Download, ChevronRight } from 'lucide-react';

interface SourceLinkProps {
  onBack: () => void;
}

export const SourceLink = ({ onBack }: SourceLinkProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-slate-900 transition-colors">项目详情</button>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium">来源链路追踪</span>
      </div>
      
      <div className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold text-slate-900">数据采集证据链</h2>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
            数据已验证
          </span>
        </div>
        
        <div className="relative space-y-12 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-blue-200">
              <Search size={14} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Step 1: 发现公告</div>
            <div className="text-base font-bold text-slate-900">中国政府采购网 (ccgp.gov.cn)</div>
            <div className="text-xs text-slate-500 mt-1 italic">抓取时间: 2024-03-25 09:15:02</div>
            <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-500 font-mono">
              GET https://www.ccgp.gov.cn/search/cr/20240325/t20240325_21789.htm
            </div>
          </div>
          
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-amber-200">
              <ExternalLink size={14} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Step 2: 自动跳转</div>
            <div className="text-base font-bold text-slate-900">检测到跳转至：广东省公共资源交易平台</div>
            <div className="text-xs text-slate-500 mt-1 italic">URL: https://gdgpo.czt.gd.gov.cn/notice/view...</div>
            <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-500 font-mono">
              REDIRECT 302 -&gt; https://gdgpo.czt.gd.gov.cn/notice/view/123456
            </div>
          </div>
          
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-emerald-200">
              <Download size={14} />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Step 3: 附件回源</div>
            <div className="text-base font-bold text-slate-900">成功获取 4 个原始附件，已完成 OCR 文本提取</div>
            <div className="text-xs text-slate-500 mt-1 italic">存储状态: 已加密存储于企业私有云 (AES-256)</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-2 border border-slate-100 rounded text-[10px] text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                招标文件.pdf (MD5: a1b2c3d4...)
              </div>
              <div className="p-2 border border-slate-100 rounded text-[10px] text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                工程量清单.xlsx (MD5: e5f6g7h8...)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
