import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPublicSessions,
  incrementViewCount,
  Session,
} from "../services/sessionServices"; // ✅ ADDED: incrementViewCount
import { Clock, Tag, User, Loader2, ArrowLeft, Copy } from "lucide-react";
import toast from "react-hot-toast";

const SessionViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndTrackSession = async () => {
      if (!id) return;
      try {
        // Increment view count first (fire and forget)
        incrementViewCount(id);

        const response = await getPublicSessions();
        const foundSession = response.data.find((s) => s._id === id);
        if (foundSession) {
          setSession(foundSession);
        } else {
          toast.error("Session not found.");
        }
      } catch (error) {
        toast.error("Could not load the session.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndTrackSession();
  }, [id]);

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

  if (!session) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Session Not Found
        </h3>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all sessions
        </Link>
      </div>
      <div className="bg-white shadow-xl rounded-xl border border-gray-200 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {session.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 mb-6">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1.5" />
            Hosted by {session.user_id?.name || "Anonymous"}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5" />
            Updated on {formatDate(session.updated_at)}
          </div>
        </div>
        {session.tags?.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-8">
            <Tag className="w-4 h-4 text-gray-400" />
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">Session Details</h2>
          <p>
            The content for this session is loaded from the following JSON file:
          </p>
          <div className="mt-2">
            <a
              href={session.json_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 break-all hover:underline"
            >
              {session.json_file_url}
            </a>
          </div>
          <div className="mt-4">
            <button
              onClick={() => handleCopyUrl(session.json_file_url)}
              className="inline-flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              title="Copy JSON URL"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON link to clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionViewer;
