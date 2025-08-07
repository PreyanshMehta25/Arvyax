import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicSessions, Session } from "../services/sessionServices";
import { Clock, Tag, Loader2, User, Search } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicSessions = async () => {
      try {
        const response = await getPublicSessions();
        setSessions(response.data);
        setFilteredSessions(response.data);
      } catch (error) {
        toast.error("Could not load wellness sessions.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicSessions();
  }, []);

  useEffect(() => {
    const results = sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredSessions(results);
  }, [searchTerm, sessions]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getTagColor = (index: number) => {
    const colors = [
      "bg-emerald-100 text-emerald-700",
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-yellow-100 text-yellow-700",
      "bg-indigo-100 text-indigo-700",
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wellness Sessions
          </h1>
          <p className="text-gray-600">
            Discover and explore available wellness sessions
          </p>
        </div>
        <div className="relative mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {session.title}
                  </h3>
                  {session.isLive && (
                    <div className="flex items-center space-x-2 ml-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        LIVE
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-1.5" />
                  Hosted by {session.user_id?.name || "Anonymous"}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Last updated: {formatDate(session.updated_at)}
                </div>
                {session.tags?.length > 0 && (
                  <div className="flex items-start flex-wrap gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {session.tags.map((tag, index) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(
                            index
                          )}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100 mt-auto">
                <Link
                  to={`/session/${session._id}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  View Session →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No sessions found
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Check back later for new wellness sessions."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
