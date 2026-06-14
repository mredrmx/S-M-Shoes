"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Simge Bileşenleri
const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966-1.862-1.865-4.336-2.89-6.969-2.89-5.442 0-9.866 4.372-9.87 9.802 0 1.763.476 3.484 1.381 5.02l-.995 3.637 3.744-.955zM17.15 14.54c-.282-.141-1.666-.822-1.924-.916-.258-.094-.446-.141-.634.141-.188.281-.727.916-.891 1.101-.164.186-.328.21-.61.07-2.8-.14-3.874-1.503-4.52-2.622-.283-.487-.03-.75.252-1.03.253-.252.564-.656.845-.984.094-.117.164-.21.235-.328.07-.117.035-.234-.018-.351-.053-.117-.446-1.078-.61-1.477-.16-.386-.324-.328-.446-.328-.117-.006-.252-.006-.387-.006s-.351.053-.535.253c-.184.2-.704.688-.704 1.68s.722 1.953.823 2.088c.101.135 1.42 2.169 3.441 3.042.48.208.855.33 1.147.424.483.153.923.131 1.27.079.387-.059 1.666-.68 1.9-.1.233-.563.233-.961.164-1.031-.07-.07-.258-.117-.54-.258z"/>
  </svg>
);

type Message = { id: number; senderId: number; receiverId: number; content: string; createdAt: string };
type ChatUser = { id: number; name: string; surname: string; email: string; lastActive?: string };

