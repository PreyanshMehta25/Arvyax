import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getUserSessions,
  deleteSession,
  toggleLiveStatus,
  Session,
} from "../services/sessionServices";
import {
  Plus,
  Clock,
  Edit3,
  Trash2,
  Zap,
  ZapOff,
  Loader2,
  Copy,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

const MySessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await getUserSessions();
      setSessions(response.data);
    } catch (error) {
      toast.error("Could not load your sessions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this session? This action cannot be undone."
      )
    ) {
      try {
        await deleteSession(id);
        toast.success("Session deleted successfully!");
        setSessions(sessions.filter((session) => session._id !== id));
      } catch (error) {
        toast.error("Failed to delete session.");
      }
    }
  };

  const handleToggleLive = async (id: string) => {
    try {
      const response = await toggleLiveStatus(id);
      setSessions(sessions.map((s) => (s._id === id ? response.data : s)));
      toast.success(
        `Session is now ${response.data.isLive ? "live" : "offline"}!`
      );
    } catch (error) {
      toast.error("Failed to update live status.");
    }
  };

  const handleCopyUrl = (url: string) => {
    if (!url) {
      toast.error("No URL to copy.");
      return;
    }
    navigator.clipboard.writeText(url);
    toast.success("JSON URL copied to clipboard!");
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
          <p className="text-gray-600">Manage your wellness sessions</p>
        </div>
        <Link
          to="/editor"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" /> New Session
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {session.title || "Untitled Session"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      {session.viewCount / 2 || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          session.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(session.updated_at)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleCopyUrl(session.json_file_url)}
                          className="inline-flex items-center p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                          title="Copy JSON URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleLive(session._id)}
                          disabled={session.status === "draft"}
                          title={
                            session.status === "draft"
                              ? "You must publish a session before it can go live"
                              : session.isLive
                              ? "End the live session"
                              : "Start a live session"
                          }
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            session.isLive
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {session.isLive ? (
                            <ZapOff className="w-3 h-3 mr-1" />
                          ) : (
                            <Zap className="w-3 h-3 mr-1" />
                          )}
                          {session.isLive ? "End Live" : "Go Live"}
                        </button>
                        <Link
                          to={`/editor/${session._id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md"
                        >
                          <Edit3 className="w-3 h-3 mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(session._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md"
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No sessions yet
            </h3>
            <p className="text-gray-500 mt-2">
              Create your first wellness session to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;