import React, { useEffect, useMemo, useState, useRef } from "react";
import { supportApi } from "../../api";
import { getApiErrorMessage } from "../../api/helpers.js";
import { useToast } from "../../components/ui/Toast.jsx";
import Modal from "../../components/ui/Modal.jsx";

// Helper to safely extract string ID from potential wrappers or objects
const extractId = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.$oid) return val.$oid;
    if (val._id) return extractId(val._id);
    if (val.id) return extractId(val.id);
    if (val.toString && typeof val.toString === "function" && val.toString() !== "[object Object]") {
      return val.toString();
    }
  }
  return String(val);
};

// Helper to extract tickets array from potential response shapes
const getTicketsFromResponse = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.supportRequests)) return payload.supportRequests;
  if (Array.isArray(payload.tickets)) return payload.tickets;
  if (payload.data && typeof payload.data === "object") {
    if (Array.isArray(payload.data.supportRequests)) return payload.data.supportRequests;
    if (Array.isArray(payload.data.tickets)) return payload.data.tickets;
    if (Array.isArray(payload.data.data)) return payload.data.data;
  }
  return [];
};

// Helper to extract a single ticket from potential response shapes
const getTicketFromResponse = (payload) => {
  if (!payload) return null;
  if (payload.support && typeof payload.support === "object") return payload.support;
  if (payload.supportRequest && typeof payload.supportRequest === "object") return payload.supportRequest;
  if (payload.ticket && typeof payload.ticket === "object") return payload.ticket;
  
  if (payload.data) {
    if (typeof payload.data === "object" && !Array.isArray(payload.data)) {
      if (payload.data.support && typeof payload.data.support === "object") return payload.data.support;
      if (payload.data.supportRequest && typeof payload.data.supportRequest === "object") return payload.data.supportRequest;
      if (payload.data.ticket && typeof payload.data.ticket === "object") return payload.data.ticket;
      return payload.data;
    }
  }
  return payload;
};

// Helper to normalize backend ticket structure
const normalizeSupportRequest = (req, index = 0) => {
  console.log("normalizeSupportRequest input:", req);
  const rawId = req?.id || req?._id;
  const id = extractId(rawId) || `support-req-${index}`;
  const name = req?.user_id?.name || req?.user?.name || req?.name || "Anonymous";
  const email = req?.user_id?.email || req?.user?.email || req?.email || "No Email";
  const title = req?.title || req?.subject || "No Title";
  const ticketNumber = req?.ticket_number || "";
  const status = req?.status || "open";
  const createdAt = req?.createdAt || req?.timestamp || null;

  const rawReplies = req?.replies || req?.messages || [];
  const replies = rawReplies.map((r, i) => {
    const replyRawId = r?.id || r?._id;
    return {
      id: extractId(replyRawId) || `reply-${i}`,
      message: r?.message || r?.text || r?.content || r?.body || "",
      sender: r?.sender || r?.sender_id || r?.userId || r?.adminId || null,
      sender_type: r?.sender_type || r?.senderType || "",
      role: r?.role || "",
      isAdmin: r?.isAdmin,
      createdAt: r?.createdAt || r?.timestamp || null
    };
  });

  return {
    id,
    name,
    email,
    title,
    ticketNumber,
    message: req?.message || title,
    status,
    createdAt,
    user: req?.user_id || req?.user || null,
    replies
  };
};

// Check if a message/reply is from an admin
const isReplyFromAdmin = (reply, ticketUser) => {
  if (reply.isAdmin !== undefined) return reply.isAdmin;
  if (reply.role === "admin" || reply.role === "superadmin") return true;
  if (reply.sender === "admin" || reply.senderRole === "admin") return true;
  if (reply.senderModel === "Admin") return true;

  const senderType = reply.sender_type || reply.senderType || "";
  if (senderType.toLowerCase() === "admin") return true;
  if (senderType.toLowerCase() === "user") return false;
  
  // Check if reply sender ID matches the ticket's user ID
  if (ticketUser && reply.sender) {
    const ticketUserId = ticketUser._id || ticketUser.id || ticketUser;
    const replySenderId = reply.sender._id || reply.sender.id || reply.sender;
    if (ticketUserId && replySenderId) {
      return replySenderId !== ticketUserId;
    }
  }
  return false;
};

