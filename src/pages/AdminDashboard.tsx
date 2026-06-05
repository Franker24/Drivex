import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, Booking, Inquiry, GarageItem, User } from '../services/db';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(db.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'bookings' | 'inquiries' | 'garage'>('bookings');
  
  // Data lists
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [garageItems, setGarageItems] = useState<GarageItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || currentUser.role !== 'admin') {
      return;
    }

    // Load data
    loadAllData();
  }, [currentUser]);

  const loadAllData = () => {
    setBookings(db.getBookings());
    setInquiries(db.getInquiries());
    setGarageItems(db.getGarage());
    setUsers(db.getUsers());
  };

  const handleBookingStatus = (id: string, status: 'approved' | 'rejected') => {
    db.updateBookingStatus(id, status);
    loadAllData();
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Are you sure you want to delete this booking log?')) {
      db.deleteBooking(id);
      loadAllData();
    }
  };

  const handleInquiryStatus = (id: string, status: 'read' | 'unread') => {
    db.updateInquiryStatus(id, status);
    loadAllData();
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      db.deleteInquiry(id);
      loadAllData();
    }
  };

  const handleDeleteGarageItem = (id: string) => {
    if (confirm('Are you sure you want to delete this configuration build?')) {
      db.deleteGarageItem(id);
      loadAllData();
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 relative shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-[80px]" />
          <span className="material-symbols-outlined text-6xl text-red-500 mb-6 animate-pulse">gavel</span>
          <h2 className="text-2xl font-bold uppercase tracking-wide">Access Denied</h2>
          <p className="text-white/60 text-sm max-w-sm mt-3 mb-8">
            You do not have administrative privileges to access the Concierge Dashboard. Please log in with an administrator account.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                db.logout();
                window.dispatchEvent(new Event('auth_change'));
                navigate('/');
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs px-8 py-3.5 rounded-xl uppercase tracking-wider transition-all duration-300 cursor-pointer"
            >
              Sign Out & Go Home
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-white/60 hover:text-white text-xs underline cursor-pointer"
            >
              Back to Home Screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const approvedBookings = bookings.filter(b => b.status === 'approved').length;
  const unreadInquiries = inquiries.filter(i => i.status === 'unread').length;
  const totalGarageConfigs = garageItems.length;
  const totalClients = users.filter(u => u.role === 'client').length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white antialiased pb-24 pt-28 px-grid-margin">
      <div className="max-w-container-max-width mx-auto">
        
        {/* Top Header Row */}
        <div className="mb-10 border-b border-white/10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="font-label-caps text-[10px] text-secondary-fixed-dim block mb-3 uppercase tracking-widest font-bold">
              Concierge Administration
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              CONCIERGE DASHBOARD
            </h1>
            <p className="text-white/60 text-sm mt-2 max-w-2xl">
              Oversee client test drive bookings, review bespoke configurations saved in virtual garages, and manage inquiry forms.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-xl self-start lg:self-auto">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <div className="text-xs">
              <span className="text-white/40">Logged in as: </span>
              <span className="font-semibold text-secondary-fixed-dim">{currentUser.name} (Admin)</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 text-white/10">
              <span className="material-symbols-outlined text-4xl">calendar_today</span>
            </div>
            <p className="text-white/40 text-[10px] font-label-caps tracking-wider uppercase">Bookings</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {totalBookings}
            </h3>
            <p className="text-xs text-white/50 mt-1.5 flex gap-2">
              <span className="text-emerald-400 font-semibold">{approvedBookings} Approved</span>
              <span>•</span>
              <span className="text-yellow-400 font-semibold">{pendingBookings} Pending</span>
            </p>
          </div>

          <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 text-white/10">
              <span className="material-symbols-outlined text-4xl">mail</span>
            </div>
            <p className="text-white/40 text-[10px] font-label-caps tracking-wider uppercase">Unread Mails</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {unreadInquiries}
            </h3>
            <p className="text-xs text-white/50 mt-1.5">
              Out of {inquiries.length} total messages
            </p>
          </div>

          <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 text-white/10">
              <span className="material-symbols-outlined text-4xl">garage_home</span>
            </div>
            <p className="text-white/40 text-[10px] font-label-caps tracking-wider uppercase">Garage Specs</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {totalGarageConfigs}
            </h3>
            <p className="text-xs text-white/50 mt-1.5">
              Saved client configurations
            </p>
          </div>

          <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 text-white/10">
              <span className="material-symbols-outlined text-4xl">group</span>
            </div>
            <p className="text-white/40 text-[10px] font-label-caps tracking-wider uppercase">Active Clients</p>
            <h3 className="text-3xl font-black text-white mt-2">
              {totalClients}
            </h3>
            <p className="text-xs text-white/50 mt-1.5">
              Registered customers
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-white/10 mb-8 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3.5 text-xs font-label-caps tracking-wider uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-secondary-fixed-dim text-secondary-fixed-dim font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>Test Drives ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-3.5 text-xs font-label-caps tracking-wider uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-secondary-fixed-dim text-secondary-fixed-dim font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">forum</span>
            <span>Inquiries ({unreadInquiries} new)</span>
          </button>

          <button
            onClick={() => setActiveTab('garage')}
            className={`px-6 py-3.5 text-xs font-label-caps tracking-wider uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'garage'
                ? 'border-secondary-fixed-dim text-secondary-fixed-dim font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">room_preferences</span>
            <span>Saved Garage Builds ({garageItems.length})</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="overflow-x-auto">
              {bookings.length === 0 ? (
                <div className="p-12 text-center text-white/40">
                  <p className="text-sm">No test drive bookings registered in system.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[9px] font-label-caps tracking-wider uppercase bg-white/5">
                      <th className="p-4 pl-6">Client Info</th>
                      <th className="p-4">Car Config</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Notes</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="font-semibold text-white">{booking.name}</p>
                          <p className="text-white/50 text-[10px] mt-0.5">{booking.email}</p>
                          <p className="text-white/50 text-[10px]">{booking.phone}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-white/10 border border-white/5 rounded-md text-[11px] font-semibold text-white/90">
                            {booking.carName}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{new Date(booking.date + 'T12:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                          <p className="text-white/50 text-[10px] mt-0.5">{booking.timeSlot}</p>
                        </td>
                        <td className="p-4 max-w-xs truncate" title={booking.notes}>
                          {booking.notes || <span className="text-white/20">No special requests</span>}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            booking.status === 'approved' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : booking.status === 'rejected'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleBookingStatus(booking.id, 'approved')}
                                  className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 flex items-center justify-center transition-all cursor-pointer"
                                  title="Approve Booking"
                                >
                                  <span className="material-symbols-outlined text-sm">check</span>
                                </button>
                                <button
                                  onClick={() => handleBookingStatus(booking.id, 'rejected')}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                                  title="Reject Booking"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="w-8 h-8 rounded-lg bg-white/5 text-white/50 hover:text-red-400 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Record"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="overflow-x-auto">
              {inquiries.length === 0 ? (
                <div className="p-12 text-center text-white/40">
                  <p className="text-sm">No inquiry submissions recorded.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[9px] font-label-caps tracking-wider uppercase bg-white/5">
                      <th className="p-4 pl-6">Sender</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Submitted</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {inquiries.map((inquiry) => (
                      <tr 
                        key={inquiry.id} 
                        className={`hover:bg-white/5 transition-colors ${
                          inquiry.status === 'unread' ? 'font-semibold bg-white/[0.02]' : 'text-white/60'
                        }`}
                      >
                        <td className="p-4 pl-6">
                          <p className="text-white font-medium">{inquiry.name}</p>
                          <p className="text-white/50 text-[10px] mt-0.5">{inquiry.email}</p>
                        </td>
                        <td className="p-4 font-semibold text-white max-w-[160px] truncate">{inquiry.subject}</td>
                        <td className="p-4 max-w-sm truncate whitespace-normal" title={inquiry.message}>{inquiry.message}</td>
                        <td className="p-4 text-white/50">
                          {new Date(inquiry.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            inquiry.status === 'unread' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-white/10 text-white/50 border border-white/10'
                          }`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {inquiry.status === 'unread' ? (
                              <button
                                onClick={() => handleInquiryStatus(inquiry.id, 'read')}
                                className="w-8 h-8 rounded-lg bg-white/5 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                title="Mark as Read"
                              >
                                <span className="material-symbols-outlined text-sm font-bold">drafts</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleInquiryStatus(inquiry.id, 'unread')}
                                className="w-8 h-8 rounded-lg bg-white/5 text-white/40 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                title="Mark as Unread"
                              >
                                <span className="material-symbols-outlined text-sm">mail</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteInquiry(inquiry.id)}
                              className="w-8 h-8 rounded-lg bg-white/5 text-white/50 hover:text-red-400 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Message"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: GARAGE CONFIGS */}
          {activeTab === 'garage' && (
            <div className="overflow-x-auto">
              {garageItems.length === 0 ? (
                <div className="p-12 text-center text-white/40">
                  <p className="text-sm">No customized vehicle configurations saved yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[9px] font-label-caps tracking-wider uppercase bg-white/5">
                      <th className="p-4 pl-6">Client ID</th>
                      <th className="p-4">Model</th>
                      <th className="p-4">Bespoke Options</th>
                      <th className="p-4 font-semibold text-right">Total Price</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {garageItems.map((item) => {
                      const client = users.find(u => u.id === item.userId);
                      return (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 pl-6">
                            <p className="font-semibold text-white">{client?.name || 'Anonymous Client'}</p>
                            <p className="text-white/50 text-[10px] mt-0.5">{client?.email || `ID: ${item.userId}`}</p>
                          </td>
                          <td className="p-4 font-semibold text-white">{item.carName}</td>
                          <td className="p-4 space-y-1">
                            <p className="text-white/80 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{backgroundColor: item.paint.hex}} />
                              <span>Paint: {item.paint.name}</span>
                            </p>
                            <p className="text-white/60">
                              <span>Wheels: {item.wheels.name}</span>
                            </p>
                            <p className="text-white/60">
                              <span>Interior: {item.interior.name}</span>
                            </p>
                          </td>
                          <td className="p-4 font-semibold text-white text-right font-headline-md text-[14px]">
                            {formatPrice(item.totalPrice)}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              onClick={() => handleDeleteGarageItem(item.id)}
                              className="w-8 h-8 rounded-lg bg-white/5 text-white/50 hover:text-red-400 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                              title="Remove Config"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
