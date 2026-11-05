import { useState } from "react";
import { format } from "date-fns";
import { useHistory } from "@/hooks/use-history";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Calendar, ChevronRight, History as HistoryIcon, LogOut, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { CopyButton } from "./CopyButton";
import { Button } from "./ui/button";

export function HistoryView() {
    const { data: history, isLoading } = useHistory();
    const { user, logout } = useAuth();
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!history || history.length === 0) {
        return (
            <div className="text-center p-12 glass-card rounded-2xl">
                <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No history yet</h3>
                <p className="text-slate-500 mt-2">Generate or improve posts to see them here.</p>
                <div className="mt-6 flex justify-center">
                    <Button variant="outline" onClick={logout} className="flex gap-2 items-center"><LogOut className="w-4 h-4" /> Logout ({user?.name})</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Your History</h2>
                <Button variant="ghost" onClick={logout} className="text-slate-500"><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
            </div>

            <div className="grid gap-4">
                {history.map((item: any) => (
                    <div
                        key={item._id}
                        onClick={() => setSelectedItem(item)}
                        className="glass-card rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-start justify-between group border border-slate-200"
                    >
                        <div className="space-y-2 max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.type === 'generate' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {item.type}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(item.createdAt), "MMM d, yyyy • h:mm a")}
                                </span>
                            </div>
                            <p className="text-slate-700 font-medium line-clamp-2 text-sm">
                                "{item.inputText}"
                            </p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
                    <Dialog.Content className="fixed inset-4 md:inset-10 z-50 bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col outline-none">
                        <div className="p-4 md:p-6 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
                            <div className="max-w-[70%]">
                                <h3 className="font-bold text-lg md:text-xl text-slate-800">History Details</h3>
                                <p className="text-sm text-slate-500 truncate">"{selectedItem?.inputText}"</p>
                            </div>
                            <Dialog.Close asChild>
                                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-8 bg-slate-50/50">
                            {selectedItem?.outputs?.map((out: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <span className="font-bold text-slate-700 tracking-wide text-sm">OPTION {idx + 1}</span>
                                        <CopyButton text={out.text || out.content || ""} />
                                    </div>
                                    <div className="whitespace-pre-wrap text-slate-700 text-[15px] leading-relaxed">
                                        {out.text || out.content}
                                    </div>
                                    {(out.image || out.imageUrl) && (
                                        <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner flex flex-col gap-2 p-2">
                                            <img src={out.image || out.imageUrl} alt="Generated visual" className="w-full h-auto max-h-[400px] object-contain rounded-lg" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