export default function Support() {
  const { pushToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state for the selected ticket
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");

  // Input message state
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Status updates & deletes
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, row: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const messagesEndRef = useRef(null);

  // Fetch all support requests
  const fetchSupportRequests = async (keepSelection = false) => {
    if (!keepSelection) {
      setIsLoading(true);
    }
    setError("");
    try {
      const response = await supportApi.getSupportRequests();
      const rawData = getTicketsFromResponse(response);
      const validData = rawData.filter(item => item !== null && item !== undefined);
      const normalizedData = validData.map(normalizeSupportRequest);
      
      // Sort: latest tickets first
      normalizedData.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setTickets(normalizedData);

      // If we keep selection and there's a selected ticket, sync it
      if (keepSelection && selectedTicketId) {
        const updated = normalizedData.find(t => t.id === selectedTicketId);
        if (updated) {
          // Trigger silent update of details if selected
          fetchTicketDetails(selectedTicketId, true);
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load support requests."));
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch details of a selected ticket
  const fetchTicketDetails = async (id, silent = false) => {
    if (!silent) {
      setIsLoadingDetails(true);
      setErrorDetails("");
    }
    try {
      const response = await supportApi.getSupportTicketById(id);
      const ticketData = getTicketFromResponse(response);
      
      // Extract sibling messages array from backend response if present
      let rawReplies = [];
      if (response && Array.isArray(response.messages)) {
        rawReplies = response.messages;
      } else if (response?.data && Array.isArray(response.data.messages)) {
        rawReplies = response.data.messages;
      }
      
      const normalized = normalizeSupportRequest({
        ...ticketData,
        replies: rawReplies.length > 0 ? rawReplies : (ticketData?.replies || [])
      });

      // Preserve populated user info from list if detail API did not populate it
      const ticketInList = tickets.find(t => t.id === id);
      if (ticketInList) {
        normalized.name = normalized.name === "Anonymous" ? ticketInList.name : normalized.name;
        normalized.email = normalized.email === "No Email" ? ticketInList.email : normalized.email;
        normalized.title = normalized.title === "No Title" ? ticketInList.title : normalized.title;
        normalized.ticketNumber = normalized.ticketNumber === "" ? ticketInList.ticketNumber : normalized.ticketNumber;
        normalized.user = normalized.user === null ? ticketInList.user : normalized.user;
      }

      setSelectedTicketDetails(normalized);
    } catch (err) {
      if (!silent) {
        setErrorDetails(getApiErrorMessage(err, "Failed to load ticket conversation."));
      }
    } finally {
      if (!silent) {
        setIsLoadingDetails(false);
      }
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  // Poll details when ticket selection changes
  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetails(selectedTicketId);
    } else {
      setSelectedTicketDetails(null);
    }
  }, [selectedTicketId]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicketDetails?.replies, selectedTicketDetails?.message]);

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await supportApi.updateSupportTicketStatus(id, newStatus);
      
      // Update in main list
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );

      // Update in details view
      if (selectedTicketDetails && selectedTicketDetails.id === id) {
        setSelectedTicketDetails((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }

      pushToast(`Status updated to "${newStatus.replace("_", " ")}"`, "success");
    } catch (err) {
      pushToast(getApiErrorMessage(err, "Failed to update status."), "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle reply submission
  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicketId || isSendingReply) return;

    const messageToSend = replyText.trim();
    setIsSendingReply(true);
    setReplyText(""); // clear input optimistically

    // Optimistic UI updates
    const tempReply = {
      id: `temp-${Date.now()}`,
      message: messageToSend,
      isAdmin: true,
      sender: "admin",
      createdAt: new Date().toISOString()
    };

    setSelectedTicketDetails(prev => {
      if (!prev) return null;
      return {
        ...prev,
        replies: [...prev.replies, tempReply]
      };
    });

    try {
      await supportApi.replyToSupportTicket(selectedTicketId, messageToSend);
      // Fetch full details silently to get the real backend object
      await fetchTicketDetails(selectedTicketId, true);
      // Refresh list to update message previews
      fetchSupportRequests(true);
    } catch (err) {
      pushToast(getApiErrorMessage(err, "Failed to send reply."), "error");
      // Rollback optimistic update
      fetchTicketDetails(selectedTicketId, true);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Handle ticket delete
  const handleDeleteTicket = async () => {
    if (!deleteModal.row) return;
    setIsDeleting(true);
    try {
      await supportApi.deleteSupportRequest(deleteModal.row.id);
      setTickets((prev) => prev.filter((t) => t.id !== deleteModal.row.id));
      if (selectedTicketId === deleteModal.row.id) {
        setSelectedTicketId(null);
      }
      pushToast("Support request deleted successfully.", "success");
      setDeleteModal({ open: false, row: null });
    } catch (err) {
      pushToast(getApiErrorMessage(err, "Failed to delete support request."), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search computation
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        filterStatus === "all" || ticket.status === filterStatus;
      
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        ticket.name.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query) ||
        ticket.message.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [tickets, filterStatus, searchQuery]);

  // Formatter helpers
  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      // If today, return time. Else, return date
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-15.5rem)] h-auto min-h-[600px] animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Desk</h1>
          <p className="text-sm text-slate-500">Communicate directly with users and manage support issues.</p>
        </div>
        <button
          onClick={() => fetchSupportRequests(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Sync Desk
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in flex items-center justify-between flex-shrink-0">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-rose-900 font-bold text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Main Support Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Left Side: Ticket Queue (Col Span 4 / 12) */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col h-full min-h-0 bg-slate-50/50 overflow-hidden">
          
          {/* Search & Tabs */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, query..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 bg-slate-50 transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {["all", "open", "resolved", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition ${
                    filterStatus === status
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Queue List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
            {isLoading ? (
              // Loader placeholders
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="rounded-full bg-slate-200 h-10 w-10 flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 h-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.233 2.233 0 01-2.183-.556L12 15.302l-6.656 3.587A2.233 2.233 0 013.16 19.44l-.01-.005a2.247 2.247 0 01-.15-3.87l6.652-3.585a2.25 2.25 0 012.136 0l6.652 3.585a2.247 2.247 0 01-.15 3.87l-.01.005z" />
                </svg>
                <div className="text-sm font-semibold">No tickets found</div>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search.</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isActive = ticket.id === selectedTicketId;
                const statusColors =
                  ticket.status === "open"
                    ? "bg-blue-500 text-blue-50"
                    : ticket.status === "resolved"
                    ? "bg-amber-500 text-amber-50"
                    : "bg-emerald-500 text-emerald-50";

                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full p-4 flex gap-3 text-left transition select-none items-start hover:bg-slate-100/50 ${
                      isActive ? "bg-slate-100 border-l-4 border-slate-900" : ""
                    }`}
                  >
                    {/* Avatar Initials */}
                    <div className="h-10 w-10 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm tracking-tight shadow-inner">
                      {getInitials(ticket.name)}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h2 className="text-sm font-bold text-slate-900 truncate">{ticket.name}</h2>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{formatTime(ticket.createdAt)}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 truncate mb-1">{ticket.title}</p>
                      {ticket.ticketNumber && (
                        <p className="text-[10px] text-slate-400 font-mono mb-1">{ticket.ticketNumber}</p>
                      )}
                      
                      {/* Badge / Metadata */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider capitalize ${statusColors}`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{ticket.email}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Screen (Col Span 8 / 12) */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-0 bg-slate-50/20 overflow-hidden">
          {selectedTicketId ? (
            // Active Conversation state
            <div className="flex flex-col h-full min-h-0 overflow-hidden">
              
              {/* Conversation Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow">
                    {selectedTicketDetails ? getInitials(selectedTicketDetails.name) : "?"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {selectedTicketDetails?.name || "Loading..."}
                    </h3>
                    <p className="text-xs text-slate-500 truncate max-w-xs md:max-w-md">
                      {selectedTicketDetails?.email}
                      {selectedTicketDetails?.ticketNumber && ` • Ref: ${selectedTicketDetails.ticketNumber}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Dropdown */}
                  {selectedTicketDetails && (
                    <select
                      value={selectedTicketDetails.status}
                      onChange={(e) => handleStatusChange(selectedTicketDetails.id, e.target.value)}
                      disabled={isUpdatingStatus}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-50 transition cursor-pointer ${
                        selectedTicketDetails.status === "open"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : selectedTicketDetails.status === "resolved"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <option value="open">Open</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  )}

                  {/* Refresh Details Button */}
                  <button
                    onClick={() => fetchTicketDetails(selectedTicketId)}
                    title="Reload thread"
                    className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeleteModal({ open: true, row: selectedTicketDetails })}
                    title="Delete Request"
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg border border-rose-200 bg-white shadow-sm transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-slate-50/20">
                {isLoadingDetails ? (
                  // Detail Loader
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="h-10 bg-slate-200 rounded-lg w-1/2 animate-pulse" />
                    </div>
                    <div className="flex justify-end">
                      <div className="h-10 bg-slate-300 rounded-lg w-1/3 animate-pulse" />
                    </div>
                    <div className="flex justify-start">
                      <div className="h-12 bg-slate-200 rounded-lg w-2/5 animate-pulse" />
                    </div>
                  </div>
                ) : errorDetails ? (
                  <div className="text-center p-6 text-rose-600 bg-rose-50 rounded-xl border border-rose-100 my-4">
                    {errorDetails}
                  </div>
                ) : selectedTicketDetails ? (
                  <div className="space-y-4">
                    {/* Ticket Title & User Card */}
                    <div className="bg-slate-100/60 border border-slate-200/50 rounded-2xl p-4 mb-4 text-sm text-slate-700 shadow-sm animate-fade-in">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-base">{selectedTicketDetails.title}</span>
                        {selectedTicketDetails.ticketNumber && (
                          <span className="inline-flex items-center rounded-lg bg-slate-200 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-700">
                            {selectedTicketDetails.ticketNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Opened by <span className="font-medium text-slate-700">{selectedTicketDetails.name}</span> ({selectedTicketDetails.email}) on {selectedTicketDetails.createdAt ? new Date(selectedTicketDetails.createdAt).toLocaleString() : "N/A"}
                      </p>
                    </div>

                    {/* User's Original Message (Opening Bubble) - only shown if not duplicated in replies */}
                    {selectedTicketDetails.message && typeof selectedTicketDetails.message === "string" && (!selectedTicketDetails.replies || !selectedTicketDetails.replies.some(
                      (r) => r?.message && typeof r.message === "string" && r.message.trim().toLowerCase() === selectedTicketDetails.message.trim().toLowerCase()
                    )) && (
                      <div className="flex items-start gap-2.5 max-w-[85%] animate-fade-in">
                        <div className="h-8 w-8 rounded-lg bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {getInitials(selectedTicketDetails.name)}
                        </div>
                        <div className="space-y-1">
                          <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {selectedTicketDetails.message}
                          </div>
                          <div className="text-[10px] text-slate-400 pl-1">
                            {selectedTicketDetails.name} • {formatTime(selectedTicketDetails.createdAt)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies Timeline */}
                    {selectedTicketDetails.replies.map((reply, idx) => {
                      const isSelf = isReplyFromAdmin(reply, selectedTicketDetails.user || selectedTicketDetails);
                      const bubbleColor = isSelf
                        ? "bg-slate-900 text-white"
                        : "bg-white border border-slate-200 text-slate-800";
                      const alignClass = isSelf ? "justify-end ml-auto" : "justify-start";
                      const shapeClass = isSelf ? "rounded-tr-none" : "rounded-tl-none";

                      return (
                        <div key={reply.id || reply._id || `reply-${idx}`} className={`flex items-start gap-2.5 max-w-[85%] ${alignClass}`}>
                          {!isSelf && (
                            <div className="h-8 w-8 rounded-lg bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                              {getInitials(selectedTicketDetails.name)}
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className={`${bubbleColor} p-3 rounded-2xl ${shapeClass} shadow-sm text-sm whitespace-pre-wrap break-words leading-relaxed`}>
                              {reply.message}
                            </div>
                            <div className={`text-[10px] text-slate-400 pl-1 ${isSelf ? "text-right pr-1" : ""}`}>
                              {isSelf ? "Admin" : selectedTicketDetails.name} • {formatTime(reply.createdAt)}
                            </div>
                          </div>
                          {isSelf && (
                            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-inner">
                              AD
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Dummy element for scroll auto anchor */}
                    <div ref={messagesEndRef} />
                  </div>
                ) : null}
              </div>

              {/* Chat Input Box */}
              {selectedTicketDetails && (
                <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
                  <form onSubmit={handleSendReply} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={isSendingReply || selectedTicketDetails.status === "closed"}
                      placeholder={
                        selectedTicketDetails.status === "closed"
                          ? "This ticket is closed. Reopen status to reply."
                          : "Type your reply..."
                      }
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSendingReply || selectedTicketDetails.status === "closed"}
                      className="inline-flex items-center justify-center h-10 w-10 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-50 disabled:hover:bg-slate-900 flex-shrink-0 shadow"
                    >
                      {isSendingReply ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-white" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            // No Selected Ticket (Empty State)
            <div className="flex flex-col items-center justify-center p-12 text-center h-full bg-radial-gradient">
              <div className="rounded-full bg-slate-100 p-4 border border-slate-200/50 shadow-inner mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.084.18.125.378.125.578v11.011a2.25 2.25 0 01-2.25 2.25H5.875a2.25 2.25 0 01-2.25-2.25V9.089c0-.2.041-.397.125-.578m16.5 0L12 3.75 3.375 8.511m16.5 0L12 13.25 3.375 8.511" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800">No ticket selected</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Select a user request from the sidebar to review the full details, update the status, and reply directly.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Delete Ticket Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        title="Delete Support Request"
        onClose={() => setDeleteModal({ open: false, row: null })}
        actions={
          <>
            <button
              onClick={() => setDeleteModal({ open: false, row: null })}
              disabled={isDeleting}
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTicket}
              disabled={isDeleting}
              type="button"
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        {deleteModal.row && (
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete the support request from{" "}
            <span className="font-semibold text-slate-900">{deleteModal.row.name}</span> ({deleteModal.row.email})?
            This action will wipe out the ticket thread history and cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