export default function ChatPopup() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Ortak state'ler
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{ id: number; name: string; surname: string; isOnline: boolean } | null>(null);

  // Admin paneli için state'ler
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Otomatik aşağı kaydırma
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Mesajları ve kullanıcıları çekme
  const syncChat = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    try {
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      const role = user.role.toLowerCase();
      if (role !== "admin") {
        // Müşteri: Mesajları ve admin online bilgisini al
        setMessages(data.messages || []);
        if (data.admin) {
          setAdminInfo(data.admin);
        }
      } else {
        // Admin: Mesajları al, eğer kullanıcı seçiliyse onunla olanları filtrele
        if (selectedUser) {
          const filtered = data.messages.filter(
            (m: Message) => (m.senderId === user.id && m.receiverId === selectedUser.id) || 
                            (m.senderId === selectedUser.id && m.receiverId === user.id)
          );
          setMessages(filtered);
        }
      }
    } catch {
      // Sessiz hata
    }
  }, [user, selectedUser]);

  // Admin için kullanıcı listesini çekme
  const fetchChatUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || user?.role?.toLowerCase() !== "admin") return;
    try {
      const res = await fetch("/api/messages/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChatUsers(data.users || []);
      }
    } catch {
      // Sessiz hata
    }
  }, [user]);

  // Periyodik senkronizasyon (Canlı sohbet hissi için her 4 saniyede bir)
  useEffect(() => {
    if (!isOpen || !user) return;
    syncChat();
    if (user.role.toLowerCase() === "admin") {
      fetchChatUsers();
    }

    const interval = setInterval(() => {
      syncChat();
      if (user.role.toLowerCase() === "admin") {
        fetchChatUsers();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, user, syncChat, fetchChatUsers]);

  // Admin için arka plan aktiflik pingi (Popup kapalı olsa dahi adminin çevrimiçi görünmesi için)
  useEffect(() => {
    if (!user || user.role.toLowerCase() !== "admin") return;

    const pingAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await fetch("/api/messages?ping=true", {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // Sessiz hata
      }
    };

    // İlk yüklemede çalıştır
    pingAdmin();

    // Her 45 saniyede bir ping gönder
    const interval = setInterval(pingAdmin, 45000);
    return () => clearInterval(interval);
  }, [user]);

  // Müşteriler ve misafirler için adminin çevrimiçi durumunu periyodik kontrol etme (Popup kapalı olsa dahi yeşil nokta güncellemesi için)
  useEffect(() => {
    if (user && user.role.toLowerCase() === "admin") return; // Admin ise gerek yok
    
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await fetch("/api/messages?ping=true", { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.admin) {
            setAdminInfo(data.admin);
          }
        }
      } catch {
        // Sessiz hata
      }
    };

    // İlk yüklemede çalıştır
    checkAdminStatus();

    // Her 60 saniyede bir kontrol et
    const interval = setInterval(checkAdminStatus, 60000);
    return () => clearInterval(interval);
  }, [user, isOpen]);

  // Kullanıcı seçildiğinde mesajları çek
  useEffect(() => {
    if (selectedUser) {
      syncChat();
    }
  }, [selectedUser, syncChat]);

  // Mesaj gönderme
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !user || !content.trim()) return;

    let targetReceiverId: number | null = null;
    if (user.role.toLowerCase() === "admin") {
      if (!selectedUser) return;
      targetReceiverId = selectedUser.id;
    } else {
      if (!adminInfo) return;
      targetReceiverId = adminInfo.id;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: targetReceiverId,
          content: content.trim()
        })
      });
      
      if (!res.ok) throw new Error("Mesaj gönderilemedi.");
      
      setContent('');
      syncChat();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (u: ChatUser) => {
    setSelectedUser(u);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Genişletilmiş Canlı Destek Kutusu */}
      {isOpen && (
        <div className="w-[340px] h-[460px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <header className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-950 p-4 text-white flex items-center justify-between shadow-md">
            <div>
              {!user ? (
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Destek Merkezi</h3>
              ) : user.role.toLowerCase() === "admin" ? (
                selectedUser ? (
                  <button onClick={() => setSelectedUser(null)} className="flex items-center gap-1.5 text-xs font-bold text-blue-100 hover:text-white transition-colors">
                    ← Geri ({selectedUser.name})
                  </button>
                ) : (
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Canlı Destek Paneli</h3>
                )
              ) : (
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Müşteri Hizmetleri</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    {adminInfo?.isOnline ? (
                      <span className="flex items-center gap-1 text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Çevrimiçi
                      </span>
                    ) : (
                      <span className="text-gray-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Çevrimdışı (Mesaj Bırakın)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors focus:outline-none"
            >
              <XIcon />
            </button>
          </header>

          {/* Main Body */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col">
            
            {/* WhatsApp Hızlı İletişim Butonu (Herkes için görünür) */}
            {(!user || user.role.toLowerCase() !== "admin") && (
              <a
                href="https://wa.me/905551112233?text=Merhaba,%20bir%20sorum%20vard%C4%B1."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white font-extrabold text-xs tracking-wider rounded-2xl shadow-md shadow-emerald-500/10 transition-all mb-4 uppercase shrink-0"
              >
                <WhatsAppIcon />
                <span>WhatsApp İletişim</span>
              </a>
            )}

            {/* İçerik */}
            {!user ? (
              /* Giriş Yapmamış Kullanıcı */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4 my-auto">
                <span className="text-3xl">💬</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">
                  Canlı destek sistemimiz üzerinden bizimle mesajlaşmak için lütfen hesabınıza giriş yapın.
                </p>
                <Link
                  href="/login?returnUrl=/"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Giriş Yap
                </Link>
              </div>
            ) : user.role.toLowerCase() === "admin" && !selectedUser ? (
              /* Admin: Kullanıcı Seçim Listesi */
              chatUsers.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-gray-400 text-xs italic my-auto">
                  Henüz başlatılmış bir canlı destek sohbeti bulunmuyor.
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Aktif Görüşmeler</h4>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {chatUsers.map(u => {
                      const isUserActive = u.lastActive ? (new Date().getTime() - new Date(u.lastActive).getTime() < 1000 * 60 * 3) : false;
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleUserSelect(u)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-left transition-colors cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{u.name} {u.surname}</p>
                            <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                          </div>
                          
                          {/* Aktiflik Noktası */}
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isUserActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ) : (
              /* Müşteri Sohbet Penceresi OR Admin Seçili Sohbet Ekranı */
              <div className="flex-1 flex flex-col space-y-3">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-gray-400 text-xs italic my-auto">
                    {user.role.toLowerCase() === "admin" 
                      ? "Müşteri ile sohbete başlayın." 
                      : "Destek ekibimize mesaj gönderin. Size yardımcı olmaktan mutluluk duyacağız!"}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-2.5 overflow-y-auto pr-1">
                    {messages.map((msg) => {
                      const isOwnMessage = msg.senderId === user.id;
                      return (
                        <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm
                            ${isOwnMessage 
                              ? 'bg-blue-600 text-white rounded-br-none' 
                              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-150 rounded-bl-none border border-gray-100 dark:border-gray-800'
                            }
                          `}>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Input Footer */}
          {user && (user.role.toLowerCase() !== "admin" || selectedUser) && (
            <footer className="p-3 border-t border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-750 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                />
                
                <button 
                  type="submit" 
                  disabled={loading || !content.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <SendIcon />
                </button>
              </form>
              
              {error && <p className="text-[10px] text-red-500 font-bold mt-1 text-center">{error}</p>}
            </footer>
          )}

        </div>
      )}

      {/* Pop-up Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none relative group cursor-pointer"
        aria-label="Mesajları Aç"
      >
        <MessageSquareIcon className="h-6 w-6" />
        
        {/* Çevrimiçi Admin Bildirim Noktası (Müşteri için) */}
        {adminInfo?.isOnline && !isOpen && (!user || user.role.toLowerCase() !== "admin") && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-950 rounded-full" />
        )}
      </button>
    </div>
  );
}